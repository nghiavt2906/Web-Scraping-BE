const express = require("express");

const upload = require("../config/multer");

const reportController = require("../controllers/report.controller");

const router = express.Router();

router.post("/upload", upload.single("file"), reportController.uploadCsv);
router.get("/all", reportController.getUserReports);
router.get("/:reportId", reportController.getListOfKeywords);
router.get(
  "/:reportId/search-results",
  reportController.getSearchResultsByReport
);

module.exports = router;
