const { Schema, model, Types } = require("mongoose");

const schema = new Schema(
  {
    recipient: { type: Types.ObjectId, ref: "User", required: true },
    requester: { type: Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["pending", "accepted"] },
  },
  { timestamps: true }
);

module.exports = model("FriendRequest", schema);
