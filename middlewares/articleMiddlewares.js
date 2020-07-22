const { check, } = require("express-validator");

module.exports.validate_article_post = [
  check('title').exists().trim().notEmpty().escape(),
  check('paragraphs').exists().isArray().custom((paragraphs) => {
    for (const paragraph in paragraphs) {
      check(paragraph).trim().escape();
    }
    return true;
  }),
]
