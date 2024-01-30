const mongoose = require('mongoose')

const Schema = mongoose.Schema

const binSchema = new Schema({
  type: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
  currentWeight: {
    type: String,
    required: true
  }

}, { timestamps: true })

module.exports = mongoose.model('Bin', binSchema)