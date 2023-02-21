

exports.handleCustomErrors = (error, request, response, next) => {
//    console.log('THE ERROR WE GOT IS: ' + error);
//    console.log('THE ERROR CODE WE GOT IS: ' + error.code);
    if(error === "Article not found"){
        response.status(404).send({msg: error});
    } else if(error === "Invalid article was provided by client") {
        response.status(400).send({msg: error});
    } else if(error === "Invalid article provided by client - not possible to search comments"){
        response.status(400).send({msg: error});
    } else {
        next(error); //otherwise go to next error handler
    }
};

exports.handlePSQL400Error = (err, req, res, next) =>{
//    console.log('PSQL error code :' + err);
//    console.table(err);
    res.status(500).send({msg: err});
}

exports.handle500Error = (err, req, res, next) => {
    console.log(`Error chain ${req.method} and ${req.url} with error: ${err}`);
    res.status(500).send({ msg: "server error" });
};
  