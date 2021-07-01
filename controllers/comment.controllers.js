const Comment = require("../models/Comment");
const Post = require("../models/Post");

exports.createComment = async (req, res) => {
  const { id: meId } = req.userMe;
  const { postId, content } = req.body;

  try {
    const comment = new Comment({
      user: meId,
      content,
    });

    //если ты ставишь new: true когда создаешь схему, то при сохранении схемы выскочит ошибка
    //must have an id before saving
    const post = await Post.findOneAndUpdate(
      { _id: postId },
      { $push: { comments: comment._id } }
    );

    if (!post) {
      return res.status(400).json({
        message: "There is no such post",
      });
    }

    await comment.save();

    await comment
      .populate({
        path: "user",
        select: "avatar firstName lastName _id",
      })
      .execPopulate();

    res.json({
      message: "Successfully added a comment!",
      comment,
    });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ message: "Something went wrong. Try one more time!" });
  }
};

exports.updateComment = async (req, res) => {
  const { id: meId } = req.userMe;
  const { id } = req.params;
  const { content, images } = req.body;
  //   console.log("credentials", meId);
  try {
    const comment = await Comment.findOne({ _id: id, user: meId });
    // console.log("posss", post);
    if (!comment) {
      return res.status(400).json({
        message: "This comment doesn't belong to you",
      });
    }
    await Comment.findOneAndUpdate({ _id: id }, { content, images });
    res.json({
      message: "Successfully updated a comment!",
    });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ message: "Something went wrong. Try one more time!" });
  }
};

exports.deleteComment = async (req, res) => {
  const { id: meId } = req.userMe;
  const { id } = req.params;
  const { postId } = req.body;

  try {
    const comment = await Comment.findOneAndDelete({ _id: id, user: meId });
    await Post.findOneAndUpdate({ _id: postId }, { $pull: { comments: id } });

    res.json({
      message: "Successfully deleted a comment!",
    });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ message: "Something went wrong. Try one more time!" });
  }
};

exports.likeComment = async (req, res) => {
  const { id: meId } = req.userMe;
  const { id } = req.params;
  try {
    const comment = await Comment.findOne({ _id: id, likes: meId });
    if (comment) {
      return res.status(400).json({
        message: "You already liked the comment",
      });
    }

    const updated = await Comment.findOneAndUpdate(
      { _id: id },
      { $push: { likes: meId } },
      { new: true }
    );
    console.log("updated", updated);
    res.json({
      message: "Successfully liked a comment!",
    });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ message: "Something went wrong. Try one more time!" });
  }
};

exports.unlikeComment = async (req, res) => {
  const { id: meId } = req.userMe;
  const { id } = req.params;
  try {
    await Comment.findOneAndUpdate({ _id: id }, { $pull: { likes: meId } });

    res.json({
      message: "Successfully unliked a comment!",
    });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ message: "Something went wrong. Try one more time!" });
  }
};
