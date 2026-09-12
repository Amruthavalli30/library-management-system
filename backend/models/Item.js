const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  author: {
    type: String
  },
  totalCopies: {
    type: Number,
    default: 1
  },
  availableCopies: {
    type: Number,
    default: 1
  }
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);
