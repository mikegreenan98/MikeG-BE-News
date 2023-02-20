

// CONTROLLER

const {selectTopics,} = require("../models/models");
  
exports.getTopics = (req, res, next) => {
console.log("controller");
  selectTopics()
      .then((result) => {
        console.log("result77");
        console.log(result);
        res.status(200).send({ topics: result });
    })
    .catch((err) => {
      next(err);  
    });
};

  