const express = require('express')
const {
    getBins,
    getBin,
    createBin,
    deleteBin,
    updateBin
}=require('../controllers/BinController')

const router = express.Router()

// GET all workouts
router.get('/',getBins )

// GET a single workout
router.get('/:id',getBin)

// POST a new workout
router.post('/',createBin)

// DELETE a workout
router.delete('/:id',deleteBin)

// UPDATE a workout
router.patch('/:id',updateBin)

module.exports = router