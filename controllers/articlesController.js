// Imports
const { validationResult } = require('express-validator');
const Article = require('../models/articles');
const User = require('../models/users');

// Vaidation for creating a new article
// POST a new article
module.exports.article_post = async (req, res) =>  {
  try{
    const errors = validationResult(req);

    //to recieve safely from catch block
    if (!errors.isEmpty()){
      throw {
        type: "FORM_ERROR",
        formErrors: errors.array(),
      }
    }

    //save article
    let currentArticle = await new Article({
      title: req.body.title,
      paragraphs: req.body.paragraphs,
      author: req.user_query.id,
    }).save();

    //push article to user/articles
    let _ = await User.updateOne(
      {_id: req.user_query.id},
      {$push: {articles: [currentArticle._id]}},
    );

    //return success
    return res.json({
      errors: false,
      message: "Article created successfully",
      articleURL: currentArticle.url,
    });

  }
  catch(err){
    //if form error
    if ('type' in err && err['type'] === "FORM_ERROR"){
      res.status(400).json({
        errors: true,
        message: "Client Error",
        errorDetails: err.formErrors,
      });
    } else {
      res.status(500).json({
        errors: true,
        message: "Internal Server Error",
      });
    }
  }
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

