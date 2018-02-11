const axios = require('axios');
const fs = require('fs');
const Log = require('log');
// const log = new Log('debug', fs.createWriteStream('wrapper.log'));
const log = new Log('debug');
const cors = require('cors');
const express = require('express');
const app = express();

app.use(cors());

const base_url_nebis = 'http://www.library.ethz.ch/rib/v1/primo/';
const hepia_code = 'E41';
const lullier_code = 'E67';

let get_library_name = function(c) {
    let code = c.toUpperCase();
    if (code === hepia_code) return 'hepia';
    if (code === lullier_code) return 'lullier';
};

let get_by_code = function(code, year, month) {
    return axios.get(base_url_nebis + 'documents', {
        params: {
            q: code + year + month,
            aleph_items: true,
            lang: 'fr',
            bulksize: '500',   // maximum authorized by API
        }
    });
};

let compute_documents = function(documents, result, code) {
    if (result.hits.totalhits != 0) {
        result.document.forEach(d => {
            let availability = [];
            d.availability.itemList.forEach(i => {
                if (i['z30-sub-library-code'] === hepia_code || i['z30-sub-library-code'] === lullier_code) {
                    availability.push(i);
                }
            });
            let doc = {
                title: d.biblioData.title,
                author: d.biblioData.creator,
                type: d.biblioData.type,
                identifier: d.biblioData.identifier,
                creationdate: d.biblioData.creationdate,
                publisher: d.biblioData.publisher,
                edition: d.biblioData.edition,
                description: d.biblioData.description,
                language: d.biblioData.language,
                format: d.biblioData.format,
                keywords: d.biblioData.keywords,
                availability: availability,
                library: get_library_name(code)
            };
            documents.push(doc);
        });
    }
    return documents;
};

app.get('/news/:year/:month', function(req, res) {
    log.debug('request url', req.url);
    log.debug('request params', req.params);

    const year = req.params.year;
    const month = req.params.month;

    axios.all([get_by_code(hepia_code, year, month), get_by_code(lullier_code, year, month)])
    .then(axios.spread((hepia, lullier) => {
        log.debug(hepia.data);
        log.debug(lullier.data);

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

app.get('/search/:by/:keywords/:sortfield', function(req, res) {
    log.debug('request url', req.url);
    log.debug('request params', req.params);

});

app.all('*', function(req, res) {
    log.error('Requested:', req.url, req.params);
	res.status(404).json({
        error: true,
        code: '404 Page not found.'
    });
});

app.listen(8081);
