const bcrypt = require("bcrypt");

const userService = require("../services/user");

const login = async (req, res) => {};

const signup = async (req, res) => {
  const { username, password } = req.body;

  try {
    const userInDb = await userService.findUserByUsername(username);
    if (userInDb) return res.status(400).send("User already exists!");

    const passwordHash = await bcrypt.hash(password, 12);

    await userService.createUser({ username, password: passwordHash });

    res.sendStatus(200);
  } catch (error) {
    console.log(`Error: ${error}`);
    res.status(500).send("Something went wrong");
  }
};

module.exports = {
  signup,
  login,
};
