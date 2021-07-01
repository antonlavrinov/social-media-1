const { Router } = require("express");

const {
  createConversation,
  deleteConversation,
  getConversation,
  getConversations,
} = require("../controllers/conversation.controllers");
const { auth } = require("../middlewares/auth.middleware");
const router = Router();

router.post("/conversation", auth, createConversation);

router.delete("/conversation/:id", auth, deleteConversation);
router.get("/conversation/:id", auth, getConversation);
router.get("/conversations", auth, getConversations);

module.exports = router;
