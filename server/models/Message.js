const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
     content_type:String,
     content:String,
     author:{
         type:mongoose.Schema.Types.ObjectId,
         ref:"User"
     }
},{
    timestamps: true
})


const Message=mongoose.model("Message",messageSchema);
module.exports =Message