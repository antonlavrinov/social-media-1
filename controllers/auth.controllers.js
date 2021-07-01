const User = require("../models/User");
const Comment = require("../models/Comment");
const Conversation = require("../models/Conversation");
const FriendRequest = require("../models/FriendRequest");
const Message = require("../models/Message");
const Notification = require("../models/Notification");
const Post = require("../models/Post");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const clearDB = async () => {
  await User.deleteMany({});
  await Comment.deleteMany({});
  await Conversation.deleteMany({});
  await FriendRequest.deleteMany({});
  await Message.deleteMany({});
  await Notification.deleteMany({});
  await Post.deleteMany({});
};

exports.createUser = async (req, res) => {
  try {
    // await clearDB();

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: "Check your credentials one more time",
      });
    }
    const { email, password, firstName, lastName } = req.body;

    const candidate = await User.findOne({ email })
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
      .populate("friendRequests friends");
    if (candidate) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    await user.save();

    const accessToken = createAccessToken({ userId: user.id });
    const refreshToken = createRefreshToken({ userId: user.id });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      path: "/api/auth/refresh_token",
      maxAge: 30 * 24 * 60 * 60 * 1000, //30 days
    });

    res.status(201).json({
      accessToken,
      userData: {
        ...user._doc,
        password: "",
      },
    });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ message: "Something went wrong. Try one more time!" });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: "Couldn't log in. Check again your email and password",
      });
    }
    const { email, password } = req.body;

    const user = await User.findOne({ email })
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
      .populate("friendRequests friends");

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Wrong password. Try one more time" });
    }

    //далее нам надо сделать авторизацию. И учитывая, что у нас SPA, то
    //авторизацию мы будем делать через jwt токен

    const accessToken = createAccessToken({ userId: user.id });
    const refreshToken = createRefreshToken({ userId: user.id });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      path: "/api/auth/refresh_token",
      maxAge: 30 * 24 * 60 * 60 * 1000, //30 days
    });
    //статус по умолчанию 200
    res.json({
      accessToken,
      userData: {
        ...user._doc,
        password: "",
      },
    });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ message: `Something went wrong. Try one more time! ${e}` });
  }
};

exports.logoutUser = async (req, res) => {
  try {
    res.clearCookie("refreshToken", {
      path: "/api/auth/refresh_token",
    });
    res.status(201).json({ message: "Logged out!" });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Something went wrong when logging out. Try one more time!",
    });
  }
};

exports.generateAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken)
      return res.status(400).json({ message: "Please login now" });

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, result) => {
        if (err) {
          return res.status(400).json({ message: "Please login now" });
        }

        const user = await User.findByIdAndUpdate(result.userId, {
          // online: true,
        })
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

          .populate("friendRequests friends");

        if (!user) {
          return res.status(400).json({ message: "This user does not exist" });
        }
        console.log("found user");

        const accessToken = createAccessToken({ userId: result.userId });
        // console.log("accessTone", accessToken);
        res.status(201).json({
          accessToken,
          userData: {
            ...user._doc,
            password: "",
          },
        });
      }
    );
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ message: "Something went wrong. Try one more time!" });
  }
};

const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });
};

const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "30d",
  });
};
