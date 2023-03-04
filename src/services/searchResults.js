const format = require("pg-format");

const db = require("../db");

const initSearchResults = async (searchResults) => {
  await db.query(
    format(
      "INSERT INTO search_results (keyword, status, reportId) VALUES %L",
      searchResults
    )
  );
};

module.exports = {
  initSearchResults,
};
