const User = require("../models/User");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

exports.createUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: "Проверьте правильность написания данных",
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
      return res
        .status(400)
        .json({ message: "Такой пользователь уже существует" });
    }

    // console.log(candidate);

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      // online: true,
    });

    await user.save();

    // console.log("user", user);
    // console.log("userId", user.id);
    // console.log("user_Id", user._id);
    // console.log("user_Id_doc", user._doc);

    // const newUser = {
    //   //обязательно _doc!!!!
    //   ...user._doc,
    //   password: "",
    // };

    // console.log("newUser", newUser);
    // console.log("newUserId", newUser.id);
    // console.log("newUser_Id", newUser._id);

    // res.json({ message: "Пользователь создан" });
    // const token = jwt.sign(
    //   //первым параметром мы передаем объект, в котором будут храниться данные
    //   //которые будут зашифровары в этом jwt токене
    //   { userId: user.id },
    //   //вторым параметром передаем секретный ключ
    //   //это может быть любая строчка, главное, чтобы она была действительно секретной
    //   process.env.JWT_SECRET,
    //   //через сколько наш jwt токен закончит свое существование
    //   //рекомендуется на 1 час
    //   { expiresIn: "1h" }
    // );

    const accessToken = createAccessToken({ userId: user.id });
    const refreshToken = createRefreshToken({ userId: user.id });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      path: "/api/auth/refresh_token",
      maxAge: 30 * 24 * 60 * 60 * 1000, //30 days
    });

    // const userData = {
    //   id: user.id,
    //   email,
    //   firstName,
    //   lastName,
    // };
    //статус по умолчанию 200
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
  // console.log("reached login");
  try {
    const errors = validationResult(req);
    // console.log(errors);

    if (!errors.isEmpty()) {
      console.log("errors", errors);
      // console.log()
      return res.status(400).json({
        errors: errors.array(),
        message:
          "Не удаётся войти. Проверьте правильность написания почты и пароля",
      });
    }
    const { email, password } = req.body;
    console.log("email, password", email);
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

    console.log("logged in user", user);

    if (!user) {
      return res.status(400).json({ message: "Пользователь не найден" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Неверный пароль, попробуйте снова" });
    }

    //далее нам надо сделать авторизацию. И учитывая, что у нас SPA, то
    //авторизацию мы будем делать через jwt токен

    // const token = jwt.sign(
    //   //первым параметром мы передаем объект, в котором будут храниться данные
    //   //которые будут зашифровары в этом jwt токене
    //   { userId: user.id },
    //   //вторым параметром передаем секретный ключ
    //   //это может быть любая строчка, главное, чтобы она была действительно секретной
    //   process.env.JWT_SECRET,
    //   //через сколько наш jwt токен закончит свое существование
    //   //рекомендуется на 1 час
    //   { expiresIn: "1h" }
    // );

    const accessToken = createAccessToken({ userId: user.id });
    const refreshToken = createRefreshToken({ userId: user.id });

    // const userData = {
    //   id: user.id,
    //   email: user.email,
    //   firstName: user.firstName,
    //   lastName: user.lastName,
    // };

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      path: "/api/auth/refresh_token",
      // path: "/profile",
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
      .json({ message: "Something went wrong. Try one more time!" });
  }
};

exports.logoutUser = async (req, res) => {
  console.log("logged out!");
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
    console.log("refreshToken", req.cookies.refreshToken);
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
        console.log("result", result);
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
