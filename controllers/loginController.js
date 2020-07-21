// REQUIRE PACKAGES
const {validationResult} = require('express-validator');
const User = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


module.exports.login_post = async (req, res) => {
  // form data error
  const validation_errors = validationResult(req);
  let currentUser;

  try{

    if (!validation_errors.isEmpty()){
      //Bad request error
      throw {type: "FORM_ERROR"};
    }

    currentUser = await User.findOne({
      email: req.body.email
    });

    //if not users found
    if (!currentUser){
      return res.status(401).json({
        message: "Credentials did not match",
      });
    }

    //bcrypt compare
    let didMatch = await bcrypt.compare(req.body.password, currentUser.password);
    if (!didMatch){
      return res.status(401).json({
        message: "Credentials did not match",
      })
    }

    //if password matched
    let payload = {
      id: currentUser._id,
    };

    let token = jwt.sign(
      payload, process.env.ACCESS_TOKEN,
      {expiresIn: '14d'});

    token = "Bearer " + token;

    //13 days 23 hrs 50 minutes
    let twoWeekApprox = 86400*1000*14;
    let exactExpiryDAte = Date.now()+twoWeekApprox;

    res.cookie('authorization', token, 
      {maxAge: twoWeekApprox, httpOnly: true,
      }).json({
        id: currentUser._id,
        expiresIn: exactExpiryDAte,
        errors: null,
        body: "Login permission granted"
      });
  }
  catch(e){
    if ('type' in e && e.type==="FORM_ERROR"){
      return res.status(400).json({
        errors: true,
        message: "Error in form",
      });
    }
    res.status(500).json({
      error: true,
      message: "Internal server error"
    });
  }
}

