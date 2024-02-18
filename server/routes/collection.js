const express = require('express')
const {createCollection}=require('../controllers/CollectionController')
  
  const router = express.Router()
  router.post('/',createCollection)
  module.exports = router;