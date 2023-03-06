const reportService = require("../services/report");
const searchResultsService = require("../services/searchResults");

const uploadCsv = async (req, res) => {
  const filename = req.file.filename;
  const reportData = { name: filename.split(".")[0], userId: req.user.id };

  try {
    const report = await reportService.handleCsvUpload(
      `./uploads/${filename}`,
      reportData
    );
    return res.json(report);
  } catch (error) {
    console.log(`Error: ${error}`);
    return res.status(500).send("Something went wrong");
  }
};

const getListOfKeywords = async (req, res) => {
  const { reportId } = req.params;
  try {
    const keywords = await reportService.getKeywordsByReportId(
      reportId,
      req.user.id
    );
    let data = keywords.length > 0 ? { id: reportId, keywords } : {};
    return res.json(data);
  } catch (error) {
    console.log(`Error: ${error}`);
    return res.status(500).send("Something went wrong");
  }
};

const getSearchResultsByReport = async (req, res) => {
  const { reportId } = req.params;

  try {
    const searchResults = await searchResultsService.getSearchResultsByReportId(
      reportId,
      req.user.id,
      ["id", "keyword", "status"]
    );
    return res.json(searchResults);
  } catch (error) {
    console.log(`Error: ${error}`);
    return res.status(500).send("Something went wrong");
  }
};

const getUserReports = async (req, res) => {
  try {
    const reports = await reportService.getUserReportsWithKeywords(req.user.id);
    return res.json(reports);
  } catch (error) {
    console.log(`Error: ${error}`);
    return res.status(500).send("Something went wrong");
  }
};

module.exports = {
  uploadCsv,
  getListOfKeywords,
  getSearchResultsByReport,
  getUserReports,
};
