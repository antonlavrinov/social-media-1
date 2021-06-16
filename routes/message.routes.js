const { Router } = require("express");

const {
  createMessage,
  updateMessage,
  deleteMessage,
  readMessage,
} = require("../controllers/message.controllers");
const { auth } = require("../middlewares/auth.middleware");
const router = Router();

//create new friend_request
router.post("/message", auth, createMessage);

router.put("/message/:id", auth, updateMessage);
router.put("/read_message/:id", auth, readMessage);

//delete friend_request
router.delete("/message/:id", auth, deleteMessage);

module.exports = router;
