const format = require("pg-format");

const db = require("../db");

const initSearchResults = async (searchResults) => {
  const result = await db.query(`
    ${format(
      "INSERT INTO search_results (keyword, status, reportId) VALUES %L",
      searchResults
    )} RETURNING id, keyword`);
  return result.rows;
};

const updateSearchResult = async (searchResult) => {
  const { id, status, totalResults, totalLinks, totalAds, html } = searchResult;
  const query = `UPDATE search_results SET 
        status = $1, 
        totalSearchResults = $2, 
        totalLinks = $3, 
        totalAdwordsAdvertisers = $4, 
        htmlCode = $5 
        WHERE id = $6`;

  await db.query(query, [status, totalResults, totalLinks, totalAds, html, id]);
};

module.exports = {
  initSearchResults,
  updateSearchResult,
};
