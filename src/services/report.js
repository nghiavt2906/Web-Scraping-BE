const db = require("../db");
const readCsv = require("../utils/readCsv");
const searchResultService = require("./searchResults");
const Crawler = require("./crawler");

const SEARCH_STATUS = require("../constants/searchStatus");
const errorCodes = require("../constants/errorCodes");

const handleCsvUpload = async (csvPath, reportData) => {
  const keywords = await readCsv(csvPath);

  if (keywords.length > 100 || keywords.length === 0) {
    throw new Error(errorCodes.FILE_SIZE_ERROR);
  }

  const insertedReport = await createReport(reportData);

  const searchResults = keywords.map((keyword) => ({
    keyword,
    status: SEARCH_STATUS.PROCESSING,
    reportId: insertedReport.id,
    totalSearchResults: "",
    htmlCode: "",
  }));
  const insertedSearchResults = await searchResultService.initSearchResults(
    searchResults,
    insertedReport.id
  );

  const processKeywords = insertedSearchResults.map((item) => ({
    id: item.id,
    text: item.keyword,
  }));

  const crawler = new Crawler(searchResultService);
  crawler.scrapeKeywords(processKeywords);

  return insertedReport;
};

const createReport = async (report) => {
  const result = await db.report.create({
    data: report,
  });

  return result;
};

const getKeywordsByReportId = async (id, userId) => {
  const report = await db.report.findFirst({ where: { id, userId } });
  if (!report) return [];

  const results = await db.searchResult.findMany({
    where: {
      reportId: report.id,
    },
    select: {
      id: true,
      keyword: true,
    },
  });

  return results;
};

const getUserReportsWithKeywords = async (userId) => {
  const results = await db.report.findMany({
    where: {
      userId,
    },
    orderBy: [
      {
        createdDate: "desc",
      },
    ],
    select: {
      id: true,
      name: true,
      searchResults: {
        select: { id: true, keyword: true, status: true },
      },
    },
  });

  return results;
};

module.exports = {
  handleCsvUpload,
  createReport,
  getKeywordsByReportId,
  getUserReportsWithKeywords,
};
