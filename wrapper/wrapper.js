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

app.get('/news/:library_code/:year/:month', function(req, res) {
    log.debug('request url', req.url);
    log.debug('request params', req.params);
    res.type('json');

    const code = req.params.library_code.toUpperCase();
    const year = req.params.year;
    const month = req.params.month;
    
    axios.get(base_url_nebis + 'documents', {
        params: {
            q: code + year + month,
            aleph_items: true,
            sortfield: 'stitle',
            lang: 'fr',
            bulksize: '500',   // maximum authorized by API
        }
    })
    .then(news => {
        log.debug(news.data);
        let documents = [];
        if (news.data.result.hits.totalhits != 0) {
            news.data.result.document.forEach(d => {
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
                    availability: availability
                };
                documents.push(doc);
            });
        }
        res.status(200).end(JSON.stringify({
            date: new Date(),
            size: documents.length,
            documents: documents
        }));
    })
    .catch(error => {
        log.error('error', error);
        res.status(404).end(JSON.stringify({error: true}));
    });
});

app.all('*', function(req, res) {
    log.error('Requested:', req.url, req.params);
    res.type('html');
	res.status(404).send('404 Page not found.');
});

app.listen(8081);
