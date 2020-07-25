// Imports
const { validationResult } = require('express-validator');
const Article = require('../models/articles');
const User = require('../models/users');

//middlewares
const extractJWT = require('../middlewares/extract-jwt');

// Vaidation for creating a new article
// POST a new article
module.exports.article_post = async (req, res) =>  {
  try{
    const errors = validationResult(req);

    //to recieve safely from catch block
    if (!errors.isEmpty()){
      throw {
        type: "FORM_ERROR",
        message: "Error in form",
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
    if ('type' in err){
      switch (err.type){
        case 'FORM_ERROR':
          res.status(400).json({
            errors: true,
            message: err.message,
            errorDetails: err.formErrors,
          });
      }
    } else {
      res.status(500).json({
        errors: true,
        message: "Internal Server Error",
      });
    }
  }
}

// GET single article
module.exports.singleArticle_get = async (req, res) => {
  try{
    //check if url is in ObjectID format
    let article = await Article.findById(req.params.id)
      .populate('author', 'firstname lastname fullname url').exec();

    if (!article){
      throw {
        type: "NOT_FOUND",
        message: "The article could not be found",
      }
    }
    res.json({
      errors: false,
      article: article,
    });
  }
  catch(x){
    if ('type' in x){
      switch (x.type){
        case 'NOT_FOUND':
          return res.status(404).json({
            errors: true,
            message: x.message,
          });
      }
    }
    return res.status(500).json({
      errors: true,
      message: "Internal Server Error",
    });
  }
}

// DELETE article 
module.exports.singleArticle_delete = async (req, res) => {
  currentArticleId = req.params.id;
  try{
    extractJWT(req);
    if (!req.user_query.id){
      throw {
        type: "NO_USER",
        message: "No user present",
      }
    }

    let foundArticle = await Article.findOneAndDelete({
      _id: req.params.id, author: req.user_query.id
    });

    if (!foundArticle){
      throw {
        type: "NOT_FOUND",
        message: "The requested article could not be found",
      }
    } 

    return res.json({
      errors: true,
      message: "Article deleted successfully",
    });
  }

  catch(x){
    if ('type' in x){
      switch (x.type){
        case 'NO_USER':
          return res.status(401).json({
            errors: true,
            message: x.message,
          });
        case 'NOT_FOUND':
          return res.status(404).json({
            errors: true,
            message: x.message,
          })
      }
    }
    res.status(500).json({
      errors: true,
      message: "Internal Server Error",
    });
  }
}

