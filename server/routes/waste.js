const express = require('express')
const {
  getWastes,
  createWaste,
  deleteWaste,
  updateWaste,
  getWaste
}=require('../controllers/WasteController')

const router = express.Router()

// GET all workouts
router.get('/',getWastes )

// GET a single workout
router.get('/:id',getWaste)

// POST a new 
router.post('/',createWaste)

// DELETE a workout
router.delete('/:id',deleteWaste)

// UPDATE a workout
router.patch('/:id', updateWaste)

module.exports = router