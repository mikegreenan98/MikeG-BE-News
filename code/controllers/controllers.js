

// CONTROLLER

const {selectTopics,selectArticles} = require("../models/models");
  
exports.getTopics = (req, res, next) => {
  selectTopics()
      .then((result) => {
        res.status(200).send({ topics: result });
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
    