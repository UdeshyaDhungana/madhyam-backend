var express = require('express');
var router = express.Router();

//middlewares import
var articleMiddlewares = require('../middlewares/articleMiddlewares');
//Controllers import
var articlesController = require('../controllers/articlesController');

// POST a new article
router.post('/', articleMiddlewares.validate_article_post, articlesController.article_post);

// GET single article
router.get('/:id', articlesController.singleArticle_get);

// DELETE request for an article
router.delete('/:id', articlesController.singleArticle_delete);

module.exports = router;
