const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    // TODO: add comment's author
    comment: String,
    image: {
        filename: String,
        created: {
            type: Date
        }
    }
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
