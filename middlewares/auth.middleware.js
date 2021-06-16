const User = require("../models/User");

const jwt = require("jsonwebtoken");

exports.auth = async (req, res, next) => {
  console.log("reached auth");
  console.log("AUTH STEP 0");
  try {
    const token = req.header("Authorization").split(" ")[1];
    console.log("AUTH STEP 0.5", token);
    if (!token) {
      return res.status(500).json({ message: "Invalid Authentication" });
    }
    console.log("AUTH STEP 0.7");
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (!decoded) {
      return res.status(500).json({ message: "Invalid Authentication" });
    }

    console.log("AUTH STEP 1");

    const userMe = await User.findOne({ _id: decoded.userId })
      .select("-password")
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
      .populate("friendRequests");
    console.log("AUTH STEP 2");

    req.userMe = userMe;
    console.log("FINEEEEEEEE");
    next();
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ message: "Something went wrong. Try one more time!" });
  }
};
