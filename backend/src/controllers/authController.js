
const { User } = require("../models/models.js");

async function signup(req, res, next) {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email is already registered",
      });
    }

    const user = new User({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash: password,
    });

    await user.save();

    req.login(user, (error) => {
      if (error) return next(error);

      req.session.save((error) => {
        if (error) return next(error);

        res.status(201).json({
          message: "Signup successful",
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
          },
        });
      });
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Email is already registered",
      });
    }

    next(error);
  }
}

function loginSuccess(req, res) {
  res.status(200).json({
    message: "Login successful",
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
    },
  });
}

function logout(req, res, next) {
  req.logout((error) => {
    if (error) return next(error);

    req.session.destroy((error) => {
      if (error) return next(error);

      res.clearCookie("connect.sid", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });

      res.status(200).json({
        message: "Logout successful",
      });
    });
  });
}

module.exports = {
  signup,
  loginSuccess,
  logout,
};
