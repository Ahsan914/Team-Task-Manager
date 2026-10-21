
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { User } = require("../models/models.js");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({
          email: email.trim().toLowerCase(),
        }).select("+passwordHash");

        if (!user) {
          return done(null, false, {
            message: "Invalid email or password",
          });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
          return done(null, false, {
            message: "Invalid email or password",
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Save the user's ID in the session.
passport.serializeUser((user, done) => {
  done(null, user._id.toString());
});

// Retrieve the user from the database on later requests.
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;
