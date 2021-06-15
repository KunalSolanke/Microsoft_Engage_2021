const mongoose =require("mongoose")

const chatSchema = mongoose.Schema({ 
    messages:[
       {
           type:mongoose.Schema.Types.ObjectId,
           ref:"Message"
       }
    ],
    particiants:[
        {
           type:mongoose.Schema.Types.ObjectId,
           ref:"User"
       }
    ],
    meet:{
       type:mongoose.Schema.Types.ObjectId,
       ref:"Meet"
    },
    chat_type:{
        type:String,
        default:"individual"
    }
},{
    timestamps:true
})


const Chat=mongoose.model("Chat",chatSchema);
module.exports = Chat
