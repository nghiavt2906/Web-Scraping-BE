const pool = require("../config/database");

pool.connect((err) => {
  if (err) {
    console.error("connection error", err.stack);
    process.exit(1);
  } else {
    console.log("connected to db.");
  }
});

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

module.exports = {
  query: (sql, params) => pool.query(sql, params),
};
