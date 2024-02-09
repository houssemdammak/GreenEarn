const Citizen = require('../models/CitizenModel')
const mongoose = require('mongoose')
const jwt = require("jsonwebtoken");
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

//login for citizen page 
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      msg: "Bad request. Please add email and password in the request body",
    });
  }

  let foundUser = await Citizen.findOne({ email: req.body.email });
  if (foundUser) {
    const isMatch = await foundUser.comparePassword(password);

    if (isMatch) {
      const token = jwt.sign(
        { id: foundUser._id, name: foundUser.name },
        process.env.JWT_SECRET,
        {
          expiresIn: "30d",
        }
      );

      return res.status(200).json({ msg: "user logged in", token });
    } else {
      return res.status(400).json({ msg: "Bad password" });
    }
  } else {
    return res.status(400).json({ msg: "Bad credentails" });
  }
};


//resgister for citizen page 
const register = async (req, res) => {
  let foundUser = await Citizen.findOne({ email: req.body.email });
  if (foundUser === null) {
    console.log(req.body)
    let { FullName, email, password,WalletID } = req.body;
    if (FullName.length && email.length && password.length && WalletID.length) {
      const person = new Citizen({
        FullName: FullName,
        email: email,
        password: password,
        WalletID:WalletID
      });
      await person.save();
      return res.status(201).json({ person });
    }else{
        return res.status(400).json({msg: "Please add all values in the request body"});
    }
  } else {
    return res.status(400).json({ msg: "Email already in use" });
  }
};
  module.exports = {
    getCitizens,
    getCitizen,
    createCitizen,
    deleteCitizen,
    updateCitizen,
    register,
    login
  }