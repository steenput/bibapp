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
        filename: String,
        created: {
            type: Date
        }
    }
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
