const express = require("express");
const router = express.Router();
const Citizen = require("../models/CitizenModel");
const {
getCitizens,
  getCitizen,
  createCitizen,
  deleteCitizen,
  updateCitizen,
  register,login
} = require("../controllers/CitizenController");

//get all Citizens
router.get("/", getCitizens);

//get single Citizens
router.get("/:id", getCitizen);
//Post new Citizens
router.post("/", createCitizen);

//delete a Citizens
router.delete("/:id", deleteCitizen);

//Update a Citizens
router.patch("/:id", updateCitizen);
//login for citizien page 
router.route("/login").post(login);
//register for citizien page
router.route("/register").post(register);
module.exports = router;
