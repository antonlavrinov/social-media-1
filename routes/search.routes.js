const { Router } = require("express");
const { auth } = require("../middlewares/auth.middleware");

const { searchUsers } = require("../controllers/search.controllers");
const router = Router();

router.get("/search/users", auth, searchUsers);

module.exports = router;
