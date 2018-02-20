const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    // TODO: add abstract's author
    abstract: String,
    image: {
        filename: String,
        created: {
            type: Date,
            default: Date.now
        }
    }
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
