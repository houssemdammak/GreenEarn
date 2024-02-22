const mongoose = require('mongoose')
const Schema = mongoose.Schema

const binSchema = new Schema({
  BlockchainID: {
    type: String
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
    type: Number,
    default: function() {
      return (this.currentWeight / this.capacity) * 100;
    } 
   },
   shipperSelected:{
    type:Boolean,
    default:false 
   }
//    ,
//    collectionID: {
//     type: Schema.Types.ObjectId,
//     ref: 'Collection', // Remplacez 'Collection' par le nom du modèle référencé pour les ramassages
// },
}, { timestamps: true })

module.exports = mongoose.model('Bin', binSchema)