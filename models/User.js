const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        default: ''
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
      type: String
    },
    banned: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = User = mongoose.model('users', UserSchema);