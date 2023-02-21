

//   APP

const express = require("express");
const app = express();
const {handleCustomErrors, handle500Error, handlePSQL400Error} = require('./error_handling_controllers');

const {
  getTopics,
  getOneArticle,
  getArticles,
} = require("../code/controllers/controllers");

// const {handleCustomErrors} = require('./error_handling_controllers');

app.use(express.json());

// Use for Debugging:
// app.use((req, res, next) => {
//   console.log(`normal chain ${req.method} and ${req.url}`);
//   next(); 
// });



app.get("/api/topics", getTopics);


app.get("/api/articles/:articles_id", getOneArticle);

app.get("/api/articles", getArticles);



//TBD - see advanced error handlines notes - insert here

//app.use(handlePSQL400Error); TBD - Not working yet - need advice
app.use(handleCustomErrors);
app.use(handle500Error);

module.exports = app;