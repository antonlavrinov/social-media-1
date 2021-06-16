const FriendRequest = require("../models/FriendRequest");
const User = require("../models/User");

// _id ====> Object!!!
// id ====> String!!!!

exports.sendFriendRequest = async (req, res) => {
  const { id: meId } = req.userMe;
  const { userId } = req.body;

  try {
    const duplicate = await FriendRequest.find({
      $or: [
        { $and: [{ recipient: meId }, { requester: userId }] },
        { $and: [{ recipient: userId }, { requester: meId }] },
      ],
    });

    if (duplicate.length !== 0) {
      return res.status(400).json({ message: "Request already exists" });
    }

    const friendRequest = new FriendRequest({
      recipient: userId,
      requester: meId,
      status: "pending",
    });

    await friendRequest.save();

    //возможно стоит сделать проверку, есть ли у обоих пользователей этот friendRequest и если нет, то запушить
    // await FriendRequest.findOne({ _id: friendRequest._id });

    const requester = await User.findOneAndUpdate(
      { _id: meId },
      {
        $push: { friendRequests: friendRequest._id },
      },
      { new: true }
    );

    const recipient = await User.findOneAndUpdate(
      { _id: userId },
      {
        $push: { friendRequests: friendRequest._id },
      },
      { new: true }
    );

    res.json({
      message: "Successfully sent friend request",
      friendRequest,
    });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ message: "Something went wrong. Try one more time!" });
  }
};

exports.cancelFriendRequest = async (req, res) => {
  const friendRequestId = req.params.id;
  const { userId } = req.body;
  const { id: meId } = req.userMe;

  try {
    const request = await FriendRequest.findOne({ _id: friendRequestId });

    if (!request) {
      return res.status(400).json({ message: "There is no such request" });
    }

    if (String(request.requester) !== meId) {
      return res
        .status(400)
        .json({ message: "You weren't the one who sent the request" });
    }

    if (request.status === "accepted") {
      return res.status(400).json({
        message: "You cannot unsubscribe. The friend request has been accepted",
      });
    }

    await FriendRequest.findOneAndDelete({ _id: friendRequestId });

    await User.findOneAndUpdate(
      { _id: userId },
      { $pull: { friendRequests: friendRequestId } }
    );

    await User.findOneAndUpdate(
      { _id: meId },
      { $pull: { friendRequests: friendRequestId } }
    );

    //maybe clear notification
    res.json({
      message: "Canceled friend request!",
    });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ message: "Something went wrong. Try one more time!" });
  }
};

exports.acceptFriendRequest = async (req, res) => {
  const friendRequestId = req.params.id;
  const { userId } = req.body;
  const userMe = req.userMe;
  try {
    const friendRequest = await FriendRequest.findOne({ _id: friendRequestId });

    if (!friendRequest) {
      return res.status(400).json({ message: "There is no such request" });
    }

    if (friendRequest.requester == userMe.meId) {
      return res.status(400).json({
        message: "You cannot accept this request. You were the one who sent it",
      });
    }

    const acceptedFriendRequest = await FriendRequest.findOneAndUpdate(
      { _id: friendRequestId },
      {
        status: "accepted",
      },
      { new: true }
    );

    await User.findOneAndUpdate(
      { _id: userMe.id },
      {
        $push: { friends: userId },
      },
      { new: true }
    );

    await User.findOneAndUpdate(
      { _id: userId },
      {
        $push: { friends: userMe.id },
      },
      { new: true }
    );

    res.json({
      message: "Accepted friend request!",
      friendRequest: acceptedFriendRequest,
    });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ message: "Something went wrong. Try one more time!" });
  }
};

exports.sendUnfriendRequest = async (req, res) => {
  const friendRequestId = req.params.id;
  const { userId } = req.body;
  const { id: meId } = req.userMe;
  try {
    const friendRequest = await FriendRequest.findOne({
      _id: friendRequestId,
    });

    if (!friendRequest) {
      return res.status(400).json({
        message: "This request doesn't exist",
      });
    }

    if (friendRequest.status !== "accepted") {
      return res.status(400).json({
        message:
          "You cannot unfriend the user. This request doesn't have ACCEPTED status",
      });
    }

    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(400).json({ message: "User doesn't exist" });
    }

    const unfriendFriendRequest = await FriendRequest.findOneAndUpdate(
      { _id: friendRequestId },
      {
        recipient: meId,
        requester: userId,
        status: "pending",
      },
      { new: true }
    );

    await User.findOneAndUpdate(
      { _id: meId },
      {
        $pull: { friends: userId },
      }
    );

    await User.findOneAndUpdate(
      { _id: userId },
      {
        $pull: { friends: meId },
      }
    );

    res.json({
      message: "Successful unfriend request!",
      friendRequest: unfriendFriendRequest,
    });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ message: "Something went wrong. Try one more time!" });
  }
};
