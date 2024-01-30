const Shipper = require('../models/ShipperModel')
const mongoose = require('mongoose')
// get all Shippers
const getShippers = async (req, res) => {
    const shippers = await Shipper.find({}).sort({createdAt: -1})
    res.status(200).json(shippers)
  }


// get a single Shipper
const getShipper = async (req, res) => {
    const { id } = req.params
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({error: 'No such shipper'})
    }
  
    const shipper = await Shipper.findById(id)
  
    if (!shipper) {
      return res.status(404).json({error: 'No such shipper'})
    }
  
    res.status(200).json(shipper)
  }
// create a new shipper
const createShipper = async (req, res) => {
    const { ID , FullName ,Location ,TelephoneNum } = req.body
    // add to the database
    try {
      const shipper = await Shipper.create({ID, FullName,Location,TelephoneNum})
      res.status(200).json(shipper)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }

// delete a shipper

const deleteShipper = async (req, res) => {
    const { id } = req.params
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({error: 'No such shipper'})
    }
  
    const shipper = await Shipper.findOneAndDelete({_id: id})
  
    if(!shipper) {
      return res.status(400).json({error: 'No such shipper'})
    }
  
    res.status(200).json(shipper)
  }
  
  // update a shipper

  const updateShipper = async (req, res) => {
    const { id } = req.params
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({error: 'No such shipper'})
    }
  
    const shipper = await Shipper.findOneAndUpdate({_id: id}, {
      ...req.body
    })
  
    if (!shipper) {
      return res.status(400).json({error: 'No such shipper'})
    }
  
    res.status(200).json(shipper)
  }
  
  module.exports = {
    getShippers,
    getShipper,
    createShipper,
    deleteShipper,
    updateShipper
  }