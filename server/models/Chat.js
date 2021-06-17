const mongoose = require("mongoose");

const chatSchema = mongoose.Schema(
  {
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
    particiants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    meet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Meet",
    },
    is_group: {
      type: Boolean,
      default: false,
    },
    is_meet_chat: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;
