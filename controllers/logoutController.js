const extractJWT = require('../middlewares/extract-jwt');

module.exports.logout_get = function(req, res){
  extractJWT(req);
  if (!req.user_query.id){
    res.status(400).json({
      message: "You must be logged in!",
      errors: true,
    });
  }
  else {
    res.clearCookie('authorization');
    res.json({
      errors: null,
      message: "Logged out!",
    })
  }
}
