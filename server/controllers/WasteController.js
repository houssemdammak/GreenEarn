const Waste = require('../models/WasteModel'); // Import du modèle Bag
const Bin= require('../models/BinModel'); 
const mongoose = require('mongoose');

// Récupérer tous les sacs
const getWastes = async (req, res) => {
  try {
    const Wastes = await Waste.find({}).sort({ createdAt: -1 });
    res.status(200).json(Wastes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupérer un seul sac
// const getWaste = async (req, res) => {
//   const { id } = req.params;

//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return res.status(404).json({ error: 'Aucun waste trouvé' });
//   }

//   try {
//     const waste = await Waste.find({ citizenID: id });
//     console.log(waste)
    
//     if (!waste) {
//       return res.status(404).json({ error: 'Aucun waste trouvé' });
//     }
//     const bin = await Bin.findOne({ _id: waste.binID });

//     if (!bin) {
//       return res.status(404).json({ error: 'Aucun bac trouvé pour ce déchet' });
//     }
//     res.status(200).json(waste,{location:bin.location ,type:bin.type});
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
//get waste pour la page citizen filtrer les wastes par citizen 
const getWaste = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Aucun waste trouvé' });
  }

  try {
    const waste = await Waste.find({ citizenID: id });
    console.log(waste);
    
    if (!waste || waste.length === 0) {
      return res.status(404).json({ error: 'Aucun waste trouvé' });
    }

    const binIds = waste.map(w => w.binID);
    const bins = await Bin.find({ _id: { $in: binIds } });

    if (!bins || bins.length === 0) {
      return res.status(404).json({ error: 'Aucun bac trouvé pour ces déchets' });
    }

    const response = waste.map(w => {
      const bin = bins.find(b => b._id.toString() === w.binID.toString());
      return { ...w._doc, location: bin.location, type: bin.type };
    });

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Créer un nouveau sac
const createWaste = async (req, res) => {
  const { weight, citizenID, binID,BlockchainID } = req.body;

  // Formater la date au format "JJ/MM/AAAA HH:MM"
  const currentDate = new Date();
  try {
      // Créez un nouveau document Waste avec les données fournies
      const newWaste = new Waste({
          status: "Waiting",
          weight: weight,
          dateAdded: currentDate, // Ajoutez la date actuelle
          citizenID: citizenID,
          binID: binID,
          BlockchainID:BlockchainID
      });

      // Enregistrez le nouveau déchet dans la base de données
      const savedWaste = await newWaste.save();

      // Mettre à jour le bac associé
      try {
          // Récupérer le bac associé au déchet
          const updatedBin = await Bin.findOneAndUpdate(
              { _id: binID },
              { $inc: { currentWeight: weight } },
              { new: true }
          ).exec(); // exécuter la requête et attendre la réponse

          // Calculer le pourcentage rempli
          const filledPercentage = (updatedBin.currentWeight / updatedBin.capacity) * 100;

          // Mettre à jour le statut du bac avec le pourcentage rempli
          await Bin.findOneAndUpdate(
              { _id: binID },
              { $set: { status: filledPercentage } }
          );

          console.log("Bin mis à jour avec succès :", updatedBin);
          // Faire quelque chose avec le document mis à jour
      } catch (err) {
          console.error("Erreur lors de la mise à jour du bin :", err);
          // Gérer l'erreur
      }

      // Répondre avec le déchet nouvellement créé
      res.status(201).json(savedWaste);
  } catch (error) {
      // Gérer les erreurs de manière appropriée
      console.error('Erreur lors de la création du déchet :', error);
      res.status(400).json({ error: error.message });
  }
};
// Supprimer un sac
const deleteWaste = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Aucun waste trouvé' });
  }

  try {
    const waste = await Waste.findOneAndDelete({ _id: id });
    if (!waste) {
      return res.status(404).json({ error: 'Aucun waste trouvé' });
    }
    res.status(200).json(waste);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mettre à jour un sac
const updateWaste = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Aucun waste trouvé' });
  }

  try {
    const waste = await Waste.findByIdAndUpdate(id, req.body, { new: true });
    if (!waste) {
      return res.status(404).json({ error: 'Aucun waste trouvé' });
    }
    res.status(200).json(waste);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getRewarded = async (req, res) => {
  try {
      const { id } = req.params; // Supposons que l'ID du citoyen est passé en tant que paramètre dans la requête

      // Récupérer les déchets avec citizenID=id et recycledDate != null
      const rewardedWastes = await Waste.find({
          citizenID: id,
          recyclingdate: { $ne: null }
      });

      res.status(200).json(rewardedWastes);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Une erreur s'est produite lors de la récupération des déchets récompensés." });
  }
};
const markAsReadWaste = async (req, res) => {
  const { ids } = req.body;
  try {
    // Mettre à jour les produits avec les IDs fournis pour marquer les notifications comme lues
    await Waste.updateMany({ _id: { $in: ids } }, { isNew: false });
    res.status(200).json({ message: 'Notifications marked as read successfully.' });
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    res.status(500).json({ message: 'Failed to mark notifications as read.' });
  }
};


module.exports = {
  getWastes,
  createWaste,
  deleteWaste,
  updateWaste,
  getWaste,
  getRewarded,markAsReadWaste
};
