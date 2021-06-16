const User = require("../models/User");
const FriendRequest = require("../models/FriendRequest");

exports.getFriends = async (req, res) => {
  const { id: meId } = req.userMe;
  const { id } = req.params;
  //   const { content, images } = req.body;
  //   console.log("credentials", meId, userId);
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
  console.log("reached pending requests");
  const { id: meId } = req.userMe;
  console.log("ME", meId);

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

    console.log("friendRequests", friendRequests);

    res.json({
      message: "Successfully found friends!",
      friendRequests,
    });
  } catch (e) {
    console.log("ytttttttttttt");
    console.log(e);
    res
      .status(500)
      .json({ message: "Something went wrong. Try one more time!" });
  }
};
