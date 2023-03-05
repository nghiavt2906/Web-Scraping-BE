const format = require("pg-format");

const db = require("../db");

const initSearchResults = async (searchResults) => {
  const sql = `
    ${format(
      "INSERT INTO search_results (keyword, status, reportId) VALUES %L",
      searchResults
    )} RETURNING id, keyword`;
  const result = await db.query(sql);
  return result.rows;
};

const updateSearchResult = async (searchResult) => {
  const { id, status, totalResults, totalLinks, totalAds, html } = searchResult;
  const sql = `UPDATE search_results SET 
        status = $1, 
        totalSearchResults = $2, 
        totalLinks = $3, 
        totalAdwordsAdvertisers = $4, 
        htmlCode = $5 
        WHERE id = $6`;

  await db.query(sql, [status, totalResults, totalLinks, totalAds, html, id]);
};

const getSearchResultById = async (id, userId) => {
  const sql = `SELECT * FROM search_results 
    WHERE id = $1 AND reportId = (SELECT id FROM reports WHERE userId = $2)`;
  const result = await db.query(sql, [id, userId]);
  return result.rows.length > 0 ? result.rows[0] : {};
};

module.exports = {
  initSearchResults,
  updateSearchResult,
  getSearchResultById,
};
