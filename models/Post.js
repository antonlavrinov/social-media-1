const { Schema, model, Types } = require("mongoose");

const schema = new Schema(
  {
    content: { type: String, default: "", index: true },
    images: [
      {
        public_id: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
    likes: [{ type: Types.ObjectId, ref: "User" }],
    comments: [{ type: Types.ObjectId, ref: "Comment" }],
    user: { type: Types.ObjectId, ref: "User", required: true },
    repost: { type: Types.ObjectId, ref: "Post" },
    repostedBy: [{ type: Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

schema.index({ content: "text" });

module.exports = model("Post", schema);
