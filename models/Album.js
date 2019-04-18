const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AlbumSchema = new Schema({
    name: {
        type: String,
        default: ''
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    selected: {
        type: Boolean,
        default: false
    },
    images:[
        {
            name: {
                type: String
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
        }
    ],
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Album = mongoose.model('album', AlbumSchema);