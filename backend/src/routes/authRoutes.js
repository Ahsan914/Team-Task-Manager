
const express = require("express");
const passport = require("passport");

const {
  signup,
  loginSuccess,
  logout,
} = require("../controllers/authController.js");

const router = express.Router();

router.post("/signup", signup);

router.post(
  "/login",
  passport.authenticate("local", {
    failWithError: true,
  }),
  loginSuccess
);

router.post("/logout", logout);

module.exports = router;
