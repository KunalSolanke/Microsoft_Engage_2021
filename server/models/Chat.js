const mongoose = require("mongoose");
const chatSchema = mongoose.Schema(
  {
    channel_name: String,
    team_name: String,
    description: String,
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
    participants: [
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
    is_meet_group: {
      type: Boolean,
      default: false,
    },
    is_channel: {
      type: Boolean,
      default: false,
    },

    channels: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;
