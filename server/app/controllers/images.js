const multer = require('multer');
const Image = require('../models/image');
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
    Image.findOne({ id: req.params.id }).then(image => {
        res.setHeader('Content-Type', image.mimetype);
        fs.createReadStream(path.join(IMAGES_PATH, image.filename)).pipe(res);
    })
    .catch(() => {
        res.setHeader('Content-Type', 'image/jpeg');
        fs.createReadStream(path.join(IMAGES_PATH, 'no_image.jpg')).pipe(res);
    });
}

exports.setImage = function(req, res) {
    log.debug(req.file);
    Image.findOneAndUpdate({ id: req.body.id }, req.file, {
        upsert: true
    })
    .then(oldImage => {
        log.debug(oldImage);
        if (oldImage)
            del([path.join(IMAGES_PATH, oldImage.filename)]);

        res.status(200).json({ message: 'Image uploaded' });
    })
    .catch(error => { use.send_error(error, res, 500, false); });
}

exports.deleteImage = function(req, res) {
    log.debug(req.params);
    Image.findOneAndRemove({ id: req.params.id })
    .then(oldImage => {
        if (oldImage) del([path.join(IMAGES_PATH, oldImage.filename)]);
        res.status(200).json({ message: 'Image deleted' });
    })
    .catch(error => { use.send_error(error, res, 500, error); });
}
