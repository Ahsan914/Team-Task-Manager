
const express = require("express");
const passport = require("passport");

const {
  signup,
  loginSuccess,
  logout,
} = require("../controllers/authController.js");

const {
  validateSignup,
  validateLogin,
} = require("../middleware/authValidation.js");

const router = express.Router();

router.post("/signup", validateSignup, signup);

function authenticateLocal(req, res, next) {
  passport.authenticate("local", (error, user, info) => {
    if (error) return next(error);

    if (!user) {
      return res.status(401).json({
        message: info?.message || "Invalid email or password",
      });
    }

    req.logIn(user, (error) => {
      if (error) return next(error);

      req.session.save((error) => {
        if (error) return next(error);

        next();
      });
    });
  })(req, res, next);
}

router.post(
  "/login",
  validateLogin,
  authenticateLocal,
  loginSuccess
);

router.post("/logout", logout);

module.exports = router;
