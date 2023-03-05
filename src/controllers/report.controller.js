const reportService = require("../services/report");

const uploadCsv = async (req, res) => {
  const filename = req.file.filename;
  const reportData = { name: filename.split(".")[0], userId: 2 };

  try {
    await reportService.handleCsvUpload(`./uploads/${filename}`, reportData);
    return res.sendStatus(200);
  } catch (error) {
    console.log(`Error: ${error}`);
    return res.status(500).send("Something went wrong");
  }
};

const getListOfKeywords = async (req, res) => {
  const { id } = req.params;
  try {
    const keywords = await reportService.getKeywordsByReportId(id, req.user.id);
    let data = keywords.length > 0 ? { id, keywords } : {};
    return res.json(data);
  } catch (error) {
    console.log(`Error: ${error}`);
    return res.status(500).send("Something went wrong");
  }
};

module.exports = {
  uploadCsv,
  getListOfKeywords,
};
