const express = require ('express')
const router = express.Router()
const Shipper=require ('../models/ShipperModel')
const {
    login,
    getShippers,
    getShipper,
    createShipper,
    deleteShipper,
    updateShipper
} =require ('../controllers/ShipperController')
const authMiddleware = require('../middleware/auth')

//login shipper 
router.post("/login",login)

//get all Shippers
router.get('/',authMiddleware,getShippers)

//get single Shipper
router.get('/:id',getShipper)

//Post new Shipper
router.post('/',createShipper)

//delete a Shipper
router.delete('/:id',deleteShipper)
    
//Update a Shipper
router.patch('/:id',updateShipper)



module.exports = router