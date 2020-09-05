const mongoose = require('mongoose')
require('./init_mongoose');
const Schema = mongoose.Schema;
const roomSchema = new Schema({
   uuid:{
        type:String,
    },
   token:{
        type:String,
    },
})

const room = mongoose.model("room",roomSchema);
module.exports = room
