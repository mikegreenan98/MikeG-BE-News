
//need to have this listen happening when not running supertest
// listening is done automatically when using supertest

// set 'app' to our place in javascript where we are listening
const app = require('./code/app.js');

// tell server which port it can listen from
const {PORT = 9090} = process.env;
app.listen(PORT, () => console.log(`Listening on port: ${PORT} .....`));

// BTW - you can test this file by doing command line: node listen.js