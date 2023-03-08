const db = require("../db");

const findUserByUsername = async (username) => {
  const result = await db.user.findFirst({
    where: {
      username,
    },
  });

  return result ? result : null;
};

const createUser = async (user) => {
  await db.user.create({
    data: user,
  });
};

module.exports = {
  findUserByUsername,
  createUser,
};
