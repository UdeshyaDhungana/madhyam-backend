var express = require('express');
var router = express.Router();
const validateTokenController  = require('../controllers/validateToken');

router.get('/', validateTokenController.validateToken_get);

module.exports = router;
