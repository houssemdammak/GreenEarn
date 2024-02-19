const express = require('express')
const {createCollection,getCollectionByShipper}=require('../controllers/CollectionController')
  const router = express.Router()
  router.post('/',createCollection)
  //get collection by shipper
  router.get('/:id',getCollectionByShipper)

  module.exports = router;