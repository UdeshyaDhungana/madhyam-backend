module.exports.validateToken_get =  function(req, res, next){
	let toSend = {};
	toSend['id'] = req.user_query.id;
	toSend['error'] = null;
	return res.json(toSend);
}
