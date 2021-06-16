const { Schema, model, Types } = require("mongoose");

const schema = new Schema(
  {
    recipients: [{ type: Types.ObjectId, ref: "User" }],
    text: { type: String, required: true },
    user: { type: Types.ObjectId, ref: "User", required: true },
    url: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = model("Notification", schema);
