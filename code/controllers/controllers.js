

// CONTROLLER


const {selectTopics,selectArticles, selectOneArticle} = require("../models/models");

  
exports.getTopics = (req, res, next) => {
  selectTopics()
      .then((result) => {
        res.status(200).send({ topics: result });
    })
    .catch((err) => {
      next(err);  
    });
};



exports.getOneArticle = (req, res, next) => {
  selectOneArticle(req)
      .then((result) => {
        res.status(200).send({ article: result });
  })
  .catch((err) => {
    next(err);  
  });
};

exports.getArticles = (req, res, next) => {
    selectArticles()
        .then((result) => {
          res.status(200).send({ articles: result });
      })
      .catch((err) => {
        next(err);  
      });
  };

