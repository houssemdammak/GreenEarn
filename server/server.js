require('dotenv').config()
const express=require('express') 
//const cors= require('cors') 
const mongoose=require('mongoose')
const app=express()
const shipperRoutes =require('./routes/shippers')
const citizenRoutes= require ('./routes/citizens')
const binRoutes= require ('./routes/bins')
const mainRouter = require("./routes/user");

// app.use(cors());

app.use(express.json())

app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});


app.use('/api/auth/', mainRouter);

app.use('/api/shippers', shipperRoutes);
app.use('/api/citizens', citizenRoutes);
app.use('/api/bins', binRoutes);
mongoose.connect(process.env.MONG_URI)
.then(()=>{
    //listen for request
app.listen(process.env.PORT, () => {
    console.log("connected to db & listen on port 8000"),process.env.PORT
  });
})
.catch((error)=>{
    console.log(error)
})
