// Requires
const axios = require('axios');
const fs = require('fs');
const Log = require('log');
// const log = new Log('debug', fs.createWriteStream('server.log'));
const log = new Log('debug');
const cors = require('cors');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');                   // log requests to the console (express4)
const body_parser = require('body-parser');         // pull information from HTML POST (express4)
const method_override = require('method-override'); // simulate DELETE and PUT (express4)

// My const
const base_url_wrapper = 'http://localhost:8081';

// Config
mongoose.connect('mongodb://localhost/test');
app.use(morgan('dev'));                                          // log every request to the console
app.use(body_parser.urlencoded({'extended': 'true'}));           // parse application/x-www-form-urlencoded
app.use(body_parser.json());                                     // parse application/json
app.use(body_parser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(method_override());
app.use(cors());

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'DELETE, PUT');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Models
const aNews = mongoose.model('news', {
    id: String,
    abstract: String
});

let send_error = function(error, res, status, code) {
    log.error(error);
    res.status(status).json({
        error: true,
        date: new Date(),
        code: code ? error.code : error
    });
};

// Routes
app.get('/news/:year/:month', function(req, res) {
    const year = req.params.year;
    const month = req.params.month;
    let mongo_news = [];

    aNews.find().exec()
    .then(found => {
        found.forEach(f => {
            mongo_news.push(f);
        });
        return axios.get(base_url_wrapper + '/news/' + year + '/' + month);
    })
    .then(news => {
        news = news.data;

        news.documents.forEach(document => {
            let id = '';
            if (document.isbn) {
                id = document.id = document.isbn;
                // document.id = id;
            }
            else if (document.issn) {
                id = document.id = document.issn;
                // document.id = id;
            }
            else {
                // TODO: set an id 
            }
            let found = mongo_news.find(n => { return n.id === id});
            if (found) { document.abstract = found.abstract; }
        });

        news.date = new Date();
        res.status(200).json(news);
    })
    .catch(error => { send_error(error, res, 404, true); });
});

app.post('/news', function(req, res) {
    aNews.create({
        id: req.body.id,
        abstract: req.body.abstract
    })
    .then((n) => {
        aNews.find({ id: n.id }, function(error, news) {
            if (error) send_error(error, res, 500, false);
            res.status(200).json(news);
        });
    })
    .catch(error => { send_error(error, res, 500, false); });
});

app.all('*', function(req, res) {
    res.status(404).json({error: '404 Page not found.'});
});

app.listen(8082);
