var express = require('express');
var router = express.Router();

//Controllers import
var articlesController = require('../controllers/articlesController');

// POST a new article
router.post('/', articlesController.validate_article_post, articlesController.article_post);

// GET single article
router.get('/:id', articlesController.singleArticle_get);

// DELETE request for an article
router.delete('/:id', articlesController.singleArticle_delete);

module.exports = router;
