

//   APP

const express = require("express");
const app = express();

const {
  getTopics,
} = require("../code/controllers/controllers");

// const {handleCustomErrors} = require('./error_handling_controllers');

app.use(express.json());

app.use((req, res, next) => {
  console.log(`normal chain ${req.method} and ${req.url}`);
  next(); 
});



app.get("/api/topics", getTopics);




//app.use(handle500Error);
//app.use(handleCustomErrors);

module.exports = app;