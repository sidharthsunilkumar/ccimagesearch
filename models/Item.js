const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  iso: {
    type: String,
    required: true
  },
  resolution: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  }
});

module.exports = Item = mongoose.model('item', ItemSchema);
