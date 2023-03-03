const db = require("../db");

const findUserByUsername = async (username) => {
  const result = await db.query(
    "SELECT id, username FROM users WHERE username = $1",
    [username]
  );
  return result.rows.length > 0 ? result.rows[0] : null;
};

const createUser = async (user) => {
  const { username, password } = user;
  await db.query("INSERT INTO users (username, password) VALUES ($1, $2)", [
    username,
    password,
  ]);
};

module.exports = {
  findUserByUsername,
  createUser,
};
