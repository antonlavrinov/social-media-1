const { Router } = require("express");

const {
  createPost,
  updatePost,
  deletePost,
  getPost,
  getPosts,
  likePost,
  unlikePost,
} = require("../controllers/post.controllers");
const { auth } = require("../middlewares/auth.middleware");
const router = Router();

router.post("/post", auth, createPost);

router.put("/post/:id", auth, updatePost);

router.delete("/post/:id", auth, deletePost);
router.get("/post/:id", auth, getPost);
router.get("/posts", auth, getPosts);

router.put("/post/like/:id", auth, likePost);
router.put("/post/unlike/:id", auth, unlikePost);

module.exports = router;
