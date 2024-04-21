const Bin = require('../models/BinModel')
const qr = require('qrcode'); // Importer le package pour générer le code QR
// commande lezma :npm install qrcode --force

const mongoose = require('mongoose')
// get all bins
const getBins = async (req, res) => {
  const bins = await Bin.find({}).sort({createdAt: -1})
  res.status(200).json(bins)
}

// get a single bin
const getBin = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'No such Bin'})
  }

  const bin = await Bin.findById(id)

  if (!bin) {
    return res.status(404).json({error: 'No such bin'})
  }

  res.status(200).json(bin)
}

const createBin = async (req, res) => {
  const { type, location, capacity, currentWeight,BlockchainID } = req.body;

  let emptyFields = [];

  if (!type) {
    emptyFields.push('type');
  }

  if (!location) {
    emptyFields.push('location');
  }
  if (!capacity) {
    emptyFields.push('capacity');
  }
  if (currentWeight === null) {
    emptyFields.push('currentWeight');
  }
  if (emptyFields.length > 0) {
    return res.status(400).json({ error: 'Please fill in all fields', emptyFields });
  }
  if (!BlockchainID) {
    emptyFields.push('BlockchainID');
  }

    try {
      //console.log(type, location, capacity, currentWeight)
      // Vérifie si l'ID est déjà utilisé
          bin = await Bin.create({ BlockchainID,type, location, capacity, currentWeight });
          //////////////
          // Générez le code QR avec les données du nouveau bac
          const qrData = JSON.stringify({BinID:bin._id,Type:type,currentWeight:currentWeight});
          // Générez le code QR
      const qrCode = await qr.toDataURL(qrData);
      // Enregistrez le code QR dans la base de données
      bin.qrCode = qrCode;
      await bin.save();
        //////////
        console.log(bin)
      return res.status(200).json(bin);
    } catch (error) {
      console.log(error)
      // Gérer les erreurs de base de données
      return res.status(500).json({ error: 'Internal server error' });
    }
  

  // Si tout s'est bien passé, renvoyer le bin créé
 
};

// delete a bin
const deleteBin = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({error: 'No such bin'})
  }

  const bin = await Bin.findOneAndDelete({_id: id})

  if(!bin) {
    return res.status(400).json({error: 'No such bin'})
  }

  res.status(200).json(bin)
}

// update a bin
const updateBin = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'No such bin' });
  }

  const bin = await Bin.findById(id);

  if (!bin) {
    return res.status(400).json({ error: 'No such bin' });
  }

  // Mettre à jour les valeurs actuelles du bin avec les valeurs de la requête
  Object.assign(bin, req.body);

  // Vérifier si currentWeight ou capacity a été modifié
  const { currentWeight, capacity } = req.body;
  if (currentWeight !== undefined || capacity !== undefined) {
    // Calculer le pourcentage rempli
    bin.status = (bin.currentWeight / bin.capacity) * 100;
  }

  try {
    const updatedBin = await bin.save();
    res.status(200).json(updatedBin);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteAllBins = async (req, res) => {
  try {
    const result = await Bin.deleteMany({});
    res.status(200).json({ message: `${result.deletedCount} bin(s) deleted successfully` });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}
module.exports = {
  getBins,
  getBin,
  createBin,
  deleteBin,
  updateBin,
  deleteAllBins,
  //getLastGeneratedId
}