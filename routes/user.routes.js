const { Router } = require("express");

const { updateUser, getUser } = require("../controllers/user.controllers");
const { auth } = require("../middlewares/auth.middleware");
const router = Router();

router.put("/user/:id", auth, updateUser);

router.get("/user/:id", auth, getUser);

module.exports = router;
