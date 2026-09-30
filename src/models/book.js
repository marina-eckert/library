const mongoose = require('mongoose');
const { randomUUID } = require('crypto');

const bookSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: randomUUID,
      unique: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    authors: {
      type: String,
      default: ''
    },
    favorite: {
      type: Boolean,
      default: false
    },
    fileCover: {
      type: String,
      default: ''
    },
    fileName: {
      type: String,
      default: ''
    },
    fileBook: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Book', bookSchema);