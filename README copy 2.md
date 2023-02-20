# Mike Greenan's Northcoders News API

## Instructions to Connect to the Dabases 

This repository includes two databases: nc_news and nc_news_test.
The later is for testing purposes, the otherf for development.

You will need to create two .env files for your project at the root directory: .env.test and .env.development. Into each, add a line as follows:

In .env.test, add the line: PGDATABASE=nc_news_test
In .env.development, add the line: PGDATABASE=nc_news

Also, you will need to make sure that these are git ignored, i.e. in your .gitignore file you could add: .env.*

