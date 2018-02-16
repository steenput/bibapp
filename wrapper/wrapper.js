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

const base_url_nebis = 'http://www.library.ethz.ch/rib/v1/primo/documents';
const hepia_code = 'E41';
const lullier_code = 'E67';
const bulksize = '500'; // maximum authorized by API

let get_library_name = function(c) {
    let code = c.toUpperCase();
    if (code === hepia_code) return 'hepia';
    if (code === lullier_code) return 'lullier';
};

let get_by_code = function(code, year, month) {
    return axios.get(base_url_nebis, {
        params: {
            q: code + year + month,
            aleph_items: true,
            lang: 'fr',
            bulksize: bulksize,
        }
    });
};

let extract_isxn = function(isxn) {
    if (isxn === undefined) return;
    if (isxn !== null) {
        return isxn.split(' ')[0];
    }
}

let compute_documents = function(documents, result, code) {
    if (result.hits.totalhits != 0) {
        result.document.forEach(d => {
            let availability = [];
            d.availability.itemList.forEach(i => {
                if (i['z30-sub-library-code'] === hepia_code || i['z30-sub-library-code'] === lullier_code) {
                    availability.push(i);
                }
            });
            let bib = d.biblioData;
            let doc = {
                title: bib.title,
                author: bib.creator,
                type: bib.type,
                isbn: bib.identifier !== null ? extract_isxn(bib.identifier.ISBN) : undefined,
                issn: bib.identifier !== null ? extract_isxn(bib.identifier.ISSN) : undefined,
                isbn_full: bib.identifier !== null ? bib.identifier.ISBN : undefined,
                issn_full: bib.identifier !== null ? bib.identifier.ISSN : undefined,
                creationdate: bib.creationdate,
                publisher: bib.publisher,
                edition: bib.edition,
                description: bib.description,
                language: bib.language,
                format: bib.format,
                keywords: bib.keywords,
                availability: availability,
                library: get_library_name(code)
            };
            documents.push(doc);
        });
    }
    return documents;
};

app.get('/news/:year/:month', function(req, res) {
    // const offline = JSON.parse(fs.readFileSync('../../bibapp_divers/wrapper201802.json', 'utf8'));
    // res.status(200).json(offline);

    const year = req.params.year;
    const month = req.params.month;

    axios.all([get_by_code(hepia_code, year, month), get_by_code(lullier_code, year, month)])
    .then(axios.spread((hepia, lullier) => {
        log.debug(hepia.data.result.search, hepia.data.result.hits);
        log.debug(lullier.data.result.search, lullier.data.result.hits);

        let documents = [];
        documents = compute_documents(documents, hepia.data.result, hepia_code);
        documents = compute_documents(documents, lullier.data.result, lullier_code);

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

app.get('/search/:by/:keywords', function(req, res) {
    const by = req.params.by;
    const keywords = req.params.keywords;

    // TODO: some checks on :by and :keywords
    // restrict by : title, creator, isbn, issn, cdate

    axios.get(base_url_nebis, {
        params: {
            q: keywords,
            searchfield: by,
            aleph_items: true,
            lang: 'fr',
            bulksize: bulksize,
        }
    })
    // TODO: if there is more than bulksize results, do a pagination
    .then(search => {
        log.debug(search.data);

        let documents = [];
        documents = compute_documents(documents, search.data.result, hepia_code);

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

app.all('*', function(req, res) {
    log.error('Requested:', req.url, req.params);
	res.status(404).json({
        error: true,
        date: new Date(),
        code: '404 Page not found.'
    });
});

app.listen(8081);
