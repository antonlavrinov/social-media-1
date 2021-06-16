const { Schema, model, Types } = require("mongoose");

const schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true, index: true },
    lastName: { type: String, required: true, index: true },
    city: { type: String, default: "" },
    dateOfBirth: { type: Date, default: null },
    gender: { type: String, default: "" },
    avatar: {
      type: String,
      default:
        "https://iupac.org/wp-content/uploads/2018/05/default-avatar.png",
    },
    aboutMe: { type: String, default: "" },
    friends: [{ type: Types.ObjectId, ref: "User" }],
    friendRequests: [{ type: Types.ObjectId, ref: "FriendRequest" }],
    wall: [{ type: Types.ObjectId, ref: "Post" }],
    // online: { type: Boolean, default: false },
  },
  { timestamps: true }
);

schema.index({ firstName: "text", lastName: "text" });

module.exports = model("User", schema);
