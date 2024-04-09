const express = require('express')
const {
  getWastes,
  createWaste,
  deleteWaste,
  updateWaste,
  getWaste,getRewarded,markAsReadWaste,deleteAllWastes
}=require('../controllers/WasteController')

const router = express.Router()

// GET all wastes
router.get('/',getWastes )

// GET a single waste
router.get('/:id',getWaste)
router.get('/getRewarded/:id',getRewarded)
// POST a new 
router.post('/',createWaste)

// DELETE a waste
router.delete('/:id',deleteWaste)
router.delete('/',deleteAllWastes)

// UPDATE a waste
router.patch('/:id', updateWaste)
router.post('/markAsRead', markAsReadWaste)

module.exports = router