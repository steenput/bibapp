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
        cb(null, IMAGES_PATH)
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
}) });

exports.images = images;

exports.getImage = function(req, res) {
    const id = req.params.id;

    Book.findOne({ id: id }).then(found => {
        const image = found.image;
        res.setHeader('Content-Type', 'image/jpeg');
        fs.createReadStream(path.join(IMAGES_PATH, image.filename)).pipe(res);
    })
    .catch(() => {
        res.setHeader('Content-Type', 'image/jpeg');
        fs.createReadStream(path.join(IMAGES_PATH, 'no_image.jpg')).pipe(res);
    })
}

exports.setImage = function(req, res) {
    const id = req.params.id;
    log.debug(req.file);
    let newImage = {
        filename: req.file.filename
    };

    Book.findOne({ id: id }).then(found => {
        if (found) {
            return Book.update({ id: id }, { image: newImage });
        }
        else {
            return Book.create({
                id: id,
                image: newImage
            });
        }
    })
    .then(() => {
        res.status(201).json({ message: 'success' });
    })
    .catch(error => { use.send_error(error, res, 500, false); })
    
}

exports.deleteImage = function(req, res) {

}
