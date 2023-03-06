require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const corsOptions = require("./config/corsOptions");

const authRoute = require("./routes/auth.route");
const reportRoute = require("./routes/report.route");
const searchResultsRoute = require("./routes/searchResults.route");

const credentials = require("./middlewares/credentials");
const checkAuth = require("./middlewares/checkAuth");

const app = express();

app.use(credentials);
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use(checkAuth);
app.use("/api/reports", reportRoute);
app.use("/api/search-results", searchResultsRoute);

module.exports = app;
