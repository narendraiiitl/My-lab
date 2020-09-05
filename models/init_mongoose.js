const mongoose = require('mongoose');
require('dotenv').config();
mongoose.
connect(process.env.mongouri,
    {
        useNewUrlParser:true,
        useUnifiedTopology:true,
        dbName:"MyLab",
        useCreateIndex:true,
        useFindAndModify:false
    })
.then(()=>{
    console.log("mongodb connected")
})
.catch((e)=>{
    console.log(e.message)
    console.log("error in connecting to monogdb")
})

mongoose.connection.on('connected',()=>{
    console.log("mongoose connected to db");
})

mongoose.connection.on('error',(err)=>{
    console.log(err.message);
    console.log("error in connecting mongoose to monogdb")
})

mongoose.connection.on('disconnected',()=>{
    console.log('mongoose disconnected')
})

process.on('SIGINT',async()=>{
    await mongoose.connection.close()
    process.exit(0)
})