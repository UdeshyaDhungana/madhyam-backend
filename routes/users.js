const express = require('express');
const router = express.Router();

// Controller import
const usersController = require("../controllers/usersController");
const userControllerMiddlewares = require("../middlewares/userMiddlewares");

// CREATING A NEW USER
router.post("/",
  userControllerMiddlewares.validate_user_post,
  usersController.users_post);

// GET a specific user
router.get("/:id",usersController.singleUser_get);

module.exports = router;
