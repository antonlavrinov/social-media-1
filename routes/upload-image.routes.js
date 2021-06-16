const { Router } = require("express");

const {
  removeImage,
  uploadImage,
} = require("../controllers/upload-image.controllers");
const { auth } = require("../middlewares/auth.middleware");
const router = Router();

router.post("/upload-image", auth, uploadImage);

router.delete("/remove-image/:id", auth, removeImage);

module.exports = router;
