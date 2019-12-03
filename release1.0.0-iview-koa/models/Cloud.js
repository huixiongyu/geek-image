const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CloudSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    cloudName: {
        type: String,
        required: true
    },
    accessKey: {
        type: String,
        required: true
    },
    secretKey: {
        type: String,
        required: true
    },
    bucketName: {
        type: String,
        required: true
    },
    zone: {
        type: String,
        required: true
    },
    bindURL: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Cloud = mongoose.model('cloud', CloudSchema);