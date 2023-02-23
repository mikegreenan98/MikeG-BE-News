

//   APP

const express = require("express");
const app = express();
const {handleCustomErrors, handle500Error, handlePSQL400Error} = require('./error_handling_controllers');

const {
  getTopics,
  getOneArticle,
  getArticles,
  getCommentsOnArticle,
  pushArticleVotes,
} = require("../code/controllers/controllers");

// const {handleCustomErrors} = require('./error_handling_controllers');

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

// 08
app.patch("/api/articles/:articles_id", pushArticleVotes);


//TBD - see advanced error handlines notes - insert here

//app.use(handlePSQL400Error); TBD - Not working yet - need advice
app.use(handleCustomErrors);
app.use(handle500Error);

module.exports = app;