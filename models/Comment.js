const { Schema, model, Types } = require("mongoose");

const schema = new Schema(
  {
    content: { type: String, default: "", index: true },
    likes: [{ type: Types.ObjectId, ref: "User" }],
    reply: { type: Types.ObjectId, ref: "Comment" },
    user: { type: Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = model("Comment", schema);
