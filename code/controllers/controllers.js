// CONTROLLER

const {
  selectTopics,
  selectArticles,
  selectOneArticle,
  selectCommentsForArticle,
  insertComment,
  selectUsers,
  selectOneUser,
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

  Promise.all([commentsExistPromise, articleExistsPromise])
    .then((result) => {
      res.status(200).send({ comments: result[0] });
    })
    .catch((err) => {
      next(err);
    });
};



exports.postComment = (req, res, next) => {
  //Frstly, need to check of article exists before trying to insert a comment fo that article
  selectOneArticle(req)
    .then((result) => {
      // Secondly, need to check user exists before trying to insert a comment
      selectOneUser(req)
        .then((result) => {
          // now safe to insert comment because user exists
          insertComment(req)
            .then((result) => {
              res.status(200).send({ comment: result });
            })
            .catch((err) => {
              next(err);
            });
        })
        .catch((err) => {
          next(err);
        });
    })
    .catch((err) => {
      next(err);
    });
};

// THIS VERSION BELOW DOES NOT WORK FOR ERROR HANDLING - BUT I THOUGHT IT WOULD ?
// IT SEEMS TO CATCH WRONG ERRORS
// exports.postComment = (req, res, next) => {
//   //Frstly, need to check of article exists before trying to insert a comment fo that article
//   selectOneArticle(req)
//   .then((result) => {
//   // Secondly, need to check user exists before trying to insert a comment
//   selectOneUser(req)
//   .then((result) => {
//     // Thirdly, now it is safe to insert comment because aboce 2 checks are OK
//   insertComment(req)
//   .then((result) => {
//     res.status(200).send({ comment: result });
//   });
//   })
//   .catch((err) => {
//     next(err);
//   });
//   });
// };


exports.getUsers = (req, res, next) => {
  selectUsers()
    .then((result) => {
      res.status(200).send({ users: result });
    })
    .catch((err) => {
      next(err);
    });
};
