const axios = require('axios');
const Log = require('log');
const log = new Log('debug');
const use = require('./use');

const Comment = require('../models/content').Comment;
const Favourite = require('../models/content').Favourite;
const Review = require('../models/content').Review;

const urlWrapper = 'http://localhost:8081';

function addContent(documents, comments, favourites, reviews) {
    documents.forEach(document => {
        let id = '';
        if (document.isbn) {
            id = document.id = document.isbn;
        }
        else if (document.issn) {
            id = document.id = document.issn;
        }
        let found = comments.find(n => { return n.id === id });
        document.comment = found ? found.content : undefined;
        found = favourites.find(n => { return n.id === id });
        document.favourite = found ? found.content : undefined;
        found = reviews.find(n => { return n.id === id });
        document.review = found ? found.content : undefined;
    });
}

function getBooksWithUrl(res, axiosFunction) {
    Promise.all([Comment.find(), Favourite.find(), Review.find(), axiosFunction])
    .then(values => {
        const books = values[3].data;
        addContent(books.documents, values[0], values[1], values[2]);
        res.status(200).json(books);
    })
    .catch(error => { use.sendError(error, res, 404, error); });
}

function getBooksWithContent(res, search, extraContent) {
    Promise.resolve(search)
    .then(found => {
        if (found.length === 0) {
            res.status(404).json({ error: false, date: new Date(), size: 0, documents: [] });
        }
        else {
            let requests = found.map(f => axios.get(urlWrapper + '/book/' + f.id + '/fast'));
            return Promise.all([Comment.find(), extraContent, axios.all(requests)]);
        }
    })
    .then(values => {
        let documents = values[2].map(r => r.data.book);
        addContent(documents, values[0], [], values[1]);
        res.status(200).json({ error: false, date: new Date(), size: documents.length, documents: documents });
    })
    .catch(error => { use.sendError(error, res, 404, error); });
}

function setContent(req, res, model) {
    log.debug(req.body);
    model.findOneAndUpdate({ id: req.body.id }, req.body, {
        new: true,
        upsert: true
    })
    .then(n => {
        res.status(200).json(n);
    })
    .catch(error => { use.sendError(error, res, 500, error); });
}

function deleteContent(req, res, model) {
    model.findOneAndRemove({ id: req.params.id })
    .then(book => { res.status(200).json(book); })
    .catch(error => { use.sendError(error, res, 500, error); });
}

exports.search = function(req, res) {
    getBooksWithUrl(res, axios.get(urlWrapper + '/search/all/' + req.params.str + '/fast'));
}

exports.getNews = function(req, res) {
    const date = new Date();
    const year = req.params.year ? req.params.year : date.getFullYear().toString();
    const month = req.params.month ? req.params.month : date.getMonth() < 9 ? '0' + (date.getMonth() + 1).toString() : (date.getMonth() + 1).toString();
    getBooksWithUrl(res, axios.get(urlWrapper + '/news/' + year + '/' + month));
}

exports.getFavourites = function(req, res) {
    getBooksWithContent(res, Favourite.find(), Review.find());
}

exports.getReviews = function(req, res) {
    getBooksWithContent(res, Review.find(), Favourite.find());
}

exports.getBook = function(req, res) {
    const id = req.params.id;
    const objId = { id: id };
    Promise.all([Comment.findOne(objId), Favourite.findOne(objId), Review.findOne(objId), axios.get(urlWrapper + '/book/' + id)])
    .then(values => {
        const result = values[3].data;
        result.book.comment = values[0] ? values[0].content : undefined;
        result.book.favourite = values[1] ? values[1].content : undefined;
        result.book.review = values[2] ? values[2].content : undefined;
        res.status(200).json(result);
    })
    .catch(error => { use.sendError(error, res, 404, error); });
}

exports.setComment = function(req, res) {
    setContent(req, res, Comment);
}

exports.setFavourite = function(req, res) {
    setContent(req, res, Favourite);
}

exports.setReview = function(req, res) {
    setContent(req, res, Review);
}

exports.deleteComment = function(req, res) {
    deleteContent(req, res, Comment);
}

exports.deleteFavourite = function(req, res) {
    deleteContent(req, res, Favourite);
}

exports.deleteReview = function(req, res) {
    deleteContent(req, res, Review);
}
