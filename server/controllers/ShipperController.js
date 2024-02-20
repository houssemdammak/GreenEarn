const Shipper = require("../models/ShipperModel");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Collection= require("../models/CollectionModel")
// get all Shippers
const getShippers = async (req, res) => {
  const shippers = await Shipper.find({}).sort({ createdAt: -1 });
  res.status(200).json(shippers);
};
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      msg: "Bad request. Please add email and password in the request body",
    });
  }

  let foundUser = await Shipper.findOne({ email: req.body.email });
  if (foundUser) {
    const isMatch = await foundUser.comparePassword(password);

    if (isMatch) {
      const token = jwt.sign(
        { id: foundUser._id, name: foundUser.FullName },
        process.env.JWT_SECRET,
        {
          expiresIn: "2m",
        }
      );
      console.log(token,foundUser._id,foundUser.FullName)
      return res.status(200).json({ msg: "Shipper logged in", token,id:foundUser._id,name:foundUser.FullName });
      
    } else {
      return res.status(200).json({ msg: "Bad password" });
    }
  } else {
    return res.status(200).json({ msg: "Bad credentials" });
  }
};

// get a single Shipper
const getShipper = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such shipper aaaa" });
  }

  const shipper = await Shipper.findById(id);

  if (!shipper) {
    return res.status(404).json({ error: "No such shipper" });
  }

  res.status(200).json(shipper);
};
// create a new shipper
// const createShipper = async (req, res) => {
//   const { ID, FullName, Location, TelephoneNum } = req.body;
//   // add to the database
//   try {
//     const shipper = await Shipper.create({
//       ID,
//       FullName,
//       Location,
//       TelephoneNum,
//     });
//     res.status(200).json(shipper);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// delete a shipper

const deleteShipper = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "No such shipper" });
  }

  const shipper = await Shipper.findOneAndDelete({ _id: id });

  if (!shipper) {
    return res.status(400).json({ error: "No such shipper" });
  }

  res.status(200).json(shipper);
};

// update a shipper

const updateShipper = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "No such shipper" });
  }

  const shipper = await Shipper.findOneAndUpdate(
    { _id: id },
    {
      ...req.body,
    }
  );

  if (!shipper) {
    return res.status(400).json({ error: "No such shipper" });
  }

  res.status(200).json(shipper);
};
//resgister for citizen page
const createShipper = async (req, res) => {
  let foundUser = await Shipper.findOne({ email: req.body.email });
  if (foundUser === null) {
    console.log(req.body);
    let { ID,FullName,Location,TelephoneNum, email, password } = req.body;
    console.log(ID,FullName,Location,TelephoneNum, email, password)
    if (FullName.length && email.length && password.length && Location.length) {
      const person = new Shipper({
        ID:ID,
        FullName: FullName,
        email: email,
        password: password,
        Location: Location,
        TelephoneNum:TelephoneNum
      });
      await person.save();
      return res.status(201).json({ person });
    } else {
      return res
        .status(400)
        .json({ msg: "Please add all values in the request body" });
    }
  } else {
    return res.status(400).json({ msg: "Email already in use" });
  }
};
const getCollectionByShipper=async (req,res)=>{
  try {
    const { id } = req.params;

    // Utilisez la méthode find de Mongoose pour récupérer les collections avec le shipperID spécifié
    const collections = await Collection.find({ shipperID: id }).populate('binID');

    // Envoyez les collections trouvées en réponse
    res.status(200).json(collections);
  } catch (error) {
    // En cas d'erreur, renvoyez un statut d'erreur avec un message d'erreur
    res.status(400).json({ message: error.message });
  }

}
module.exports = {
  login,
  getShippers,
  getShipper,
  createShipper,
  deleteShipper,
  updateShipper,
  getCollectionByShipper,
};
