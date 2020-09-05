const mongoose = require('mongoose')
require('./init_mongoose');
const Schema = mongoose.Schema;
const subjectSchema = new Schema({
    name:{
        type:String,
    },
    joinyear:{
        type:String,
    },
    branch:{
        type:String,
    },
    teacher:{
        type:String,
    },
})

const subject = mongoose.model("subject",subjectSchema);
module.exports = subject
