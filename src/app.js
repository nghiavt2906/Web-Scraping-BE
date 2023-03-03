require("dotenv").config();

const express = require("express");

const authRoute = require("./routes/auth.route");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ extended: true }));

app.use("/api/auth", authRoute);

module.exports = app;
