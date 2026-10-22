
const { body, validationResult } = require("express-validator");

function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
      })),
    });
  }

  next();
}

const validateSignup = [
  body("name")
    .isString()
    .withMessage("Name must be text")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .bail()
    .isLength({ max: 100 })
    .withMessage("Name must be 100 characters or fewer"),

  body("email")
    .isString()
    .withMessage("Email must be text")
    .bail()
    .trim()
    .isEmail()
    .withMessage("Enter a valid email address")
    .bail()
    .customSanitizer((email) => email.toLowerCase()),

  body("password")
    .isString()
    .withMessage("Password must be text")
    .bail()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),

  handleValidationErrors,
];

const validateLogin = [
  body("email")
    .isString()
    .withMessage("Email must be text")
    .bail()
    .trim()
    .isEmail()
    .withMessage("Enter a valid email address")
    .bail()
    .customSanitizer((email) => email.toLowerCase()),

  body("password")
    .isString()
    .withMessage("Password must be text")
    .bail()
    .notEmpty()
    .withMessage("Password is required"),

  handleValidationErrors,
];

module.exports = {
  validateSignup,
  validateLogin,
};
