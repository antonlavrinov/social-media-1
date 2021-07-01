const { Router } = require("express");

const {
  getFriends,
  getPendingFriendRequests,
} = require("../controllers/friends.controllers");
const { auth } = require("../middlewares/auth.middleware");
const router = Router();

router.get("/friends/:id", auth, getFriends);

router.get("/pending_friend_requests", auth, getPendingFriendRequests);

module.exports = router;
