var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // Should be modified according to whether user is logged in or not
  res.json({
    title: "Madhyam",
    body: "A simple app for your writings!"
  });
});

module.exports = router;
