const { check, } = require("express-validator");
const extractJWT = require("./extract-jwt")

module.exports.validate_article_post = [
  /* Check for user */
  check('title').custom((_, {req}) => {
    extractJWT(req);
    if (req.user_query.id){
      return true;
    }
    throw new Error("User does not exist");
  }),
  check('title').exists().trim().notEmpty().escape(),
  check('paragraphs').exists().isArray().custom((paragraphs) => {
    for (const paragraph in paragraphs) {
      check(paragraph).trim().escape();
    }
    return true;
  }),
]
