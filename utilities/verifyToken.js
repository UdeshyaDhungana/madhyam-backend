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
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];
	
	req.user_query = {
		id: null,
		iat: null,
		exp: null,
	}

	jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
		if (!err){
			User.findById(user.id, (err, doc) => {
				if (!err && doc){
					req.user_query = Object.assign({}, user);
				}
				next();
			});
		} else {
			next();
		}
	});
}
