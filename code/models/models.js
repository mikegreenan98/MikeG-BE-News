

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

exports.selectOneArticle = (request) => {
  const articleID = request.params.articles_id;
  if(!Number.isInteger(+articleID)){
    return Promise.reject('Invalid article was provided by client');
  };

  let queryString = `
  SELECT *
  FROM articles
  WHERE article_id = ${articleID}`; 

  return db.query(queryString).then((result) => {
    if(result.rowCount === 0){
      return Promise.reject('Article not found');
    }
    return result.rows;
  });
};
