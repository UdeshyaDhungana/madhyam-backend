//Imports
const Verification = require('../models/verification');
const User = require('../models/users');

module.exports.verification_get = function(req, res, next){
	currentLink = req.params.id;
	Verification.findOneAndDelete({link: currentLink}, (err, foundVerification) => {
		if (err){
			res.status(500).json({
				body: "Internal server error"
			});
		} else {
			if (!foundVerification){
				return res.status(400).json({
					body: "Bad request"
				});
			}

			relatedUserId = foundVerification.owner;
			User.findByIdAndUpdate(relatedUserId, {
				emailConfirmation: true,
			}, (error, user) => {
				if (error){
					res.status(500).json({
						body: "Internal server error"
					});
				} else {

					//Email was verified, so no worries
					res.json({
						body: "Email is verified"
					});
				}
			});
		}
	});
}
