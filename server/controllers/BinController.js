const Bin = require('../models/BinModel')
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

// create a new bin
const createBin = async (req, res) => {
  const {type,status,location,capacity,currentWeight} = req.body

  let emptyFields = []

  if (!type) {
    emptyFields.push('type')
  }
  if (!status) {
    emptyFields.push('status')
  }
  if (!location) {
    emptyFields.push('location')
  }
  if (!capacity) {
    emptyFields.push('capacity')
  }
  if (currentWeight===null) {
    emptyFields.push('currentWeight')
  }
  if (emptyFields.length > 0) {
    return res.status(400).json({ error: 'Please fill in all fields', emptyFields })
  }

  // add to the database
  try {
    const bin = await Bin.create({type,status,location,capacity,currentWeight})
    res.status(200).json(bin)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

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
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({error: 'No such bin'})
  }

  const bin = await Bin.findOneAndUpdate({_id: id}, {
    ...req.body
  })

  if (!bin) {
    return res.status(400).json({error: 'No such bin'})
  }

  res.status(200).json(bin)
}
const deleteAllBins = async (req, res) => {
  try {
    const result = await Bin.deleteMany({});
    res.status(200).json({ message: `${result.deletedCount} bin(s) deleted successfully` });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}
//  const getLastGeneratedId = async (req, res) => {
//     try {
//       const bins = await Bin.find({}).sort({ createdAt: -1 });
//       const lastBinId = bins.length > 0 ? bins[0].id : null; // Get the ID of the last bin created
//       res.status(200).json({lastBinId });
//     } catch (error) {
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   }
module.exports = {
  getBins,
  getBin,
  createBin,
  deleteBin,
  updateBin,
  deleteAllBins,
  //getLastGeneratedId
}