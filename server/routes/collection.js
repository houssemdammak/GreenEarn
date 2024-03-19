const express = require('express')
const {createCollection,getCollectionByShipper,updateCollectionByCenter,deleteAllWastes,markAsRead,
  updateCollectionByshipper,getShippedCollection}=require('../controllers/CollectionController')
  const router = express.Router()
  router.post('/',createCollection)
  router.patch('/updateCollectionByCenter',updateCollectionByCenter)
  //get collection by shipper
  router.get('/:id',getCollectionByShipper)
  router.get('/',getShippedCollection)
  router.patch('/markAsRead',markAsRead)
  //delete all bins
router.delete('/',deleteAllWastes)

  router.patch('/updateCollectionByshipper', updateCollectionByshipper);
  module.exports = router;