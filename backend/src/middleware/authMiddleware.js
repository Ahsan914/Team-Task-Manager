
function requireAuth(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({
      message: "Please log in first",
    });
  }

  next();
}

module.exports = requireAuth;
