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
const news = mongoose.model('news', {
    id: String,
    abstract: String
});

// Routes
app.get('/news/:year/:month', function(req, res) {
    const year = req.params.year;
    const month = req.params.month;

    axios.get(base_url_wrapper + '/news/' + year + '/' + month)
    .then(news => {
        news = news.data;

        // TODO: split ISBN or ISSN and search for abstract in MongoDB and add it to document
        // news.documents.forEach(document => {
            
        // });

        news.date = new Date();
        res.status(200).json(news);
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

app.post('/news', function(req, res) {
    news.create({
        id: req.body.id,
        abstract: req.body.abstract
    })
    .then((n) => {
        news.find({ id: n.id }, function(error, nn) {
            if (error) {
                log.error(error);
                res.status(500).json({
                    error: true,
                    date: new Date(),
                    code: error
                });
            }
            res.status(200).json(nn);
        });
    })
    .catch(error => {
        log.error(error);
        res.status(500).json({
            error: true,
            date: new Date(),
            code: error
        });
    })
});

app.all('*', function(req, res) {
    res.status(404).json({error: '404 Page not found.'});
});

app.listen(8082);
