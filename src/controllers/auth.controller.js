const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userService = require("../services/user");

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const userInDb = await userService.findUserByUsername(username);
    if (!userInDb)
      return res.status(400).send("Username or password is invalid!");

    const isValidPass = await bcrypt.compare(password, userInDb.password);
    if (!isValidPass)
      return res.status(400).send("Username or password is invalid!");

    const accessToken = await jwt.sign(
      { username, id: userInDb._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    const refreshToken = await jwt.sign(
      { username, id: userInDb._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "3h" }
    );

    res.cookie("token", refreshToken, {
      httpOnly: true,
      maxAge: 3 * 60 * 60 * 1000,
    });

    res.status(200).json({ accessToken });
  } catch (error) {
    console.log(`Error: ${error}`);
    res.status(500).send("Something went wrong");
  }
};

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
