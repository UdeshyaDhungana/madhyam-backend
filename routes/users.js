var express = require('express');
var router = express.Router();

// Controller import
var usersController = require('../controllers/usersController');

/* GET users listing. */
router.get('/', usersController.users_get);

// CREATING A NEW USER
router.post('/', usersController.validate_user_post, usersController.users_post);

// GET a specific user

router.get('/:id',usersController.singleUser_get);

router.delete('/:id', usersController.singleUser_delete);


module.exports = router;
