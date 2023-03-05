const express = require("express");

const searchResultsController = require("../controllers/searchResults.controller");

const router = express.Router();

router.get("/:id", searchResultsController.getSearchResultInformation);

module.exports = router;
