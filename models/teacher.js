const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const teacherSchema = new Schema({
    email:{
        type:String,
            lowercase:true,
            unique:true 
    },
    password:{
        type:String,
    },
    profilepicid:{
        type:String,
    },
    name:{
        type:String,
    },
    subjects:[{
        name:{
            type:String,
        },
        students:[
            {
                branch:{
                    type:String, 
                },
                joinyear:{
                    type:String, 
                }
            }
        ]
    }],
})
const teacher = mongoose.model("teacher",teacherSchema);
module.exports = teacher
