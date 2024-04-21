const Citizen = require('../models/CitizenModel')
const Waste = require('../models/WasteModel')

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
          expiresIn: "1m",
        }
      );

      return res.status(200).json({ id: foundUser._id, name: foundUser.FullName, token,WalletID: foundUser.WalletID});
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
    let { FullName, email, password,WalletID } = req.body;
    console.log(FullName, email, password,WalletID)

    if (FullName.length && email.length && password.length && WalletID.length) {
      const person = new Citizen({
        FullName: FullName,
        email: email,
        password: password,
        WalletID:WalletID
      });
      
      await person.save();
      const token = jwt.sign(
        { id: person._id, name: person.FullName },
        process.env.JWT_SECRET,
        {
          expiresIn: "15d",
        }
      );
      return res.status(201).json({ id:person._id,name:person.FullName ,token,WalletID:person.WalletID});
    }else{
        return res.status(400).json({msg: "Please add all values in the request body"});
    }
  } else {
    return res.status(400).json({ msg: "Email already in use" });
  }
};
const getBalance = async (req, res) => {
  const { citizenID } = req.params; // Supposons que citizenID est envoyé en tant que paramètre dans la requête

  try {
    // Récupérer tous les déchets recyclés du citoyen
    const recycledWastes = await Waste.find({ citizenID, status: 'Recycled' });

    // Calculer la balance en multipliant le poids de chaque déchet recyclé par 1000
    let balance = 0;
    recycledWastes.forEach(waste => {
      balance += waste.weight * 1000;
    });

    // Mettre à jour la balance du citoyen dans la base de données
    await Citizen.findByIdAndUpdate(citizenID, { balance });

    return res.status(200).json({ balance });
  } catch (error) {
    console.error('Error fetching balance:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getBalance };
  module.exports = {
    getCitizens,
    getCitizen,
    createCitizen,
    deleteCitizen,
    updateCitizen,
    register,
    login,
    getBalance
  }