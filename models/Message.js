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
    user: { type: Types.ObjectId, ref: "User", required: true },
    conversation: { type: Types.ObjectId, ref: "Conversation", required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = model("Message", schema);
