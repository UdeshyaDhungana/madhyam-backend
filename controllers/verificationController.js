//Imports
const Verification = require('../models/verification');
const User = require('../models/users');

module.exports.verification_get = async (req, res) => {
  currentLink = req.params.id;

  try{

    let foundVerification = await Verification.findOneAndDelete(
      {link: currentLink},
      (findingError, foundVerification) 
    );

    if (!foundVerification){
      throw {
        type: "NOT_FOUND",
        message: "The requested verification could not be found",
      }
    }
    //verification was found: find corresponding user, and update
    var relatedUserId = foundVerification.owner;

    let user = await User.findByIdAndUpdate(relatedUserId, {
      emailConfirmation: true,
    }, (updateError, user));

    //this will never happen provided i haven't setup an endpoint for user deletion
    if (!user){
      throw {
        type: "NOT_FOUND",
        message: "User not found",
      }
    }

    //everything was alright
    res.json({
      errors: false,
      message: "Email successfully verified. You may close this tab!",
    });

  }
  catch(err){
    if ('type' in err){
      switch (err.type){
        case 'NOT_FOUND':
          return res.status(404).json({
            errors: true,
            message: err.message,
          });
      }
    }

    return res.status(500).json({
      message: "Internal server error",
      errors: true,
    });
  }
}
