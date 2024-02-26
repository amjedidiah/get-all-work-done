const mysql2 = require("mysql2");
const pg = require("pg");
import { isDev } from '@get-all-work-done/shared/constants';

require('dotenv').config({
  path: !isDev ? '.env' : '.env.local',
  // debug: true,
});

const devDBConfig = {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  dialect: "mysql",
  dialectModule: mysql2,
};

const testDBConfig = {
  ...devDBConfig,
  database: process.env.DB_NAME_TEST,
};

const prodDBConfig = {
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  host: process.env.POSTGRES_HOST,
  dialect: "postgres",
  dialectModule: pg,
  dialectOptions: {
    ssl: { require: true },
  },
};

module.exports = {
  development: devDBConfig,
  test: testDBConfig,
  production: prodDBConfig,
};
