const axios = require('axios');
const Log = require('log');
const log = new Log('debug');
const use = require('./use');
const Book = require('../models/book');
const baseUrlWrapper = 'http://localhost:8081';

function addContent(documents, books) {
    documents.forEach(document => {
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
        let found = books.find(n => { return n.id === id });
        if (found) {
            document.comment = found.comment;
            document.favourite = found.favourite;
            document.review = found.review;
        }
    });
}

function getBooksWithContent(res, search) {
    let books = [];
    Book.find().exists(search)
    .then(found => {
        found.forEach(f => {
            books.push(f);
        });
        let requests = found.map(f => axios.get(baseUrlWrapper + '/book/' + f.id + '/fast'));
        return axios.all(requests);
    })
    .then(results => {
        let documents = results.map(r => r.data.book);
        addContent(documents, books);
        res.status(200).json({ error: false, date: new Date(), documents: documents });
    })
    .catch(error => { use.send_error(error, res, 404, error); });
}

function setContent(req, res, content) {
    log.debug(req.body);
    Book.findOneAndUpdate({id: req.body.id}, content, {
        new: true,
        upsert: true
    })
    .then((n) => {
        res.status(200).json(n);
    })
    .catch(error => { use.send_error(error, res, 500, error); });
}

exports.getNews = function(req, res) {
    // TODO: valid year and month
    const date = new Date();
    const year = req.params.year ? req.params.year : date.getFullYear().toString();
    const month = req.params.month ? req.params.month : date.getMonth() < 9 ? '0' + (date.getMonth() + 1).toString() : (date.getMonth() + 1).toString();
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
        addContent(news.documents, books);
        res.status(200).json(news);
    })
    .catch(error => { use.send_error(error, res, 404, error); });
}

exports.getFavourites = function(req, res) {
    getBooksWithContent(res, 'favourite');
}

exports.getReviews = function(req, res) {
    getBooksWithContent(res, 'review');
}

exports.getBook = function(req, res) {
    const id = req.params.id;
    let db = {};

    Book.findOne({ id: id })
    .then(found => {
        db = found;
        return axios.get(baseUrlWrapper + '/book/' + id);
    })
    .then(result => {
        result = result.data;

        if (db) {
            result.book.comment = db.comment;
            result.book.favourite = db.favourite;
            result.book.review = db.review;
        }

        res.status(200).json(result);
    })
    .catch(error => { use.send_error(error, res, 404, error); });
}

exports.search = function(req, res) {
    const str = req.params.str;
    let documents = [];

    axios.get(baseUrlWrapper + '/search/all/' + str + '/fast')
    .then(search => {
        documents = search.data.documents;
        return Book.find();
    })
    .then(books => {
        addContent(documents, books);
        res.status(200).json({ error: false, date: new Date(), documents: documents });
    })
    .catch(error => { use.send_error(error, res, 404, error); });
}

exports.setComment = function(req, res) {
    setContent(req, res, { comment: req.body.comment });
}

exports.setFavourite = function(req, res) {
    setContent(req, res, { favourite: req.body.favourite });
}

exports.setReview = function(req, res) {
    setContent(req, res, { review: req.body.review });
}

exports.deleteComment = function(req, res) {
    log.debug(req.params);
    Book.findOneAndRemove({ id: req.params.id })
    .then(n => {
        const reinsert = {
            id: n.id,
            favourite: n.favourite,
            review: n.review,
            image: n.image
        };
        log.debug(reinsert)
        return Book.create(reinsert);
    })
    .then(book => {
        log.debug(book);
        res.status(200).json(book);
    })
    .catch(error => { use.send_error(error, res, 500, error); });
}

exports.deleteFavourite = function(req, res) {
    log.debug(req.params);
    Book.findOneAndRemove({ id: req.params.id })
    .then(n => {
        const reinsert = {
            id: n.id,
            comment: n.comment,
            review: n.review,
            image: n.image
        };
        log.debug(reinsert)
        return Book.create(reinsert);
    })
    .then(book => {
        log.debug(book);
        res.status(200).json(book);
    })
    .catch(error => { use.send_error(error, res, 500, error); });
}

exports.deleteReview = function(req, res) {
    log.debug(req.params);
    Book.findOneAndRemove({ id: req.params.id })
    .then(n => {
        const reinsert = {
            id: n.id,
            comment: n.comment,
            favourite: n.favourite,
            image: n.image
        };
        log.debug(reinsert)
        return Book.create(reinsert);
    })
    .then(book => {
        log.debug(book);
        res.status(200).json(book);
    })
    .catch(error => { use.send_error(error, res, 500, error); });
}
