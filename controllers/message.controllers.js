const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const Post = require("../models/Post");

exports.createMessage = async (req, res) => {
  console.log("create conversation");
  const { id: meId } = req.userMe;
  const { content, images, conversationId } = req.body;

  try {
    const newMessage = new Message({
      user: meId,
      content,
      images,
      conversation: conversationId,
    });

    await newMessage.save();

    await newMessage.populate("user conversation").execPopulate();

    const conversation = await Conversation.findOneAndUpdate(
      { _id: conversationId },
      { $push: { messages: newMessage._id } },
      { new: true }
    );

    //if personal then push to meState
    res.json({
      message: "Successfully created a message!",
      newMessage,
      conversation,
    });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ message: "Something went wrong. Try one more time!" });
  }
};

exports.updateMessage = async (req, res) => {
  console.log("Update message");
  const { id: meId } = req.userMe;
  const { id } = req.params;
  const { content, images } = req.body;

  try {
    const updatedMessage = await Message.findOne({ _id: id, user: meId });
    // console.log("posss", post);
    if (!updatedMessage) {
      return res.status(400).json({
        message: "This message doesn't belong to you",
      });
    }
    await Message.findOneAndUpdate({ _id: id }, { content, images });
    res.json({
      message: "Successfully updated a message!",
    });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ message: "Something went wrong. Try one more time!" });
  }
};

exports.deleteMessage = async (req, res) => {
  const { id: meId } = req.userMe;
  const { id } = req.params;
  console.log("deleting message", id);

  try {
    // const message = await Message.findOne({ _id: id });
    // console.log("msg", message);
    // if (!message) {
    //   return res.status(400).json({
    //     message: "You cannot delete this message",
    //   });
    // }
    await Message.findOneAndDelete({ _id: id });

    res.json({
      message: "Successfully deleted a message!",
    });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ message: "Something went wrong. Try one more time!" });
  }
};

exports.readMessage = async (req, res) => {
  console.log("read message");
  const { id: meId } = req.userMe;
  const { id } = req.params;

  try {
    const message = await Message.findOne({ _id: id, user: { $ne: meId } });
    // console.log("posss", post);
    if (!message) {
      return res.status(400).json({
        message: "This message doesn't belong to you",
      });
    }
    const readMsg = await Message.findOneAndUpdate(
      { _id: id },
      { isRead: true },
      { new: true }
    ).populate("conversation user");
    res.json({
      message: "Successfully read a message!",
      readMsg,
    });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ message: "Something went wrong. Try one more time!" });
  }
};
