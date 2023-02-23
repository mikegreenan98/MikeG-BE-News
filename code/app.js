
//   APP
const express = require("express");
const app = express();
const {handleCustomErrors, handle500Error, handlePSQL400Error} = require('./error_handling_controllers');

const {
  getTopics,
  getOneArticle,
  getArticles,
  getCommentsOnArticle,
  getUsers,
  postComment,
  pushArticleVotes,
} = require("../code/controllers/controllers");

app.use(express.json());

// Use for Debugging:
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

//app.use(handlePSQL400Error); TBD - Not working yet - need advice
app.use(handleCustomErrors);
app.use(handle500Error);

module.exports = app;