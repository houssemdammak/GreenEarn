const express = require ('express')
const router = express.Router()
const Shipper=require ('../models/ShipperModel')
const authMiddleware = require('../middleware/auth')
router.post('/', authMiddleware, (req, res) => {
    // Si le middleware d'authentification a été passé avec succès, cela signifie que le token est autorisé
    res.status(200).json({ msg: "Token authorized" });
  });
module.exports = router