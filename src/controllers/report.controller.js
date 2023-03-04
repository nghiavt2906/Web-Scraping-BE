const reportService = require("../services/report");

const uploadCsv = async (req, res) => {
  const filename = req.file.filename;
  const reportData = { name: filename.split(".")[0], userId: 123 };

  try {
    await reportService.handleCsvUpload(`./uploads/${filename}`, reportData);
  } catch (error) {
    console.log(`Error: ${error}`);
    return res.status(500).send("Something went wrong");
  }

  res.sendStatus(200);
};

module.exports = {
  uploadCsv,
};
