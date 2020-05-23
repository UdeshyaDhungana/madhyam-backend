const express = require('express');
const loginController = require('../controllers/loginController');

const router = express.Router();

// We don't have get request for login

router.post('/', loginController.validate_login_post, loginController.login_post);

module.exports = router;