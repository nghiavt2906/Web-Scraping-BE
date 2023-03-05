const db = require("../db");
const readCsv = require("../utils/readCsv");
const { initSearchResults } = require("./searchResults");
const SEARCH_STATUS = require("../constants/searchStatus");
const { scrapeKeywords } = require("./crawler");

const handleCsvUpload = async (csvPath, reportData) => {
  const insertedReport = await createReport(reportData);

  const keywords = await readCsv(csvPath);
  const searchResults = keywords.map((keyword) => [
    keyword,
    SEARCH_STATUS.PROCESSING,
    insertedReport.id,
  ]);
  const insertedSearchResults = await initSearchResults(searchResults);

  const processKeywords = insertedSearchResults.map((item) => ({
    id: item.id,
    text: item.keyword,
  }));
  scrapeKeywords(processKeywords);
};

const createReport = async (report) => {
  const { name, userId } = report;
  const result = await db.query(
    "INSERT INTO reports (name, userId, createdDate) VALUES ($1, $2, $3) RETURNING id",
    [name, userId, new Date()]
  );

  return result.rows[0];
};

const getKeywordsByReportId = async (id, userId) => {
  const query = `SELECT B.id, B.keyword
    FROM reports AS A, search_results AS B
    WHERE A.id = $1 AND A.userId = $2`;

  const result = await db.query(query, [id, userId]);
  return result.rows;
};

module.exports = {
  handleCsvUpload,
  createReport,
  getKeywordsByReportId,
};
