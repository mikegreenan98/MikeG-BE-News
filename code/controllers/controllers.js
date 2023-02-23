// CONTROLLER

const {
  selectTopics,
  selectArticles,
  selectOneArticle,
  selectCommentsForArticle,
  updateArticleVotes,
} = require("../models/models");

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

exports.getOneArticle = (req, res, next) => {
  selectOneArticle(req)
    .then((result) => {
      res.status(200).send({ article: result });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsOnArticle = (req, res, next) => {
  const articleExistsPromise = selectOneArticle(req);
  const commentsExistPromise = selectCommentsForArticle(req);

  Promise.all([commentsExistPromise,articleExistsPromise])
  .then((result) => {
    res.status(200).send({ comments: result[0] });
  })
  .catch((err) => {
    next(err);
  });
};

exports.pushArticleVotes = (req, res, next) => {
  updateArticleVotes(req)
    .then((result) => {
      res.status(200).send({ article: result });
    })
    .catch((err) => {
      next(err);
    });
};