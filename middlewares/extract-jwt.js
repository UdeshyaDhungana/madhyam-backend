const jwt = require('jsonwebtoken');
/*
    This middleware parses the header and decodes JWT to a json as follows

    req.user_query = {
      id: USER_ID->(null/String)
    }
*/

module.exports = (req) => {
  let token;
  try{
    let auth = req.cookies.authorization;
    token = auth && auth.split(' ')[1];
  }
  catch(err){
    /* This happens if properties do not exist */
    token = null;
  }

  try{
    let tokenContent = jwt.verify(token, process.env.ACCESS_TOKEN);
    req.user_query = {
      id: tokenContent.id,
    }
  }
  catch(err){
    req.user_query = {
      id: null,
    }
  }

}
