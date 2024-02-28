const mongoose = require('mongoose')
const Schema = mongoose.Schema

const collectionSchema = new Schema({
    binID: {
        type: Schema.Types.ObjectId,
        ref: 'Bin', // Remplacez 'Bin' par le nom du modèle référencé
        required: true
      },
    shipperID: {
        type: Schema.Types.ObjectId,
        ref: 'Shipper', // Remplacez 'Bin' par le nom du modèle référencé
        required: true
      },
    status:{
        type:String ,
    },
    shippingdate:{
      type:Date ,
  }
 
}, { timestamps: true })

module.exports = mongoose.model('Collection', collectionSchema)