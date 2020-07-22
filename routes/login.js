const express = require('express');
const loginController = require('../controllers/loginController');
const {validate_login_post} = require('../middlewares/loginMiddleware');

const router = express.Router();

// We don't have get request for login

router.post('/', validate_login_post,loginController.login_post);

module.exports = router;
