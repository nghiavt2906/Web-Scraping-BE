const express = require("express");

const upload = require("../config/multer");

const reportController = require("../controllers/report.controller");

const router = express.Router();

router.post("/upload", upload.single("file"), reportController.uploadCsv);

module.exports = router;
