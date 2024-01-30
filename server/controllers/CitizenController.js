const Citizen = require('../models/CitizenModel')
const mongoose = require('mongoose')
// get all Citizens
const getCitizens = async (req, res) => {
    const citizens = await Citizen.find({}).sort({createdAt: -1})
    res.status(200).json(citizens)
  }


// get a single Citizen
const getCitizen = async (req, res) => {
    const { id } = req.params
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({error: 'No such Citizen'})
    }
  
    const citizen = await Citizen.findById(id)
  
    if (!citizen) {
      return res.status(404).json({error: 'No such Citizen'})
    }
  
    res.status(200).json(citizen)
  }
// create a new Citizen
const createCitizen = async (req, res) => {
    const { ID , FullName ,BankCardNumber} = req.body
    // add to the database
    try {
      const citizen = await Citizen.create({ID, FullName, BankCardNumber})
      res.status(200).json(citizen)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }

// delete a Citizen

const deleteCitizen = async (req, res) => {
    const { id } = req.params
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({error: 'No such Citizen'})
    }
  
    const citizen = await Citizen.findOneAndDelete({_id: id})
  
    if(!citizen) {
      return res.status(400).json({error: 'No such Citizen'})
    }
  
    res.status(200).json(citizen)
  }
  
  // update a Citizen

  const updateCitizen = async (req, res) => {
    const { id } = req.params
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({error: 'No such Citizen'})
    }
  
    const citizen = await Citizen.findOneAndUpdate({_id: id}, {
      ...req.body
    })
  
    if (!citizen) {
      return res.status(400).json({error: 'No such Citizen'})
    }
  
    res.status(200).json(citizen)
  }
  
  module.exports = {
    getCitizens,
    getCitizen,
    createCitizen,
    deleteCitizen,
    updateCitizen
  }