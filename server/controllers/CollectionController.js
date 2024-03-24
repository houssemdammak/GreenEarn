const Collection = require('../models/CollectionModel')
const Waste= require('../models/WasteModel')
const Bin=require('../models/BinModel')
const Shipper = require("../models/ShipperModel");

const mongoose = require('mongoose')
const createCollection= async (req, res) => {
    const { binID, shipperID ,BlockchainID} = req.body;
    try{
        collection = await Collection.create({BlockchainID, binID, shipperID,status:"Waiting"});
        const updatedBin = await Bin.findOneAndUpdate(
            { _id: binID },
            { shipperSelected: true }, // Mise à jour du champ shipperSelected à true
            { new: true }
        ).exec(); // exécuter la requête et attendre la réponse

      //   await Waste.updateMany(
      //     {binID:binID, status: 'Waiting' }, // Filtrer les déchets avec le statut "waiting" et le bon binID
      //     { $set: { collectionID: collection._id } } // Attribuer l'ID de la nouvelle collection
      // );
      res.status(200).json(collection);
    } catch (error) {
      // Gérer les erreurs de base de données
        return res.status(400).json({ error: 'Internal server error' });
    }
  // Si tout s'est bien passé, renvoyer le bin créé
}
const updateCollectionByshipper = async (req, res) => {
  try {
    //id pour le bin
    const { binID, collectionID } = req.body;
    const currentDate = new Date();

    // 1. Mettre à jour les déchets
    await Waste.updateMany(
      { binID: binID, status: 'Waiting' },
      { $set: { status: 'Shipped',shippingdate:currentDate  } }
    );
    await Bin.updateOne(
      { _id: binID },
      { $set: { currentWeight: 0, status: 0 ,shipperSelected: false} }
    );
    // 2. Mettre à jour la collection
    await Collection.updateOne(
      { _id: collectionID },
      { $set: { shippingdate: currentDate,status:"Shipped" } }
    );
    const updatedCollection = await Collection.findOne({ _id: collectionID });

    // Retourner la nouvelle collection mise à jour dans la réponse
    res.status(200).json({collection: updatedCollection });
    
  } catch (error) {
    // En cas d'erreur, renvoyer un statut d'erreur avec un message d'erreur
    res.status(500).json({ message: error.message });
  }
};

const getCollectionByShipper=async (req,res)=>{
  try {
    const { id } = req.params;

    // Utilisez la méthode find de Mongoose pour récupérer les collections avec le shipperID spécifié
    const collections = await Collection.find({ shipperID: id });
    const shipper = await Shipper.findOne({_id: id })
    console.log(shipper)
    // Envoyez les collections trouvées en réponse
    res.status(200).json({ collections, ShipperWalletID: shipper });
    } catch (error) {
    // En cas d'erreur, renvoyez un statut d'erreur avec un message d'erreur
    res.status(500).json({ message: error.message });
  }

}
const getShippedCollection = async (req, res) => {
  try {
    // const collections = await Collection.find({ date: { $ne: null } }).populate('binID').populate('shipperID');
    const collections = await Collection.find({ status:{ $in: ['Shipped', 'Recycled'] } }).populate('binID').populate('shipperID');
    res.status(200).json(collections);
  } catch (error) {
    // Gérer les erreurs appropriées ici
    console.error(error);
    res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des collections.' });
  }
}
const updateCollectionByCenter = async (req, res) => {
  try {
    //id pour le bin

    const {collectionID ,binID ,collectionshippingdate} = req.body;
    const currentDate = new Date();
    let Collectionshippingdate= new Date(collectionshippingdate)
    const minShippingDate = new Date(Collectionshippingdate.getTime() - 30000); // 30 secondes avant la date de collecte
    const maxShippingDate = new Date(Collectionshippingdate.getTime() + 30000); // 30 secondes après la date de collecte
    await Waste.updateMany(
      { 
        shippingdate: { $gte: minShippingDate, $lte: maxShippingDate },
        binID: binID 
      },
      { $set: { status: 'Recycled' ,recyclingdate:currentDate} }
  );   
    //console.log(wastesWithCollections)

    // 2. Mettre à jour la collection
    
    await Collection.updateOne(
      { _id: collectionID },
      { $set: {status:"Recycled" } }
    );
    const updatedCollection = await Collection.findOne({ _id: collectionID }).populate('binID').populate('shipperID');

    // Retourner la nouvelle collection mise à jour dans la réponse
    res.status(200).json({collection: updatedCollection });
    
  } catch (error) {
    // En cas d'erreur, renvoyer un statut d'erreur avec un message d'erreur
    res.status(500).json({ message: error.message });
  }
};
const deleteAllWastes = async (req, res) => {
  try {
    const result = await Waste.deleteMany({});
    const result1 = await Collection.deleteMany({});

    res.status(200).json({ message: `${result.deletedCount}  deletetion successfully` });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}
const markAsRead= async (req, res) => {
  try {
    const { notifications } = req.body; // Supposons que les IDs à marquer comme lus sont envoyés dans le corps de la requête sous la clé "ids"
    const notifIDs = notifications.map(notification => notification._id);
    console.log(notifIDs);
        
    // Vérifier si des IDs ont été envoyés
    if (!notifIDs || !Array.isArray(notifIDs) || notifIDs.length === 0) {
        return res.status(400).json({ message: "Aucun ID valide fourni." });
    }

    // Mettre à jour les collections avec les IDs fournis
    await Collection.updateMany(
        { _id: { $in: notifIDs } }, // Sélectionner les collections avec les IDs fournis
        { $set: { isNew: false } } // Mettre à jour l'attribut isNew à false
    );

    return res.status(200).json({ message: "Les collections ont été marquées comme lues avec succès." });
} catch (error) {
    console.error("Erreur lors de la mise à jour des collections:", error);
    return res.status(500).json({ message: "Une erreur est survenue lors de la mise à jour des collections." });
}
}
module.exports = {
    createCollection,deleteAllWastes,markAsRead,
    getCollectionByShipper,updateCollectionByshipper,getShippedCollection,updateCollectionByCenter
  };