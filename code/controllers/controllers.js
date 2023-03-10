// CONTROLLER

const {
  selectTopics,
  selectArticles,
  selectOneArticle,
  selectCommentsForArticle,
  insertComment,
  selectUsers,
  selectOneUser,
  updateArticleVotes,
  selectOneTopic,
  readEndpointFile,
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
  selectArticles(req)
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

  Promise.all([commentsExistPromise, articleExistsPromise])
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

exports.postComment = (req, res, next) => {
  insertComment(req)
    .then((result) => {
      res.status(201).send({ comment: result });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUsers = (req, res, next) => {
  selectUsers()
    .then((result) => {
      res.status(200).send({ users: result });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAPIs = (req, res, next) => {
  readEndpointFile()
  .then((result) => {
    res.status(200).send(result);
  })
};