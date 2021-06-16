const { Router } = require("express");

const {
  updateUser,
  getUser,
  // setStatusOffline,
} = require("../controllers/user.controllers");
const { auth } = require("../middlewares/auth.middleware");
const router = Router();

router.put("/user/:id", auth, updateUser);

// router.put("/user/offline", auth, setStatusOffline);

router.get("/user/:id", auth, getUser);

module.exports = router;
