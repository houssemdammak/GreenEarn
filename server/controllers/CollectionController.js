const Collection = require('../models/CollectionModel')
const Bin=require('../models/BinModel')
const mongoose = require('mongoose')
const createCollection= async (req, res) => {
    const { binID, shipperID } = req.body;
    try{
        collection = await Collection.create({ binID, shipperID});
        const updatedBin = await Bin.findOneAndUpdate(
            { _id: binID },
            { shipperSelected: true }, // Mise à jour du champ shipperSelected à true
            { new: true }
        ).exec(); // exécuter la requête et attendre la réponse

    } catch (error) {
      // Gérer les erreurs de base de données
        return res.status(500).json({ error: 'Internal server error' });
    }
  

  // Si tout s'est bien passé, renvoyer le bin créé
  res.status(200).json(collection);

}
module.exports = {
    createCollection,
  };