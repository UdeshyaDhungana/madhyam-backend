// Imports
const { validationResult } = require('express-validator');
const Article = require('../models/articles');
const User = require('../models/users');

// Vaidation for creating a new article
// POST a new article
module.exports.article_post = function (req, res) {
	// JWT is needed to make sure current user is submitting this
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		//unprocessable entity
		return res.status(422).json({
			error: "Inappropriate form data",
			errorDetails: errors.array()
		})
	}

	if (!req.user_query.id) {
		return res.status(401).json({
			error: "Unauthorized user",
			errorDetails: "User does not exist, or token has expired",
		})
	}

	new Article({
		title: req.body.title,
		paragraphs: req.body.paragraphs,
		author: req.user_query.id
	}).save()
		.then(currentArticle => {
			User.updateOne(
				{ _id: req.user_query.id },
				{ $push: { articles: [currentArticle._id]}})
				.then(currentArticle => {

				}).catch(err => {

				});
			if (updateError) {
				// If error occured abort saving process
				Article.deleteOne({ _id: currentArticle._id }, (deleteError) => {
					if (deleteError) {
						// THIS IS MANDATORY TO DEBUG
						// This is next level error
						console.log(`Error while saving post ${deleteError}`);
					}
					// Aborted saving					
					res.status(500).json({
						errorDetails: "Error while saving the article",
						error: "Internal server error",
					});
				})
			}
			// Felt cute, might add error handling in next version idk
			// After saving send details of present page
			res.json({
				error: null,
				body: "Article created successfully",
				id: currentArticle._id,
			});
		})
})
	.catch(savingError => {
		if (savingError) {
			return res.status(500).json({
				error: "Internal Server Error",
				errorDetails: "Error while saving the article",
			})
		}
	});
}

module.exports.singleArticle_get = function (req, res) {
	Article.findById(req.params.id).populate('author', 'firstname lastname fullname url')
		.exec((findingError, article) => {
			if (findingError || !article) {
				// if error or article is not found
				res.status(404).json({
					error: "Article not found",
					errorDetails: "The article does not exist",
				})
			} else {
				res.json(Object.assign({
					article: article._doc,
					error: null,
				}, ));
			}
		}
		)
}

//delte article remaining
module.exports.singleArticle_delete = function(req, res){
	currentArticleId = req.params.id;
	if (!req.user_query.id){
		return res.status(401).json({
			error: "You are not authorized",
			errorDetails: "You are not authorized to delete this article",
		})
	} else {
		Article.findOneAndDelete({_id: req.params.id, author: req.user_query.id}, (findAndDelError, foundArticle) => {
			if (findAndDelError){
				res.status(500).json({
					error: "Internal server error",
					errorDetails: "Error while deleting article",
				});
			} else {
				if (!foundArticle){
					res.status(400).json({
						error: "Deletion unsuccessful",
						errorDetails: "You are not authorized to delete this article"
					})
				} else {
					User.findByIdAndUpdate(req.user_query.id,
						{ $pullAll: {articles: [req.params.id] } },
						{ new: true },
						(updateError) => {
							if (updateError){
								res.status(206).json({
									error:null,
									body: "Article deleted, but couldn't be cleared from user's entry",
								})
							} else {
								res.json({
									error: null,
									body: "Article deleted successfully",
								})
							}
						});
				}
			}
		});
	}
}

