

// MODELS


const db = require("../../db/connection");

exports.selectTopics = () => {
  console.log('selecttopics');
  let queryString = `
  SELECT *
  FROM topics`; 

  console.log(queryString);

  return db.query(queryString).then((result) => {
    console.log('result');
    console.log(result.rows);
    return result.rows;
  });
};


