const { Pool } = require("pg");

let dbConfig;
if (process.env.NODE_ENV === "test") {
  dbConfig = {
    host: process.env.TEST_DB_HOST,
    user: process.env.TEST_DB_USER,
    password: process.env.TEST_DB_PASSWORD,
    database: process.env.TEST_DB_NAME,
    port: 5432,
    ssl: {
      rejectUnauthorized: false,
    },
  };
} else {
  dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 5432,
    ssl: {
      rejectUnauthorized: false,
    },
  };
}

const pool = new Pool(dbConfig);

module.exports = pool;
