const { Pool } = require('pg');

// if jest is running, NODE_ENV is set to "test".
// If in production, we must first run the seed-prod script as defined in package.json,
// which sets NODE_ENV=production before running seed.
// so ENV is set to 'test' or production if they are defined, otherwise ENV is set to 'development'
const ENV = process.env.NODE_ENV || 'development';



// this uses ENV to get PGDATABASE variable from either .env.test, or .env.development
// dotenv it a tool that loads environmental variables into proces.env
require('dotenv').config({
  path: `${__dirname}/../.env.${ENV}`,
});

// TBD - MIKE - UPDATES THIS COMMENT WHEN FIGURE OUT HOW DATABASE_URL GETS SET VIA .env.production
if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error('PGDATABASE not set');
}

// If in production stage, need to set a 'config' object that is used by hosted db on Elephant
const config = ENV === 'production' ?
                {connectionString: process.env.DATABASE_URL,
                  max: 2, } :
                {};

module.exports = new Pool(config);
