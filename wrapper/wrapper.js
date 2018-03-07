const axios = require('axios');
const fs = require('fs');
const Log = require('log');
// const log = new Log('debug', fs.createWriteStream('wrapper.log'));
const log = new Log('debug');
const cors = require('cors');
const express = require('express');
const app = express();
const morgan = require('morgan');

app.use(morgan('dev'));
app.use(cors());

const baseUrlNebis = 'http://www.library.ethz.ch/rib/v1/primo/documents';
const hepiaCode = 'E41';
const lullierCode = 'E67';
const bulksize = '500'; // maximum authorized by API

function getByCode(code, year, month) {
    return axios.get(baseUrlNebis, {
        params: {
            q: code + year + month,
            // aleph_items: true, // no need of availability to construct the list
            lang: 'fr',
            bulksize: bulksize,
        }
    });
}

function extractIsxn(isxn) {
    if (isxn === undefined) return;
    if (isxn !== null) {
        return isxn.split(' ')[0];
    }
}

function computeDocuments(documents, result) {
    if (result.hits.totalhits != 0) {
        result.document.forEach(d => {
            let availability = [];
            if (d.availability.itemList) {
                d.availability.itemList.forEach(i => {
                    if (i['z30-sub-library-code'] === hepiaCode || i['z30-sub-library-code'] === lullierCode) {
                        let a = {
                            library: i['z30-sub-library'],
                            callNo: i['z30-call-no'],
                            status: i.status === null ? 'disponible' : i.status
                        }
                        availability.push(a);
                    }
                });
            }
            let bib = d.biblioData;
            let doc = {
                title: bib.title,
                author: bib.creator,
                type: bib.type,
                isbn: bib.identifier !== null ? extractIsxn(bib.identifier.ISBN) : undefined,
                issn: bib.identifier !== null ? extractIsxn(bib.identifier.ISSN) : undefined,
                isbnFull: bib.identifier !== null ? bib.identifier.ISBN : undefined,
                issnFull: bib.identifier !== null ? bib.identifier.ISSN : undefined,
                creationdate: bib.creationdate,
                publisher: bib.publisher,
                edition: bib.edition,
                description: bib.description,
                language: bib.language,
                format: bib.format,
                keywords: bib.keywords,
                availability: availability
            };
            documents.push(doc);
        });
    }
    return documents;
}

app.get('/news/:year/:month', function(req, res) {
    // const offline = JSON.parse(fs.readFileSync('../../bibapp_divers/wrapper_news_2018_02.json', 'utf8'));
    // res.status(200).json(offline);
    // return;

    const year = req.params.year;
    const month = req.params.month;

    axios.all([getByCode(hepiaCode, year, month), getByCode(lullierCode, year, month)])
    .then(axios.spread((hepia, lullier) => {
        log.debug(hepia.data.result.search, hepia.data.result.hits);
        log.debug(lullier.data.result.search, lullier.data.result.hits);

        let documents = [];
        documents = computeDocuments(documents, hepia.data.result);
        documents = computeDocuments(documents, lullier.data.result);

        res.status(200).json({
            error: false,
            date: new Date(),
            size: documents.length,
            documents: documents
        });
    }))
    .catch(error => {
        log.error(error);
        res.status(404).json({
            error: true,
            date: new Date(),
            code: error.code
        });
    });
});

app.get('/search/:by/:keywords/:fast?', function(req, res) {
    const by = req.params.by;
    const keywords = req.params.keywords;
    const fast = req.params.fast === undefined;
    
    // TODO: some checks on :by and :keywords
    // restrict by : title, creator, isbn, issn, cdate
    
    axios.get(baseUrlNebis, {
        params: {
            q: keywords,
            searchfield: by,
            aleph_items: fast,
            lang: 'fr',
            bulksize: 100,
        }
    })
    // TODO: if there is more than bulksize results, do a pagination
    .then(search => {
        log.debug(search.data);
        
        let documents = [];
        documents = computeDocuments(documents, search.data.result);
        
        res.status(200).json({
            error: false,
            date: new Date(),
            size: documents.length,
            documents: documents
        });
    })
    .catch(error => {
        log.error(error);
        res.status(404).json({
            error: true,
            date: new Date(),
            code: error.code
        });
    });
});

app.get('/book/:id/:fast?', function(req, res) {
    const id = req.params.id;
    const searchUrl = 'http://localhost:8081/search/';
    const fast = req.params.fast ? '/fast' : '';

    axios.all([axios.get(searchUrl + 'isbn/' + id + fast), axios.get(searchUrl + 'issn/' + id + fast)])
    .then(results => {
        let book = {};
        results.forEach(r => {
            if (r.data.size > 0) {
                book = r.data.documents[0];
            }
        });
        res.status(200).json({
            error: false,
            date: new Date(),
            book: book
        });
    })
    .catch(error => {
        log.error(error);
        res.status(404).json({
            error: true,
            date: new Date(),
            code: error.code
        });
    });
});

app.all('*', function(req, res) {
    log.error('Requested:', req.url, req.params);
	res.status(404).json({
        error: true,
        date: new Date(),
        code: '404 Page not found.'
    });
});

app.listen(8081);
console.log('wrapper listen on port 8081');
