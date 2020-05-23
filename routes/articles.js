var express = require('express');
var router = express.Router();

//Controllers import
var articlesController = require('../controllers/articlesController');

/* GET articles listing. */
router.get('/', articlesController.article_get);

// POST a new article
router.post('/', articlesController.validate_article_post, articlesController.article_post);

// GET single article
router.get('/:id', articlesController.singleArticle_get);

module.exports = router;