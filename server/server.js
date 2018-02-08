const axios = require('axios');
const fs = require('fs');
const Log = require('log');
// const log = new Log('debug', fs.createWriteStream('server.log'));
const log = new Log('debug');
const cors = require('cors');
const express = require('express');
const app = express();

app.use(cors());

const base_url_wrapper = 'http://localhost:8081';

app.get('/news/:year/:month', function(req, res) {
    log.debug('request url', req.url);
    log.debug('request params', req.params);
    res.type('json');

    const year = req.params.year;
    const month = req.params.month;

    axios.get(base_url_wrapper + '/news/' + year + '/' + month)
    .then(news => {
        news = news.data;
        log.debug(news);
        news.date = new Date();
        res.status(200).end(JSON.stringify(news));
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

app.listen(8082);
