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
    const { weight, citizenID, binID } = req.body;
    console.log(req.body)
    try {
      // Créez un nouveau document Waste avec les données fournies
      const newWaste = new Waste({
        status: "Waiting",
        weight: weight,
        dateAdded: new Date(), // Ajoutez la date actuelle
        citizenID: citizenID,
        binID: binID
      });
  
      // Enregistrez le nouveau déchet dans la base de données
      const savedWaste = await newWaste.save();
  
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


module.exports = {
  getWastes,
  createWaste,
  deleteWaste,
  updateWaste,
  getWaste
};