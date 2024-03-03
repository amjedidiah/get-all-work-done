const mysql2 = require("mysql2");
// const pg = require("pg");
import { isDev } from '@get-all-work-done/shared/constants';

require('dotenv').config({
  path: !isDev ? '.env' : '.env.local',
  // debug: true,
});

const mySQLDbConfig = {
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  host: process.env.MYSQL_HOST,
  dialect: 'mysql',
  dialectModule: mysql2,
};

// const testDBConfig = {
//   ...mySQLDbConfig,
//   database: process.env.DB_NAME_TEST,
// };

// const pgDbConfig = {
//   username: process.env.POSTGRES_USER,
//   password: process.env.POSTGRES_PASSWORD,
//   database: process.env.POSTGRES_DATABASE,
//   host: process.env.POSTGRES_HOST,
//   dialect: 'postgres',
//   dialectModule: pg,
//   dialectOptions: {
//     ssl: { require: true },
//   },
// };

module.exports = {
  development: mySQLDbConfig,
  // test: testDBConfig,
  // production: pgDbConfig,
};
