// REQUIRE PACKAGES
const {check, validationResult} = require('express-validator');
const User = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports.validate_login_post = [
	check('email').exists().trim().isEmail(),
	check('password').exists().escape()
]


module.exports.login_post = function(req, res, next){
	// form data error
	const errors = validationResult(req);

	if (!errors.isEmpty()){
		return res.status(400).json({
			user: null,
			message: "Email or password is incorrect"
		});
	}

	// authenticate user
	User.findOne({email: req.body.email}, (err, foundUser) => {
		if (err || !foundUser){
			// Error occured or user is not found
			return res.status(401).json({
				user: null,
				message: "Email or password is incorrect",
			})
		}

		bcrypt.compare(req.body.password, foundUser.password, (err, same) => {
			if (err || !same){
				// If not same or
				// If error occured
				return res.status(404).json({
					user: null,
					message: "Email or password is incorrect"
				});
			}
			// Authentication is done
			// Generate a token and send it back to user
			var currentUser = {
				id: foundUser._id,
			}

			// Send a new accesstoken on login
			const accessToken = jwt.sign(currentUser, process.env.ACCESS_TOKEN, {
				// Token expires in 14days
				expiresIn: '14d'
			});

			res.json({
				accessToken,
				message: "Login permission granted"
			});

		})
	})
}
