// Imports
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');
const User = require('../models/users');

// All users list
module.exports.users_get = function (req, res, next) {
	return res.status(400).json({
		body: "Not found",
	});
}

// Validation steps for creating new user
module.exports.validate_user_post = [
	check('firstname').exists().trim().isAlpha().isLength({ min: 3 }),
	check('lastname').exists().trim().isAlpha().isLength({ min: 3 }),
	check('bio').isLength({ max: 100 }).escape(),
	check('email').exists().trim().isEmail(),
	check('password').exists().isLength({ min: 8 }).escape(),
	// Check if username already exists
	check('email').custom(value => {
		return User.findOne({ email: value }).then(user => {
			if (user) {
				return Promise.reject('Email already in use');
			}
		});
	}),
	// Check both password matches
];

// POST request for creating new user
module.exports.users_post = function (req, res, next) {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({
			errors: errors.array()
		})
	}

	// Hash and store password
	bcrypt.hash(req.body.password, 10, (error, hash) => {
		if (error) {
			res.json(500).json({
				error
			})
		} else {
			new User({
				firstname: req.body.firstname,
				lastname: req.body.lastname,
				bio: req.body.bio,
				email: req.body.email,
				password: hash
			}).save((error) => {
				if (error) {
					res.status(500).json({
						error
					})
				} else {
					res.json({
						errors: null,
						message: "User has been created",
					})
				}
			})
		}
	})
}

// Getting a single user's profile
module.exports.singleUser_get = function (req, res, next) {
	// console.log(req.user_query);
	
	User.findById(req.params.id, (error, user) => {
		if (error || !user){
			res.status(404).json({
				user: null,
			})
		}	else {
			// You should use JWT and send appropriate information
			// res.json(user)
			let toSend =  {
				firstname: user.firstname,
				lastname: user.lastname,
				bio: user.bio,
				articles: user.articles,
			};
			// If user exists and 
			// If the person is requesting his own id, provide email too
			if (req.user_query && req.user_query.id == req.params.id){
				toSend['email'] = user.email;
			}
			res.json(toSend);
		}
	});
}
