const { Router } = require("express");

const {
  createNotification,
  getNotifications,
  setIsRead,
} = require("../controllers/notification.controllers");
const { auth } = require("../middlewares/auth.middleware");
const router = Router();

router.post("/notify", auth, createNotification);
router.put("/notify/:id", auth, setIsRead);

router.get("/notifies", auth, getNotifications);

module.exports = router;
