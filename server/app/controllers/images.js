const multer = require('multer');
const Book = require('../models/book');
const use = require('./use');
const path = require('path');
const fs = require('fs');
const del = require('del');
const Log = require('log');
const log = new Log('debug');

const IMAGES_PATH = 'images';

const images = multer({ storage: multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, IMAGES_PATH);
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now());
    }
}) });

exports.images = images;

exports.addImage = function(req, res) {
    res.sendFile(path.join(__dirname + '/../static/images.html'));
}

exports.getImage = function(req, res) {
    const id = req.params.id;

    Book.findOne({ id: id }).then(found => {
        const image = found.image;
        res.setHeader('Content-Type', image.mimetype);
        fs.createReadStream(path.join(IMAGES_PATH, image.filename)).pipe(res);
    })
    .catch(() => {
        res.setHeader('Content-Type', 'image/jpeg');
        fs.createReadStream(path.join(IMAGES_PATH, 'no_image.jpg')).pipe(res);
    });
}

exports.setImage = function(req, res) {
    const id = req.body.id;
    const file = req.file;
    log.debug(file);

    Book.findOneAndUpdate({ id: id }, { image: req.file }, {
        upsert: true
    })
    .then(result => {
        log.debug(result);
        if (result && result.image)
            del([path.join(IMAGES_PATH, result.image.filename)]);

        res.status(200).json({ message: 'success' });
    })
    .catch(error => { use.send_error(error, res, 500, false); });
}

exports.deleteImage = function(req, res) {
    log.debug(req.params);
    Book.findOneAndRemove({ id: req.params.id })
    .then(n => {
        if (n && n.image)
            del([path.join(IMAGES_PATH, n.image.filename)]);
        
            const reinsert = {
            id: n.id,
            comment: n.comment,
            favourite: n.favourite,
            review: n.review
        };
        log.debug(reinsert);
        return Book.create(reinsert);
    })
    .then(book => {
        log.debug(book);
        res.status(200).json(book);
    })
    .catch(error => { use.send_error(error, res, 500, error); });
}
