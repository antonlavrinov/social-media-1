const { Types } = require("mongoose");
const Post = require("../models/Post");
const User = require("../models/User");

exports.createPost = async (req, res) => {
  const { id: meId } = req.userMe;
  const { userId, content, images } = req.body;
  console.log("credentials", meId, userId);
  console.log("images");
  try {
    const post = new Post({
      user: meId,
      content,
      images,
    });

    //если ты ставишь new: true когда создаешь схему, то при сохранении схемы выскочит ошибка
    //must have an id before saving

    console.log(post);

    await post.save();

    await post.populate("user").execPopulate();

    console.log("saved");

    await User.findOneAndUpdate({ _id: userId }, { $push: { wall: post._id } });

    //if personal then push to meState
    res.json({
      message: "Successfully created a post!",
      post,
    });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ message: "Something went wrong. Try one more time!" });
  }
};

exports.updatePost = async (req, res) => {
  console.log("Update post");
  const { id: meId } = req.userMe;
  const { id } = req.params;
  const { content, images } = req.body;
  console.log("credentials", meId);
  try {
    const post = await Post.findOne({ _id: id, user: meId });
    // console.log("posss", post);
    if (!post) {
      return res.status(400).json({
        message: "This post doesn't belong to you",
      });
    }
    await Post.findOneAndUpdate({ _id: id }, { content, images });
    res.json({
      message: "Successfully updated a post!",
    });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ message: "Something went wrong. Try one more time!" });
  }
};

exports.deletePost = async (req, res) => {
  const { id: meId } = req.userMe;
  const { id } = req.params;
  console.log("reached delete post", id);
  //   const { content, images } = req.body;

  try {
    //   console.log("credentials", meId, userId);
    const post = await Post.findOne({ _id: id, user: meId });

    const postOnMyWall = await User.findOne({ _id: meId, wall: id });

    if (!post && !postOnMyWall) {
      return res.status(400).json({
        message: "You cannot delete this post",
      });
    }

    await User.findOneAndUpdate(
      { wall: id },
      {
        $pull: { wall: id },
      }
    );

    await Post.findOneAndDelete({ _id: id });
    res.json({
      message: "Successfully deleted a post!",
    });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ message: "Something went wrong. Try one more time!" });
  }
};

exports.getPosts = async (req, res) => {
  const { id: meId } = req.userMe;
  const { id } = req.params;
  //   const { content, images } = req.body;
  //   console.log("credentials", meId, userId);
  try {
    await Post.findOneAndDelete({ _id: id });
    res.json({
      message: "Successfully deleted a post!",
    });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ message: "Something went wrong. Try one more time!" });
  }
};

exports.getPost = async (req, res) => {
  const { id: meId } = req.userMe;
  const { id } = req.params;
  //   const { content, images } = req.body;
  //   console.log("credentials", meId, userId);
  try {
    await Post.findOneAndDelete({ _id: id });
    res.json({
      message: "Successfully deleted a post!",
    });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ message: "Something went wrong. Try one more time!" });
  }
};

exports.likePost = async (req, res) => {
  const { id: meId } = req.userMe;
  const { id } = req.params;
  try {
    const post = await Post.findOne({ _id: id, likes: meId });
    if (post) {
      return res.status(400).json({
        message: "You already liked the post",
      });
    }

    // console.log("ud", req.params);

    const updated = await Post.findOneAndUpdate(
      { _id: id },
      { $push: { likes: meId } },
      { new: true }
    );
    // console.log("updated", updated);
    res.json({
      message: "Successfully liked a post!",
    });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ message: "Something went wrong. Try one more time!" });
  }
};

exports.unlikePost = async (req, res) => {
  const { id: meId } = req.userMe;
  const { id } = req.params;
  try {
    await Post.findOneAndUpdate({ _id: id }, { $pull: { likes: meId } });

    res.json({
      message: "Successfully unliked a post!",
    });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ message: "Something went wrong. Try one more time!" });
  }
};
