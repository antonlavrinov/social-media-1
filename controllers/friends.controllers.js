const User = require("../models/User");
const FriendRequest = require("../models/FriendRequest");

exports.getFriends = async (req, res) => {
  const { id: meId } = req.userMe;
  const { id } = req.params;

  try {
    const user = await User.findOne({ _id: id }).select("friends").populate({
      path: "friends",
      select: "firstName lastName avatar",
    });
    res.json({
      message: "Successfully found friends!",
      friends: user.friends,
    });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ message: "Something went wrong. Try one more time!" });
  }
};

exports.getPendingFriendRequests = async (req, res) => {
  const { id: meId } = req.userMe;

  try {
    const friendRequests = await FriendRequest.find({
      $or: [
        {
          recipient: meId,
          status: "pending",
        },
        {
          requester: meId,
          status: "pending",
        },
      ],
    })
      .populate({
        path: "requester",
        select: "avatar firstName lastName _id",
      })
      .populate({
        path: "recipient",
        select: "avatar firstName lastName _id",
      });

    res.json({
      message: "Successfully found friends!",
      friendRequests,
    });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ message: "Something went wrong. Try one more time!" });
  }
};
