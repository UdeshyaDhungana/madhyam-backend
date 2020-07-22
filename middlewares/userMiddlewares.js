const {check} =  require("express-validator");
const User = require('../models/users');

// Validation steps for creating new user
module.exports.validate_user_post = [
  check('firstname').exists().trim().isAlpha().isLength({ min: 3 }),
  check('lastname').exists().trim().isAlpha().isLength({ min: 3 }),
  check('bio').isLength({ max: 100 }).escape(),
  check('email').exists().trim().isEmail(),
  check('password').exists().isLength({ min: 8 }).escape(),
  // Check if username already exists
  check('email').custom(async value => {
    return User.findOne({ email: value }).then(user => {
      if (user) {
        throw new Error("Email already in use");
      }
    });
  }),
];
