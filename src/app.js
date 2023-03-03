require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");

const authRoute = require("./routes/auth.route");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoute);

module.exports = app;
