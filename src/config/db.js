const mysql2 = require("mysql2");
import { isDev } from '@get-all-work-done/shared/constants';

require('dotenv').config({
  path: !isDev ? '.env' : '.env.local',
  // debug: true,
});

const prodDbConfig = {
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  host: process.env.MYSQL_HOST,
  dialect: 'mysql',
  dialectModule: mysql2,
};

const devDBConfig = {
  ...prodDbConfig,
  database: process.env.DB_NAME_DEV,
};

module.exports = {
  development: devDBConfig,
  production: prodDbConfig,
};
