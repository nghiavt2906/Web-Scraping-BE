require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const credentials = require("./middlewares/credentials");
const corsOptions = require("./config/corsOptions");

const authRoute = require("./routes/auth.route");

const app = express();

app.use(credentials);
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoute);

module.exports = app;
