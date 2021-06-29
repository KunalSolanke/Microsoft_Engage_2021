const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    content_type: String,
    content: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    },
    is_bot: Boolean,
    reply_to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    meet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Meet",
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
