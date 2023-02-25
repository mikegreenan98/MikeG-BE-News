
//   APP
const express = require("express");
const app = express();
const {handleCustomErrors, handle500Error, handlePSQLErrors} = require('./error_handling_controllers');

const {
  getTopics,
  getOneArticle,
  getArticles,
  getCommentsOnArticle,
  getUsers,
  postComment,
  pushArticleVotes,
  getAPIs,
} = require("../code/controllers/controllers");

app.use(express.json());

// Useful for Debugging:
// app.use((req, res, next) => {
//   console.log(`normal chain ${req.method} and ${req.url}`);
//   next(); 
// });


// 03
app.get("/api/topics", getTopics);
// 04
app.get("/api/articles", getArticles);
// 05
app.get("/api/articles/:articles_id", getOneArticle);
// 06
app.get("/api/articles/:articles_id/comments", getCommentsOnArticle);
// 07
app.post("/api/articles/:articles_id/comments", postComment);
// 08
app.patch("/api/articles/:articles_id", pushArticleVotes);
// 09
app.get("/api/users", getUsers);
// 13
app.get("/api/", getAPIs); 


// error handlers below here - in order of call preferences
// i.e. 500 handler if nothing else handles the error
app.use(handleCustomErrors);
app.use(handlePSQLErrors);
app.use(handle500Error);

module.exports = app;