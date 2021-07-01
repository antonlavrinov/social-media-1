const User = require("../models/User");

exports.searchUsers = async (req, res) => {
  const { id: meId } = req.userMe;

  try {
    const users = await User.find(
      {
        firstName: { $regex: req.query.search, $options: "i" },
        _id: { $ne: meId },
      }
      // { $text: { $search: req.query.search } }
    )
      .limit(7)
      .select("firstName lastName avatar")
      .sort({ createdAt: -1 });

    res.status(201).json({ users });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ message: "Something went wrong. Try one more time!" });
  }
};
