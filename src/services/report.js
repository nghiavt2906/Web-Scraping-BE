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

  return insertedReport;
};

const createReport = async (report) => {
  const { name, userId } = report;
  const sql =
    "INSERT INTO reports (name, userId, createdDate) VALUES ($1, $2, $3) RETURNING id";
  const result = await db.query(sql, [name, userId, new Date()]);

  return result.rows[0];
};

const getKeywordsByReportId = async (id, userId) => {
  const sql = `SELECT B.id, B.keyword
    FROM reports AS A, search_results AS B
    WHERE A.id = $1 AND A.userId = $2`;

  const result = await db.query(sql, [id, userId]);
  return result.rows;
};

const getUserReportsWithKeywords = async (userId) => {
  const sql = `SELECT A.id AS "reportId", A.name, B.id AS "searchResultId", B.keyword, B.status
    FROM reports AS A, search_results AS B 
    WHERE A.userId = $1 AND A.id = B.reportId
    ORDER BY A.createdDate DESC, B.id`;
  const result = await db.query(sql, [userId]);

  const data = {};
  for (const row of result.rows) {
    const { reportId, name, searchResultId, keyword, status } = row;
    const newKeyword = { id: searchResultId, keyword, status };

    if (name in data) {
      data[name].keywords.push(newKeyword);
    } else {
      data[name] = { id: reportId, name, keywords: [newKeyword] };
    }
  }

  const reports = [];
  for (const filename of Object.keys(data)) {
    reports.push(data[filename]);
  }

  return reports;
};

module.exports = {
  handleCsvUpload,
  createReport,
  getKeywordsByReportId,
  getUserReportsWithKeywords,
};
