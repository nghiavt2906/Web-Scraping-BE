const db = require("../db");
const readCsv = require("../utils/readCsv");

const handleCsvUpload = async (csvPath, reportData) => {
  await createReport(reportData);
  const keywords = await readCsv(csvPath);
};

const createReport = async (report) => {
  const { name, userId } = report;
  await db.query(
    "INSERT INTO reports (name, userId, createdDate) VALUES ($1, $2, $3)",
    [name, userId, new Date()]
  );
};

module.exports = {
  handleCsvUpload,
  createReport,
};
