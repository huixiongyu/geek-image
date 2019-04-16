const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CloudSchema = new Schema({
    cloudname: {
        type: String,
        required: true
    },
    accessKey: {
        type: String
    },
    secretKey: {
        type: String
    },
    buckName: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Cloud = mongoose.model('cloud', CloudSchema);