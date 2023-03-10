const reportService = require("../services/report");
const searchResultsService = require("../services/searchResults");

const errorCodes = require("../constants/errorCodes");

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
    console.log(`Error: ${error.message}`);

    switch (error.message) {
      case errorCodes.FILE_SIZE_ERROR:
        return res
          .status(400)
          .send("File size must be from 1 to 100 keywords!");
    }

    return res.status(500).send("Something went wrong");
  }
};

const getListOfKeywords = async (req, res) => {
  const reportId = parseInt(req.params.reportId);
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
  const reportId = parseInt(req.params.reportId);

  try {
    const searchResults = await searchResultsService.getSearchResultsByReportId(
      reportId,
      parseInt(req.user.id)
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
