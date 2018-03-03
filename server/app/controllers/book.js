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
            if (found) { document.comment = found.comment; }
        });

        news.date = new Date();
        res.status(200).json(news);
    })
    .catch(error => { use.send_error(error, res, 404, error); });
}

exports.getFavourites = function(req, res) {
    let favourites = [];

    Book.find().exists('favourite')
    .then(found => {
        found.forEach(f => {
            favourites.push(f);
        });
        let requests = found.map(f => axios.get(baseUrlWrapper + '/book/' + f.id));
        return axios.all(requests);
    })
    .then(results => {
        let documents = results.map(r => r.data.book);
        documents.forEach(document => {
            if (document.isbn) {
                id = document.id = document.isbn;
            }
            else if (document.issn) {
                id = document.id = document.issn;
            }
            let found = favourites.find(n => { return n.id === id});
            if (found) { document.favourite = found.favourite; }
        });
    
        res.status(200).json({ error: false, date: new Date(), documents: documents });
    })
    .catch(error => { use.send_error(error, res, 404, error); });
}

exports.getReviews = function(req, res) {
    let reviews = [];

    Book.find().exists('review')
    .then(found => {
        found.forEach(f => {
            log.debug(f.id)
            reviews.push(f);
        });
        let requests = found.map(f => axios.get(baseUrlWrapper + '/book/' + f.id));
        return axios.all(requests);
    })
    .then(results => {
        let documents = results.map(r => r.data.book);
        documents.forEach(document => {
            if (document.isbn) {
                id = document.id = document.isbn;
            }
            else if (document.issn) {
                id = document.id = document.issn;
            }
            let found = reviews.find(n => { return n.id === id});
            if (found) { document.review = found.review; }
        });
    
        res.status(200).json({ error: false, date: new Date(), documents: documents });
    })
    .catch(error => { use.send_error(error, res, 404, error); });
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

        result.date = new Date();
        res.status(200).json(result);
    })
    .catch(error => { use.send_error(error, res, 404, error); });
}

exports.search = function(req, res) {
    const str = req.params.str;
    let documents = [];

    axios.get(baseUrlWrapper + '/search/all/' + str)
    .then(search => {
        documents = search.data.documents;
        return Book.find();
    })
    .then(found => {
        documents.forEach(document => {
            if (document.isbn) {
                id = document.id = document.isbn;
            }
            else if (document.issn) {
                id = document.id = document.issn;
            }
            found = found.find(n => { return n.id === id});
            if (found) {
                document.comment = found.comment;
                document.favourite = found.favourite; 
            }
        });

        // documents.date = new Date();
        res.status(200).json({ error: false, date: new Date(), documents: documents });
    })
    .catch(error => { use.send_error(error, res, 404, error); });

}

exports.setComment = function(req, res) {
    log.debug(req.body);
    Book.findOneAndUpdate({id: req.body.id}, {comment: req.body.comment}, {
        new: true,
        upsert: true
    })
    .then((n) => {
        res.status(200).json(n);
    })
    .catch(error => { use.send_error(error, res, 500, error); });
}

exports.setFavourite = function(req, res) {
    log.debug(req.body);
    Book.findOneAndUpdate({id: req.body.id}, {favourite: req.body.favourite}, {
        new: true,
        upsert: true
    })
    .then((n) => {
        res.status(200).json(n);
    })
    .catch(error => { use.send_error(error, res, 500, error); });
}

exports.setReview = function(req, res) {
    log.debug(req.body);
    Book.findOneAndUpdate({id: req.body.id}, {review: req.body.review}, {
        new: true,
        upsert: true
    })
    .then((n) => {
        res.status(200).json(n);
    })
    .catch(error => { use.send_error(error, res, 500, error); });
}
