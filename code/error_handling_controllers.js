

exports.handleCustomErrors = (error, request, response, next) => {
//    console.log('THE ERROR WE GOT IS: ' + error);
//    console.log('THE ERROR CODE WE GOT IS: ' + error.code);
    if(error === "Article not found"){
        response.status(404).send({msg: error});
    } else if(error === "Invalid article was provided by client") {
        response.status(400).send({msg: error});
    } else if(error === "Invalid article provided by client - not possible to search comments"){
        response.status(400).send({msg: error});
    } else if(error === "Bad Request - Invalid article_id - not possible to add comment"){
        response.status(400).send({msg: error});
    } else if(error === "Bad Request - User does not exist"){
        response.status(404).send({msg: error});
    } else if(error === "Bad Request - no inc_votes provided"){
        response.status(400).send({msg: error});
    } else if(error === "Bad Request - inc_votes must be an integer"){
        response.status(400).send({msg: error});
    } else if(error === "Bad Request - article_id must be an integer"){
        response.status(400).send({msg: error});
    } else {
        next(error); //otherwise go to next error handler
    };
};

exports.handlePSQLErrors = (err, req, res, next) =>{
//    console.log('PSQL error code :' + err.code);
//    console.log('PSQL error :' + err.detail);
//    console.table(err);
    if(err.code === "23503"){
        res.status(404).send({msg: "Not found"});
    } else if(err.code === "22P02"){
        res.status(400).send({msg: "Bad request"});
    } else {
        next(err); //otherwise go to next error handler
    };
}

exports.handle500Error = (err, req, res, next) => {
    console.log(`Error chain ${req.method} and ${req.url} with error: ${err}`);
    res.status(500).send({ msg: "server error" });
};
  