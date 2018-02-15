const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    // TODO: add abstract's author
    abstract: String
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
