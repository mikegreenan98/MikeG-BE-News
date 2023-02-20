

//   APP

const express = require("express");
const app = express();

const {
  getTopics, getArticles,
} = require("../code/controllers/controllers");

// const {handleCustomErrors} = require('./error_handling_controllers');

app.use(express.json());

// Use for Debugging:
// app.use((req, res, next) => {
//   console.log(`normal chain ${req.method} and ${req.url}`);
//   next(); 
// });



app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);



//app.use(handle500Error);
//app.use(handleCustomErrors);

module.exports = app;