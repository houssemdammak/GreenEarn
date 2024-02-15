const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const wasteSchema = new Schema({
    status: {
        type: String,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    dateAdded: {
        type: Date,
        required:true
    },
    citizenID: {
        type: Schema.Types.ObjectId,
        ref: 'Citizen', // Remplacez 'Citizen' par le nom du modèle référencé
        required: true
      },
    binID: {
        type: Schema.Types.ObjectId,
        ref: 'Bin', // Remplacez 'Bin' par le nom du modèle référencé
        required: true
      },
    ///binid et status
});


module.exports = mongoose.model('Waste', wasteSchema);