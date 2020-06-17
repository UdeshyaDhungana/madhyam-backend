// Imports
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');
const User = require('../models/users');
const async = require('async');
const Article = require('../models/articles');
const nodemailer = require('nodemailer');
const Verification = require('../models/verification');
const jwt = require('jsonwebtoken');

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
		return res.status(422).json({
			error: "Inappropriate form data",
			errorDetails: errors.array()
		})
	}

	// Hash and store password
	// 10 rounds of salts
	bcrypt.hash(req.body.password, 10, (hashError, hash) => {
		if (hashError) {
			res.json(500).json({
				error: "Internal server error",
				errorDetails: "Error while hashing",
			})
		} else {
			new User({
				firstname: req.body.firstname,
				lastname: req.body.lastname,
				bio: req.body.bio,
				email: req.body.email,
				password: hash
			}).save((errorWhileSaving, createdUser) => {
				if (errorWhileSaving) {
					res.status(500).json({
						error: "Internal server error",
						errorDetails: "Error while saving user",
					});
				} else {
					//send mail to that email address
					new Verification({
						owner: createdUser._id,
					}).save((errorWhileVerification, createdVerification) => {
						if (errorWhileVerification){
							res.status(206).json({
								error: null,
								errorDetails: "User created but verification mailing failed"});
						} else {
							var transporter = nodemailer.createTransport({
								service: 'Gmail',
								auth: {
									user: process.env.MADHYAM_EMAIL,
									pass: process.env.MADHYAM_PASSWORD
								},
								port: 465
							});

							Verification_html = `
									<h1>Email verification</h1>
									<h3>Visit the link below to verify email</h3>
									<a href="http://192.168.1.64:3010/verification/${createdVerification.link}">Click Here</a>
									`;

							var mailOptions = {
								from: 'Madhyam Team <075bct095.udeshya@pcampus.edu.np>',
								to: req.body.email,
								subject: 'Email verification',
								html: Verification_html
							}

							transporter.sendMail(mailOptions, function(mailingError){
								if (mailingError){
									res.status(206).json({
										error: null,
										errorDetails: "User created but email verification failed"});
								} else {
									res.json({
										error: null,
										body: "User has been created successfully",
									})
								}
							});

						}
					});
				}
			})
		}
	})
}

// Getting a single user's profile
module.exports.singleUser_get = function (req, res, next) {
	User.findById(req.params.id).populate('articles', 'title url createdAt').exec((error, user) => {
		if (error || !user){
			res.status(404).json({
				error: "The requested user could not be found",
				errorDetails: "Not found",
			})
		}	else {
			// You should use JWT and send appropriate information
			// res.json(user)
			let toSend =  {
				firstname: user.firstname,
				lastname: user.lastname,
				bio: user.bio,
				articles: user.articles,
				editPermission: false,
				fullname: user.fullname,
				url: user.url,
				_id: user._id
			};
			// If user exists and 
			// If the person is requesting his own id, provide email too
			if (req.user_query.id == req.params.id){
				toSend['email'] = user.email;
				toSend['editPermission'] = true
			}
			res.json(Object.assign({error: null}, toSend));
		}
	});
}

module.exports.singleUser_delete = function(req, res){
	if (!req.user_query.id){
		return res.status(400).json({error: "Bad request!",
			errorDetails: "This happened because you maybe unauthorized\
			or the user does not exist",
		});
	}
	User.findOneAndDelete({_id: req.user_query.id}, (err, foundUser) => {
		if (err){
			return res.status(500).json({error: "Internal Server error",
				errorDetails: "Error while deleting",
			});
		}

		//The chances of this thing happening is you winning a lottery
		//This code won't execute, but kept here for safety reasons
		else if (!foundUser){
			return res.status(400).json({error: "Bad request", 
				errorDetails: "Dunno, some kinda error",
			});
		}

		else {
			//delete all articles of that user
			async.each(foundUser.articles, (value, callback) => {
				Article.findByIdAndDelete(value, (err) => {
					if (err){
						callback(err);
					}
					callback();
				});
			}, error => {
				if (error){
					//Manually checking for errors
					return res.status(500).json({error: "Something went wrong",
						errorDetails: "Error while clearing the database",
					});
				}
				else {
					return res.json({error: null, body: "User deleted successfully"});
				}
			})
		}
	});
}
