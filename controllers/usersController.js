const bcrypt = require('bcrypt');
const { validationResult }=  require('express-validator');
const User = require('../models/users');
const nodemailer = require('nodemailer');
const SALT_ROUNDS = 10;
const setMailOptions = require('../utilities/mailSenderConfig');
const Verification = require('../models/verification');

// POST request for creating new user
module.exports.users_post = async function (req, res){
	//variables required for this endpoint
	let currentUser;
	let currentVerification;
	//save the user
	try{
		const validationErrors = validationResult(req);

		if (!validationErrors.isEmpty()) {
			throw {
				type: "FORM_ERROR",
				formErrors: validationErrors.array(),
			}
		}

		let hashed = await bcrypt.hash(req.body.password, SALT_ROUNDS);

		currentUser = await new User({
			firstname: req.body.firstname,
			lastname: req.body.lastname,
			bio: req.body.bio,
			email: req.body.email,
			password: hashed,
		}).save();

		currentVerification = await new Verification({
			owner: currentUser._id
		}).save();

	}
	catch(err){
		if ('type' in err && err.type === "FORM_ERROR"){
			return res.status(422).json({
				message: "Error in form",
				errors: err.formErrors,
			});
		}
		return res.status(500).json({
			message: "Internal server error",
			errors: null,
			email: null,
		})
	}

	try{
		//send the email confirmation
		let transporter = nodemailer.createTransport({
			service: 'Gmail',
			auth: {
				user: process.env.MADHYAM_EMAIL,
				pass: process.env.MADHYAM_PASSWORD
			},
			port: 465
		});

		let mailOptions = setMailOptions(req.body.email, currentVerification.link);

		let info = await transporter.sendMail(mailOptions);

		return res.json({
			message: "User created successfully",
			email: `${currentUser.email}`
		});

	}
	catch(err){
		res.status(206).json({
			message: "User created, but mailing failed",
			email: `${currentUser.email}`
		})
	}
}

// Getting a single user's profile
module.exports.singleUser_get = function (req, res) {
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
