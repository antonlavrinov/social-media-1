const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

exports.createConversation = async (req, res) => {
  const { id: meId } = req.userMe;
  const { userIds, content, images } = req.body;

  try {
    const existingConversation = await Conversation.findOne({
      users: { $all: [meId, ...userIds] },
    });

    if (!existingConversation) {
      const conversation = new Conversation({
        users: [meId, ...userIds],
      });

      await conversation.save();

      const newMessage = new Message({
        user: meId,
        content,
        images,
        conversation: conversation._id,
      });

      await newMessage.save();

      await newMessage.populate("conversation user").execPopulate();

      const updatedConversation = await Conversation.findOneAndUpdate(
        { _id: conversation._id },
        { $push: { messages: newMessage._id } },
        { new: true }
      );

      await updatedConversation
        .populate({
          path: "users",
          select: "firstName lastName avatar",
          match: { _id: { $ne: meId } },
        })
        .populate({
          path: "messages",
          populate: {
            path: "user conversation",
          },
          options: {
            // perDocumentLimit: 1,
            sort: { createdAt: 1 },
          },
        })
        .execPopulate();

      res.json({
        message: "Successfully created a message!",
        conversation: updatedConversation,
        newMessage,
      });
    } else {
      const newMessage = new Message({
        user: meId,
        content,
        images,
        conversation: existingConversation._id,
      });
      await newMessage.save();
      await newMessage.populate("conversation user").execPopulate();

      const newConversation = await Conversation.findOneAndUpdate(
        {
          users: { $all: [meId, ...userIds] },
        },
        { $push: { messages: newMessage._id } },
        { new: true }
      )
        .populate({
          path: "users",
          select: "firstName lastName avatar",
          match: { _id: { $ne: meId } },
        })
        .populate({
          path: "messages",
          populate: {
            path: "user conversation",
          },
          options: {
            // perDocumentLimit: 1,
            sort: { createdAt: 1 },
          },
        });

      res.json({
        message: "Successfully created a conversation!",
        conversation: newConversation,
        newMessage,
      });
    }
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ message: "Something went wrong. Try one more time!" });
  }
};

exports.deleteConversation = async (req, res) => {
  const { id: meId } = req.userMe;
  const { id } = req.params;

  try {
    await Conversation.findOneAndDelete({ _id: id, users: meId });
    await Message.deleteMany({ conversation: id });
    res.json({
      message: "Successfully deleted a conversation and it's messages!",
    });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ message: "Something went wrong. Try one more time!" });
  }
};

exports.getConversation = async (req, res) => {
  const { id: meId } = req.userMe;
  const { id } = req.params;

  try {
    const conversation = await Conversation.findOne({ _id: id })
      .populate("users")
      .populate({
        path: "messages",
        populate: {
          path: "user conversation",
          select: "firstName lastName avatar _id",
        },
      });

    res.json({
      message: "Conversation found!",
      conversation,
    });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ message: "Something went wrong. Try one more time!" });
  }
};

exports.getConversations = async (req, res) => {
  const { id: meId } = req.userMe;

  try {
    const conversations = await Conversation.find({ users: meId })

      .populate({
        path: "users",
        select: "firstName lastName avatar",
        match: { _id: { $ne: meId } },
      })
      .populate({
        path: "messages",
        populate: {
          path: "user conversation",
        },
        options: {
          // perDocumentLimit: 1,
          sort: { createdAt: 1 },
        },
      })
      .sort({ updatedAt: -1 });

    res.json({
      message: "Conversations found!",
      conversations,
    });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ message: "Something went wrong. Try one more time!" });
  }
};
