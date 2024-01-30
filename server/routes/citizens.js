const express = require("express");
const router = express.Router();
const Citizen = require("../models/CitizenModel");
const {
getCitizens,
  getCitizen,
  createCitizen,
  deleteCitizen,
  updateCitizen,
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

module.exports = router;
