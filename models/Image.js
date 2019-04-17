const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
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
    album: [
      {
          name: {
              type: String
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

module.exports = Image = mongoose.model('images', ImageSchema);