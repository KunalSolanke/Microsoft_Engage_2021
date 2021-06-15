const mongoose = require('mongoose')

const meetSchema = mongoose.Schema({
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    particiants:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }]
},{timestamps:true})

const Meet = mongoose.model("Meet",meetSchema);
module.exports =Meet;