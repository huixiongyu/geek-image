const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CodeSchema = new Schema({
    phone: {
        type: String,
        default: ''
    },
    codeNum: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Code = mongoose.model('code', CodeSchema);