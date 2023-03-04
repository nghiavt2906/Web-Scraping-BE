const pool = require("../config/database");

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

pool.connect((err, client) => {
  if (err) {
    console.error("connection error", err.stack);
    process.exit(1);
  } else {
    console.log("connected to db.");

    client.on("error", (err) => {
      console.log("Postgres client connection error : " + err);
    });
  }
});

module.exports = {
  query: (sql, params) => pool.query(sql, params),
};
