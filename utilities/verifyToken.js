// Require necessary packages
const jwt = require('jsonwebtoken');

/*
This middleware parses the header and decodes JWT to a json as follows

req.user_query = {
	id: USER_ID
}

*/
module.exports = function(req, res, next){
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];
	
	user_query = {id: null};

	jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
		if (!err && user){
			user_query = user;
		}
	});
	
	req.user_query = Object.assign({}, user_query);
	next();
}
