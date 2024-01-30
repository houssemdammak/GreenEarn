const mongoose=require('mongoose')

const Schema=mongoose.Schema
const CitizenSchema= new Schema({
    ID:{
        type:String,
        required:true
    },
    FullName:{
        type:String,
        required:true

    },    
    BankCardNumber:{
        type:Number,
        required:true
    },

},{timestamps:true})
module.exports=mongoose.model('Citizen',CitizenSchema)
