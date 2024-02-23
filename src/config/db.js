const mysql2 = require("mysql2");

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "mysql",
    dialectModule: mysql2,
  },
  test: {
    username: process.env.DB_USERNAME,
    password: null,
    database: "database_test",
    host: process.env.DB_HOST,
    dialect: "mysql",
  },
  production: {
    username: process.env.DB_USERNAME,
    password: null,
    database: "database_production",
    host: process.env.DB_HOST,
    dialect: "mysql",
  },
};
