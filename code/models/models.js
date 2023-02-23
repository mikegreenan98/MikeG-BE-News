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




exports.insertComment = (request) => {
  const articleID = request.params.articles_id;
  const commentsReceived = request.body;
  // construct the comment to insert:
  let commentToInsert = {
    //comment_id: --> to be provided by the psql query,
    body: commentsReceived.body,
    article_id: articleID,
    author: commentsReceived.username,
    votes: 0,
    // created_at: --> psql will provide by using "DEFAULT NOW()",
  };
  let queryString = `
  INSERT INTO comments
  (body, author, article_id, votes) 
  VALUES
  ('${commentToInsert.body}','${commentToInsert.author}',${commentToInsert.article_id},${commentToInsert.votes})
  RETURNING *;`;
  return db.query(queryString).then((result) => {
    if (result.rowCount === 0) {
      return Promise.reject("Article not found");
    }
    return result.rows;
  });
};

exports.selectUsers = () => {
  let queryString = `
  SELECT *
  FROM users`;
  return db.query(queryString).then((result) => {
    return result.rows;
  });
};

exports.selectOneUser = (req) => {
  let user = req.body.username;
  let queryString = `
  SELECT *
  FROM users
  WHERE username = '${user}'`;
  return db.query(queryString).then((result) => {
    if (result.rowCount === 0) {
      return Promise.reject("Bad Request - User does not exist");
    }
    return result.rows;
  });
};