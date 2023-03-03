const pool = require("../config/database");

pool.connect((err) => {
  if (err) {
    console.error("connection error", err.stack);
    process.exit(1);
  } else {
    console.log("connected to db.");
  }
});

module.exports = {
  query: (sql, params) => pool.query(sql, params),
};
