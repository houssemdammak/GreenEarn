const mongoose=require('mongoose')

const Schema=mongoose.Schema
const ShipperSchema= new Schema({
    ID:{
        type:String,
        required:true
    },
    FullName:{
        type:String,
        required:true

    },    
    Location:{
        type:String,
        required:true
    },
    TelephoneNum:{
        type:Number,
        required:true
    },

},{timestamps:true})
module.exports=mongoose.model('Shipper',ShipperSchema)
//workoutSchema.find()
