const FriendRequest = require("../models/FriendRequest");
const User = require("../models/User");

exports.updateUser = async (req, res) => {
  try {
    const { firstName, lastName, avatar, city, dateOfBirth, aboutMe, gender } =
      req.body;

    await User.findOneAndUpdate(
      { _id: req.params.id },
      {
        firstName,
        lastName,
        avatar,
        city,
        dateOfBirth,
        aboutMe,
        gender,
      },
      { new: true }
    );

    res.json({ message: "Данные изменены" });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ message: "Something went wrong. Try one more time!" });
  }
};

exports.getUser = async (req, res) => {
  const { userMe } = req;

  try {
    const user = await User.findById({ _id: req.params.id })
      .select("-password -friendRequests")

      .populate({
        path: "wall",
        populate: {
          path: "comments",
          populate: "user likes",
        },
        options: {
          limit: 5,
          sort: { createdAt: -1 },
        },
      })
      .populate({
        path: "wall",
        populate: "user",
        options: {
          limit: 5,
          sort: { createdAt: -1 },
        },
      })
      .populate({
        path: "wall",
        populate: "likes",
        options: {
          limit: 5,
          sort: { createdAt: -1 },
        },
      })
      .populate("friends");

    if (!user) return res.status(400).json({ message: "Not found" });

    const friendRequest = await FriendRequest.findOne({
      $or: [
        { requester: req.params.id, recipient: userMe._id },
        { recipient: req.params.id, requester: userMe._id },
      ],
    });

    if (!friendRequest) {
      return res.json({
        message: "User found",

        userData: { ...user._doc, friendRequest },
      });
    }

    res.json({
      message: "User found",
      userData: { ...user._doc, friendRequest },
    });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ message: "Something went wrong. Try one more time!" });
  }
};
