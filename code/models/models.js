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

exports.selectOneTopic = (topic) => {
    let queryString = `
    SELECT *
    FROM topics
    WHERE slug = '${topic}'`;
    return db.query(queryString).then((result) => {
      return result.rows;
    });
};


exports.selectArticles = (req) => {
  // assign any queries received from the request
  let sortQuery = req.query.sort_by;
  let orderQuery = req.query.order;
  let topicQuery = req.query.topic;

  // create query string in 2 parts because possibly need to insert
  // a 'WHERE ...' in the middle.
  // finally query = querystring1 + querystring2
  let queryString1 = `SELECT articles.author, title, articles.article_id, topic,
  articles.created_at, articles.votes, article_img_url,
  COUNT (comments.comment_id) AS comment_count
  FROM articles
  LEFT OUTER JOIN comments
  ON comments.article_id = articles.article_id`;
  let queryString2 = ` GROUP BY articles.article_id`;

  // Deal with the order= query
  const validOrderOptions = ["ASC", "DESC"];
  let order = "";
  if (orderQuery === undefined) {
    //set DESC as default if not provided
    order = "DESC";
  } else if (validOrderOptions.includes(orderQuery)) {
    order = orderQuery;
  } else {
    // if here we have an order=XYZ where XYZ is not valid - so reject 
    return Promise.reject("Bad Request - Invalid query order= was provided");
  }

  //Deal with the sort_by= query
  const validSortOptions = [
    "article_id",
    "title",
    "topic",
    "author",
    "body",
    "created_at",
    "votes",
    "article_img_url",
  ];
  if (sortQuery === undefined) {
    // default to sorting by 'created_at'
    queryString2 += ` ORDER BY articles.created_at ${order};`;
  } else if (validSortOptions.includes(sortQuery)) {
    queryString2 += ` ORDER BY articles.${sortQuery} ${order};`;
  } else {
    // if here we have a sort_by=XYZ, where XYZ is not valid - so reject
    return Promise.reject("Bad Request - Invalid query sort_by= was provided");
  };

  //Deal with topic= query - but allow anything to be queried even if not in topics db
  if (topicQuery !== undefined) {
    queryString1 += ` WHERE topic = '${topicQuery}'`;
  };

  //Now finalise the querystring and make the query
  let queryString = queryString1 + queryString2;
    return db.query(queryString)
    .then((result) => {
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
  WHERE article_id = '${articleID}'`;

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
    return Promise.reject(
      "Invalid article provided by client - not possible to search comments"
    );
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

exports.updateArticleVotes = (request) => {
  const articleID = request.params.articles_id;
  const incValue = request.body.inc_votes;

  if (incValue === undefined) {
    return Promise.reject("Bad Request - no inc_votes provided");
  }
  if (!Number.isInteger(+incValue)) {
    return Promise.reject("Bad Request - inc_votes must be an integer");
  }
  if (!Number.isInteger(+articleID)) {
    return Promise.reject("Bad Request - article_id must be an integer");
  }

  let queryString = `
  UPDATE articles
  SET votes = votes + ${incValue}
  WHERE article_id = ${articleID}
  RETURNING *`;

  return db.query(queryString).then((result) => {
    if (result.rowCount === 0) {
      return Promise.reject("Article not found");
    }
    return result.rows;
  });
};


exports.insertComment = (request) => {
  const articleID = request.params.articles_id;
  const commentsReceived = request.body;
  // construct the comment to insert:
  let comment = {
    //comment_id: --> to be provided by the psql query,
    body: commentsReceived.body,
    article_id: articleID,
    author: commentsReceived.username,
    votes: 0,
    // created_at: --> psql will provide by using "DEFAULT NOW()",
  };
  // need to avoid SQL injection by using $ format for the query string:
  const valuesArray = [
    comment.body, comment.author, comment.article_id, comment.votes];

  let queryString = `
  INSERT INTO comments
  (body, author, article_id, votes) 
  VALUES
  ($1, $2, $3, $4)
  RETURNING *;`;
  return db.query(queryString, valuesArray).then((result) => {
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
    } else{
    return result.rows;
    }
  });
};