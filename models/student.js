const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
require('./init_mongoose');
const Schema = mongoose.Schema;
const studentSchema = new Schema({
    email:{
        type:String,
            lowercase:true,
            unique:true 
    },
    isVerified:{
        type:Boolean
    },
    password:{
        type:String,
    },
    googleid:{
        type:String,
    },
    username:{
        type:String,
    },
    branch:{
        type:String,
    },
    joinyear:{
        type:String
    },
    rollno:{
        type:String,
    },
    profilepic:  { 
        type:String,
    } ,
    subjects:[{
        subid:{
            type:String,
        },
        name:{
            type:String,
        },
        marks:{
            type:String,
        },
        teacher:{
            type:String,
        },
    }],
    attendence:[{
        date:{
            type:Date,
        },
        presence:{
            type:String,
        },
        subjectid:{
            type:String
        },
        subjectname:{
            type:String
        },
    }],
    result:{
        type:String
    }
})

studentSchema.pre('save',async function (next){
    try {
        console.log("came to save")
    const salt = await bcrypt.genSalt(10)
    const hashedpassword = await bcrypt.hash(this.password,salt);
    this.password = hashedpassword;
    console.log("saved successfully")
    next();
    } catch (error) {
       next(error) 
    }
})
studentSchema.post('save',async function(next){
    try {
    console.log('saved successfully')
    } catch (error) {
        next(error)
    }
})
const student = mongoose.model("student",studentSchema);
module.exports = student
