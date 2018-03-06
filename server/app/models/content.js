const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
}, { timestamps: true });

exports.Comment = mongoose.model('Comment', contentSchema);
exports.Favourite = mongoose.model('Favourite', contentSchema);
exports.Review = mongoose.model('Review', contentSchema);
