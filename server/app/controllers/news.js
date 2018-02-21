const axios = require('axios');
const Log = require('log');
const log = new Log('debug');
const use = require('./use');

const Book = require('../models/book');

const baseUrlWrapper = 'http://localhost:8081';

exports.getNews = function(req, res) {
    // TODO: valid year and month
    const year = req.params.year;
    const month = req.params.month;
    let books = [];

    Book.find()
    .then(found => {
        found.forEach(f => {
            books.push(f);
        });
        return axios.get(baseUrlWrapper + '/news/' + year + '/' + month);
    })
    .then(news => {
        news = news.data;
        news.documents.forEach(document => {
            let id = '';
            if (document.isbn) {
                id = document.id = document.isbn;
            }
            else if (document.issn) {
                id = document.id = document.issn;
            }
            else {
                // TODO: set an id 
            }
            let found = books.find(n => { return n.id === id});
            if (found) { document.abstract = found.abstract; }
        });

        news.date = new Date();
        res.status(200).json(news);
    })
    .catch(error => { use.send_error(error, res, 404, true); });
}

exports.setAbstract = function(req, res) {
    log.debug(req.body);
    Book.create({
        id: req.body.id,
        abstract: req.body.abstract
    })
    .then((n) => {
        res.status(200).json(n);        
    })
    .catch(error => { use.send_error(error, res, 500, false); });
}
