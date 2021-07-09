const mongoose = require("mongoose");

const activitySchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    logs: [
      {
        type: String,
      },
    ],
    log: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Activity = mongoose.model("Activity", activitySchema);
module.exports = Activity;
