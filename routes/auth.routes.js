const { Router } = require("express");

const { check, validationResult } = require("express-validator");

const {
  createUser,
  loginUser,
  logoutUser,
  generateAccessToken,
} = require("../controllers/auth.controllers");
const router = Router();

router.post(
  "/auth/register",
  [
    check("firstName", "Напишите имя").not().isEmpty(),
    check("lastName", "Напишите фамилию").not().isEmpty(),
    check("email", "Email is incorrect")
      .isEmail()
      .normalizeEmail({ gmail_remove_dots: false }),
    check(
      "password",
      "The password must contain at least 6 characters"
    ).isLength({ min: 6 }),
  ],
  createUser
);

router.post(
  "/auth/login",
  [
    check("email", "Email is incorrect")
      .isEmail()
      .normalizeEmail({ gmail_remove_dots: false }),
    check("password", "Enter password").not().isEmpty(),
  ],

  loginUser
);

router.post("/auth/logout", logoutUser);

router.post("/auth/refresh_token", generateAccessToken);

module.exports = router;
