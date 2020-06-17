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
	const validation_errors = validationResult(req);

	if (!validation_errors.isEmpty()){
		//Bad request error
		return res.status(422).json({
			error: "Username or password is incorrect",
			errorDetails: validation_errors,
		});
	}

	// authenticate user
	User.findOne({email: req.body.email}, (findingError, foundUser) => {
		if (findingError){
			return res.status(500).json({
				error: "Internal server error",
				errorDetails: "Server error occured while searching...",
			});
		}
		else if (!foundUser){
			// Error occured or user is not found
			return res.status(401).json({
				errorDetails: "Server error occured while searching...",
				error: "Email or password is incorrect",
			})
		}

		//returns same=true if matched, same=false, if unmatched
		bcrypt.compare(req.body.password, foundUser.password, (comparingError, same) => {
			if (comparingError){
				res.status(500).json({
					error: "Internal server error",
					errorDetails: "Error occured while hashing",
				});
			}
			else if (!same){
				// If not same or
				return res.status(401).json({
					errorDetails: "Authentication error",
					error: "Email or password is incorrect"
				});
			} else {
				// Authentication is done
				// Generate a token and send it back to user
				var payload = {
					id: foundUser._id,
				}

				// Send a new accesstoken on login
				jwt.sign(payload, process.env.ACCESS_TOKEN,
					{expiresIn: '14d'}, (signingError, accessToken) => {
						if (signingError){
							return res.status(500).json({
								error: "Internal server error",
								errorDetails: "Error while signing token",
							})
						} else {
							//set cookie
							var token = "Bearer " + accessToken;
							//13 days 23 hrs 50 minutes
							var twoWeekApprox = 86400*1000*14-10*60*1000;
							res.cookie('authorization', token, 
								{maxAge: twoWeekApprox, httpOnly: true,
								}).json({
									id: foundUser._id,
									error: null,
									body: "Login permission granted"
								});
						}
					});
			}
		})
	})
}
