// Require necessary packages
const jwt = require('jsonwebtoken');
const User = require('../models/users');

/*
This middleware parses the header and decodes JWT to a json as follows

req.user_query = {
	id: USER_ID
}

*/
module.exports = function(req, res, next){
	const authHeader = req.cookies['authorization'];
	const token = authHeader && authHeader.split(' ')[1];

	req.user_query = {
		id: null,
		iat: null,
		exp: null,
		tokenExists: Boolean(token),
	}

	jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
		if (!err){
			User.findById(user.id, (err, doc) => {
				if (!err && doc){
					Object.assign(req.user_query, user);
					Object.assign(req.user_query, {tokenExists: true});
				}
				next();
			});
		} else {
			next();
		}
	});
}
