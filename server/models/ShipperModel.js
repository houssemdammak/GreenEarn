const mongoose=require('mongoose')
const bcrypt = require("bcryptjs");

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
    email:{
        type: String,
        required: [true, "Please provide email"],
        minlength: 3,
        maxlength: 50,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email',
          ],
          unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minlength: 3
    },

},{timestamps:true});

ShipperSchema.pre("save", async function(){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})



ShipperSchema.methods.comparePassword = async function(candidatePassword){
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
}
module.exports=mongoose.model('Shipper',ShipperSchema)

