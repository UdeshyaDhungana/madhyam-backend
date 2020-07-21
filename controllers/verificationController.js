//Imports
const Verification = require('../models/verification');
const User = require('../models/users');

module.exports.verification_get = function(req, res, next){
  currentLink = req.params.id;
  Verification.findOneAndDelete({link: currentLink}, (findingError, foundVerification) => {
    if (findingError){
      res.status(500).json({
        error: "Internal server error",
        errorDetails: "Deletion error",
      });
    } else {
      if (!foundVerification){
        return res.status(400).json({
          error: "Bad request",
          errorDetails: "Bad request",
        });
      }

      var relatedUserId = foundVerification.owner;
      User.findByIdAndUpdate(relatedUserId, {
        emailConfirmation: true,
      }, (updateError, user) => {
        if (updateError){
          res.status(500).json({
            error: "Internal server error",
            errorDetails: "Error while updating data",
          });
        } else {
          //Email was verified, so no worries
          res.json({
            error: null,
            body: "Email is verified"
          });
        }
      });
    }
  });
}
