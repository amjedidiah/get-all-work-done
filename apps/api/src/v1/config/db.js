const mysql2 = require('mysql2');

require('dotenv').config({
  path: '.env.local',
  // debug: true,
});

const dbConfig = {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  dialect: 'mysql',
  dialectModule: mysql2,
};

module.exports = {
  development: dbConfig,
  production: dbConfig,
};
