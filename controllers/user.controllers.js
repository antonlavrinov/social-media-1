const FriendRequest = require("../models/FriendRequest");
const User = require("../models/User");
const { cloudinary } = require("../utils/cloudinary");

exports.updateUser = async (req, res) => {
  console.log("reached");
  try {
    const { firstName, lastName, avatar, city, dateOfBirth, aboutMe, gender } =
      req.body;

    // const uploadedAvatar = await cloudinary.uploader.upload(avatar, {
    //   upload_preset: "social_avatars",
    // });

    // console.log(uploadedAvatar);

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
    // console.log(updatedUser);
    res.json({ message: "Данные изменены" });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ message: "Something went wrong. Try one more time!" });
  }
};

exports.getUser = async (req, res) => {
  console.log("reached getUser");
  console.log(req.params);
  const { userMe } = req;
  // console.log("userMe", req);
  // console.log(req);
  try {
    // const me = User.findOne({})

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
    // .populate({
    //   path: "wall",
    //   options: {
    //     limit: 5,
    //     sort: { created: -1 },
    //   },
    // });

    console.log("user", user.wall);

    if (!user) return res.status(400).json({ message: "Not found" });

    const friendRequest = await FriendRequest.findOne({
      $or: [
        { requester: req.params.id, recipient: userMe._id },
        { recipient: req.params.id, requester: userMe._id },
      ],
    });
    // console.log("friendStatus", friendStatus);

    if (!friendRequest) {
      return res.json({
        message: "User found",
        // userData: { ...user._doc, friendStatus: "not_friend" },
        userData: { ...user._doc, friendRequest },
      });
    }

    // recipient -получатель
    // requester - отправитель

    //let's do this on the frontend

    // const checkForFriendStatus = (friendRequest, meId) => {
    //   const { recipient, requester, status } = friendRequest;
    //   switch (friendRequest) {
    //     case recipient === meId && status === "accepted":
    //       return "friend";
    //     case recipient === meId && status === "pending":
    //       return "user_sent_request";
    //     case requester === meId && status === "pending":
    //       return "me_sent_request";
    //   }
    // };

    // const status = checkForFriendStatus();

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

// exports.setStatusOffline = async (req, res) => {
//   console.log("reached offline");
//   // console.log(req.params);
//   const { userMe } = req;
//   // console.log("userMe", req);
//   // console.log(req);
//   try {
//     // const me = User.findOne({})

//     const user = await User.findByIdAndUpdate({ _id: userMe._id });

//     console.log("user", user.wall);

//     if (!user) return res.status(400).json({ message: "Not found" });

//     res.json({
//       message: "User is offline",
//     });
//   } catch (e) {
//     console.log(e);
//     res
//       .status(500)
//       .json({ message: "Something went wrong. Try one more time!" });
//   }
// };

// exports.sendFriendRequest = async (req, res) => {
//   const { meId, userId } = req.body;
//   try {
//     const duplicate = await FriendRequest.find({
//       recipient,
//       requester,
//     });

//     console.log(duplicate);

//     if (duplicate.length !== 0) {
//       return res.status(400).json({ message: "Already exists" });
//     }

//     const friendRequest = new FriendRequest({
//       recipient,
//       requester,
//       status: "pending",
//     });

//     await friendRequest.save();

//     await User.findOneAndUpdate(
//       { _id: recipient },
//       {
//         $push: { friendRequests: friendRequest },
//       }
//     );

//     await User.findOneAndUpdate(
//       { _id: requester },
//       {
//         $push: { friendRequests: friendRequest },
//       }
//     );

//     res.json({
//       message: "Successfully sent request",
//     });
//   } catch (e) {
//     console.log(e);
//     res
//       .status(500)
//       .json({ message: "Something went wrong. Try one more time!" });
//   }
// };

// exports.sendUnfriendRequest = async (req, res) => {
//   const { meId, userId, friendRequestId } = req.body;
//   try {
//     await FriendRequest.findOneAndUpdate(
//       { _id: friendRequestId },
//       {
//         recipient: meId,
//         requester: userId,
//         status: "pending",
//       }
//     );

//     await User.findOneAndUpdate(
//       { _id: meId },
//       {
//         $pull: { friends: { _id: userId } },
//       }
//     );

//     await User.findOneAndUpdate(
//       { _id: userId },
//       {
//         $pull: { friends: { _id: meId } },
//       }
//     );

//     res.json({
//       message: "Successful unfriend request!",
//     });
//   } catch (e) {
//     console.log(e);
//     res
//       .status(500)
//       .json({ message: "Something went wrong. Try one more time!" });
//   }
// };

// exports.acceptFriendRequest = async (req, res) => {
//   const { friendRequestId } = req.body;
//   const { userId } = req.params.id;
//   const { meId } = req.userMe;
//   try {
//     await FriendRequest.findOneAndUpdate(
//       { _id: friendRequestId },
//       {
//         status: "accepted",
//       }
//     );

//     User.findOneAndUpdate(
//       { _id: recipientId },
//       {
//         $push: { friends: requesterId },
//       },
//       { new: true }
//     );

//     User.findOneAndUpdate(
//       { _id: requesterId },
//       {
//         $push: { friends: recipientId },
//       },
//       { new: true }
//     );

//     res.json({
//       message: "Accepted friend request!",
//     });
//   } catch (e) {
//     console.log(e);
//     res
//       .status(500)
//       .json({ message: "Something went wrong. Try one more time!" });
//   }
// };

// exports.cancelFriendRequest = async (req, res) => {
//   const { friendRequestId } = req.body;
//   const { userId } = req.params;
//   const { meId } = req.userMe;
//   try {
//     const request = await FriendRequest.findOne({ _id: friendRequestId });

//     if (!request) {
//       return res.status(400).json({ message: "There is no such request" });
//     }

//     if (request.requester._id !== meId) {
//       return res
//         .status(400)
//         .json({ message: "You weren't the one who sent the request" });
//     }

//     await FriendRequest.findOneAndDelete({ _id: friendRequestId });

//     //clear notifications of a user

//     res.json({
//       message: "Canceled friend request!",
//     });
//   } catch (e) {
//     console.log(e);
//     res
//       .status(500)
//       .json({ message: "Something went wrong. Try one more time!" });
//   }
// };
