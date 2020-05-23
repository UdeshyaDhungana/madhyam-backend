// Imports
const { check, validationResult } = require('express-validator');
const Article = require('../models/articles');
const User = require('../models/users');

// GET all articles
module.exports.article_get = function (req, res, next) {
	return res.status(400).json({
		body: "Not found",
	});
}

// Vaidation for creating a new article
module.exports.validate_article_post = [
	check('title').exists().trim().notEmpty().escape(),
	check('paragraphs').exists().custom((paragraphs) => {
		for (const paragraph in paragraphs) {
			check(paragraph).trim().notEmpty().escape();
		}
		// if everything is alright
		return true;
	}),
]
// POST a new article
module.exports.article_post = function (req, res, next) {
	// JWT is needed to make sure current user is submitting this
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({
			errors: errors.array()
		})
	}

	if (!req.user_query) {
		return res.status(401).json({
			body: "No user found",
			message: "Unauthorized error",
		})
	}
	new Article({
		title: req.body.title,
		paragraphs: req.body.paragraphs,
		author: req.user_query.id
	}).save((error, currentArticle) => {
		if (error) {
			return res.status(500).json({
				message: "Internal Server Error",
			})
		}
		// Append current article to user's article field
		User.updateOne({ _id: req.user_query.id }, { $push: { articles: [currentArticle._id] } }, (err) => {
			if (err) {
				// If error occured abort saving process
				Article.deleteOne({ _id: currentArticle.id }, (err) => {
					if (err) {
						// THIS IS MANDATORY TO DEBUG
						// This is next level error
						console.log(`Error while saving post ${err}`);
					}
					// Aborted saving					
					res.status(500).json({
						error: "Article could not be created",
						message: "Internal server error",
					});
				})
			}
			// Felt cute, might add error handling in next version idk
			// After saving send details of present page
			res.json({
				error: null,
				message: "Article created successfully",
			});
			// TODO: Redirect to current article's page
		})
	})

}

module.exports.singleArticle_get = function (req, res, next) {
	Article.findById(req.params.id, (error, article) => {
		if (error || !article) {
			// if error or article is not found
			res.status(404).json({
				body: "Not found",
			})
		} else {
			res.json(article);
		}
	})
}