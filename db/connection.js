const { Pool } = require('pg');
const { connectionString } = require('pg/lib/defaults');

// if jest is running, process.env.NODE_ENV is set to "test"
// so ENV is set to 'test' if it exists (via jest), otherwise is ENV set to 'development'
const ENV = process.env.NODE_ENV || 'development';


// If in production stage, need to set a 'config' object that is used by hosted db on Elephant
// TBD - MIKE - UPDATES THIS COMMENT WHEN FIGURE OUT HOW DATABASE_URL GETS SET VIA .env.production
const config = ENV === 'production' ?
                {connectionString: process.env.DATABASE_URL,
                  max: 2, } :
                {};

// this uses ENV to get PGDATABASE variable from either .env.test, or .env.development
// dotenv it a tool that loads environmental variables into proces.env
require('dotenv').config({
  path: `${__dirname}/../.env.${ENV}`,
});

// TBD - MIKE - UPDATES THIS COMMENT WHEN FIGURE OUT HOW DATABASE_URL GETS SET VIA .env.production
if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error('PGDATABASE not set');
}

module.exports = new Pool(config);
