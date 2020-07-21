module.exports.logout_get = function(req, res, next){
  if (!req.user_query.id){
    res.status(400).json({
      error: "Bad request",
      errorDetails: "You must be logged in to do this",
    });
  } else {
    res.clearCookie('authorization');
    res.json({
      error: null,
      body: "Cookie deleted successfully",
    })
  }
}
