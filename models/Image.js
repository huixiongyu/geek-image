const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    name: {
        type: String,
        default: 'image'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    originURL: {
        type: String,
        required: true
    },
    markdownURL: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Image = mongoose.model('images', ImageSchema);