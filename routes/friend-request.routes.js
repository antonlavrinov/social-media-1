const { Router } = require("express");

const {
  sendFriendRequest,
  acceptFriendRequest,
  cancelFriendRequest,
  sendUnfriendRequest,
} = require("../controllers/friend-request.controllers");
const { auth } = require("../middlewares/auth.middleware");
const router = Router();

//create new friend_request
router.post("/friend-request/create", auth, sendFriendRequest);

router.put("/friend-request/accept/:id", auth, acceptFriendRequest);

//delete friend_request
router.delete("/friend-request/cancel/:id", auth, cancelFriendRequest);

router.put("/friend-request/unfriend/:id", auth, sendUnfriendRequest);

module.exports = router;
