

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
  let queryString = 
  `SELECT articles.author, title, articles.article_id, topic,
  articles.created_at, articles.votes, article_img_url,
  COUNT (comments.comment_id) AS comment_count
  FROM articles
  LEFT OUTER JOIN comments
  ON comments.article_id = articles.article_id
  GROUP BY articles.article_id
  ORDER BY created_at DESC;`

  return db.query(queryString).then((result) => {
    return result.rows;
  });
};


