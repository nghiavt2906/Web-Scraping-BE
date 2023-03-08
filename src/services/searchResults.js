const db = require("../db");

const initSearchResults = async (searchResults, reportId) => {
  await db.searchResult.createMany({
    data: searchResults,
  });

  const results = await db.searchResult.findMany({
    where: { reportId },
    select: { id: true, keyword: true },
  });

  return results;
};

const updateSearchResult = async (searchResult) => {
  const { id, status, totalResults, totalLinks, totalAds, html } = searchResult;

  await db.searchResult.update({
    where: { id },
    data: {
      status,
      totalSearchResults: totalResults,
      totalLinks,
      totalAdwordsAdvertisers: totalAds,
      htmlCode: html,
    },
  });
};

const getSearchResultById = async (id, userId) => {
  const reports = await db.report.findMany({
    where: {
      userId,
    },
    select: {
      searchResults: { where: { id } },
    },
  });

  for (const report of reports) {
    if (report.searchResults.length > 0) {
      return report.searchResults[0];
    }
  }

  return {};
};

const getSearchResultsByReportId = async (reportId, userId) => {
  const report = await db.report.findFirst({ where: { id: reportId, userId } });
  if (!report) return [];

  const results = await db.searchResult.findMany({
    where: { reportId },
    orderBy: [
      {
        id: "asc",
      },
    ],
    select: {
      id: true,
      keyword: true,
      status: true,
    },
  });

  return results;
};

module.exports = {
  initSearchResults,
  updateSearchResult,
  getSearchResultById,
  getSearchResultsByReportId,
};
