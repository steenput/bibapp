const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    comment: String,
    favourite: String,
    review: String,
    image: {
        originalname: String,
        filename: String,
        encoding: String,
        mimetype: String,
        destination: String,
        path: String,
        size: Number
    }
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
