const { Schema, model, Types } = require("mongoose");

const schema = new Schema(
  {
    users: [{ type: Types.ObjectId, ref: "User" }],
    messages: [{ type: Types.ObjectId, ref: "Message" }],
  },
  { timestamps: true }
);

module.exports = model("Conversation", schema);
