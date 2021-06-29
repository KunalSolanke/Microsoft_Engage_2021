const mongoose = require("mongoose");

const meetSchema = mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    answered: {
      type: Boolean,
      default: false,
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Meet",
    },
    is_group: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Meet = mongoose.model("Meet", meetSchema);
module.exports = Meet;
