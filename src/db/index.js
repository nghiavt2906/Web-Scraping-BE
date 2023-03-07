const pool = require("../config/database");
const { initTablesQuery, createTables } = require("../constants/sqlQueries");

pool.on("error", (err, client) => {
  console.log("Postgres connection error : " + err);
  console.log("retry connecting to db...");
  pool.connect((err) => {
    if (err) {
      console.error("connection error", err.stack);
    } else {
      console.log("connected to db.");
    }
  });
});

pool.connect(async (err, client) => {
  if (err) {
    console.error("connection error", err.stack);
    process.exit(1);
  } else {
    console.log("connected to db.");

    client.on("error", (err) => {
      console.log("Postgres client connection error : " + err);
    });

    if (process.env.NODE_ENV === "test") {
      await pool.query(initTablesQuery);
    } else {
      await pool.query(createTables);
    }
  }
});

module.exports = {
  query: (sql, params) => pool.query(sql, params),
};
