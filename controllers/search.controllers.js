const User = require("../models/User");

exports.searchUsers = async (req, res) => {
  console.log("reached search", new RegExp(req.query.search));
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
      .select("firstName lastName avatar");
    // if (!users) return res.status(400).json({ message: "Not found" });
    console.log(users);
    res.status(201).json({ users });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ message: "Something went wrong. Try one more time!" });
  }
};
