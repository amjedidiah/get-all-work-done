const mysql2 = require("mysql2");

module.exports = {
  development: {
    username: "root",
    password: "amjedidiah",
    database: "getallworkdone",
    host: "127.0.0.1",
    dialect: "mysql",
    dialectModule: mysql2,
  },
  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  production: {
    username: "root",
    password: null,
    database: "database_production",
    host: "127.0.0.1",
    dialect: "mysql",
  },
};
