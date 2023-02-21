// MODELS

const db = require("../../db/connection");

exports.selectTopics = () => {
  let queryString = `
  SELECT *
  FROM topics`;
  return db.query(queryString).then((result) => {
    return result.rows;
  });
};

exports.selectArticles = () => {
  let queryString = `SELECT articles.author, title, articles.article_id, topic,
  articles.created_at, articles.votes, article_img_url,
  COUNT (comments.comment_id) AS comment_count
  FROM articles
  LEFT OUTER JOIN comments
  ON comments.article_id = articles.article_id
  GROUP BY articles.article_id
  ORDER BY created_at DESC;`;

  return db.query(queryString).then((result) => {
    return result.rows;
  });
};

exports.selectOneArticle = (request) => {
  const articleID = request.params.articles_id;
  if (!Number.isInteger(+articleID)) {
    return Promise.reject("Invalid article was provided by client");
  }
  let queryString = `
  SELECT *
  FROM articles
  WHERE article_id = ${articleID}`;

  return db.query(queryString).then((result) => {
    if (result.rowCount === 0) {
      return Promise.reject("Article not found");
    }
    return result.rows;
  });
};

exports.selectCommentsForArticle = (request) => {
  const articleID = request.params.articles_id;
  if (!Number.isInteger(+articleID)) {
    return Promise.reject("Invalid article provided by client - not possible to search comments");
  }
  let queryString = `
  SELECT *
  FROM comments
  WHERE article_id = ${articleID}
  ORDER BY created_at DESC`;
  
  return db.query(queryString).then((result) => {
    return result.rows;
  });

};
