

// CONTROLLER

const {selectTopics, selectOneArticle} = require("../models/models");
  
exports.getTopics = (req, res, next) => {
console.log("controller");
  selectTopics()
      .then((result) => {
        console.log("result77");
        console.log(result);
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