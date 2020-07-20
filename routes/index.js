const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(_, res) {
  // Should be modified according to whether user is logged in or not
  res.json({
    title: "Madhyam",
    body: "A simple app for your writings!"
  });
});

module.exports = router;
