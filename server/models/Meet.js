const mongoose = require("mongoose");

const meetSchema = mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    particiants: [
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
  },
  { timestamps: true }
);

const Meet = mongoose.model("Meet", meetSchema);
module.exports = Meet;
