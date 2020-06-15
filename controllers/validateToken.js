module.exports.validateToken_get =  function(req, res, next){
	let toSend = {};
	toSend['userExists'] = req.user_query.tokenExists;
	toSend['id'] = req.user_query.id;

	return res.json(toSend);
}
