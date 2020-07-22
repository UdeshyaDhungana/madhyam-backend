const {check} = require('express-validator');

module.exports.validate_login_post = [
  check('email').exists().trim().isEmail(),
  check('password').exists().escape()
]
