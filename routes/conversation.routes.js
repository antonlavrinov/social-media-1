const { Router } = require("express");

const {
  createConversation,
  //   updateConversation,
  deleteConversation,
  getConversation,
  getConversations,
} = require("../controllers/conversation.controllers");
const { auth } = require("../middlewares/auth.middleware");
const router = Router();

//create new friend_request
router.post("/conversation", auth, createConversation);

// router.put("/conversation/:id", auth, updatePost);

//delete friend_request
router.delete("/conversation/:id", auth, deleteConversation);
router.get("/conversation/:id", auth, getConversation);
router.get("/conversations", auth, getConversations);

module.exports = router;
