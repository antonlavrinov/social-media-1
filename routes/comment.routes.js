const { Router } = require("express");

const {
  createComment,
  updateComment,
  deleteComment,
  likeComment,
  unlikeComment,
} = require("../controllers/comment.controllers");
const { auth } = require("../middlewares/auth.middleware");
const router = Router();

router.post("/comment", auth, createComment);

router.put("/comment/:id", auth, updateComment);

router.delete("/comment/:id", auth, deleteComment);

router.put("/comment/like/:id", auth, likeComment);
router.put("/comment/unlike/:id", auth, unlikeComment);

module.exports = router;
