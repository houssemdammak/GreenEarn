const mongoose = require('mongoose')
const Schema = mongoose.Schema

const binSchema = new Schema({
  id: {
    type: Number,
    unique:true 
  },
  type: {
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
    type: Number,
    required: true
  },
  status :{
    type: String,
    required: true
  }
}, { timestamps: true })
// Hook pre-save pour générer automatiquement l'ID
binSchema.pre('save', async function(next) {
  try {
    if (!this.id) {
      const count = await this.constructor.countDocuments();
      this.id = count + 1;
    }
    next();
  } catch (error) {
    next(error);
  }
});
module.exports = mongoose.model('Bin', binSchema)