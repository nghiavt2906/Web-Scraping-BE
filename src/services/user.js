const db = require("../db");

const findUserByUsername = async (username) => {
  const sql = "SELECT * FROM users WHERE username = $1";
  const result = await db.query(sql, [username]);
  return result.rows.length > 0 ? result.rows[0] : null;
};

const createUser = async (user) => {
  const { username, password } = user;
  const sql = "INSERT INTO users (username, password) VALUES ($1, $2)";
  await db.query(sql, [username, password]);
};

module.exports = {
  findUserByUsername,
  createUser,
};
