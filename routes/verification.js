var express = require('express');
var router = express.Router();

//Controllers import
var verificationController = require('../controllers/verificationController');

/* GET articles listing. */
router.get('/:id', verificationController.verification_get);

module.exports = router;
