import mysql2 from 'mysql2';
import { isDev } from '../constants';
import { Sequelize } from 'sequelize';

require('dotenv').config({
  debug: isDev,
});

export default new Sequelize(
  process.env.MYSQL_DATABASE as string,
  process.env.MYSQL_USER as string,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST,
    dialect: 'mysql',
    dialectModule: mysql2,
    logging: false,
  }
);
