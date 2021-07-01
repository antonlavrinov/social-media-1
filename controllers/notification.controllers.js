// const { Types } = require("mongoose");
const Notification = require("../models/Notification");
const User = require("../models/User");

exports.createNotification = async (req, res) => {
  const { id: meId } = req.userMe;
  const { text, url, recipients } = req.body;

  try {
    const notification = new Notification({
      user: meId,
      text,
      url,
      recipients,
    });

    //если ты ставишь new: true когда создаешь схему, то при сохранении схемы выскочит ошибка
    //must have an id before saving

    await notification.save();

    await notification.populate("user recipients").execPopulate();

    res.json({
      message: "Successfully created notification!",
      notification,
    });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ message: "Something went wrong. Try one more time!" });
  }
};

exports.getNotifications = async (req, res) => {
  const { id: meId } = req.userMe;

  try {
    const notifications = await Notification.find({ recipients: meId })
      .sort("isRead")
      .sort("-createdAt")
      .populate("user");

    //if personal then push to meState
    res.json({
      message: "Found notifications",
      notifications,
    });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ message: "Something went wrong. Try one more time!" });
  }
};

exports.setIsRead = async (req, res) => {
  const { id } = req.params;

  try {
    await Notification.findOneAndUpdate(
      { _id: id },
      {
        isRead: true,
      }
    );

    res.json({
      message: "Successfully set notification to isRead!",
    });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ message: "Something went wrong. Try one more time!" });
  }
};
