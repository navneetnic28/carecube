const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { createReport, getMyReports } = require("../controllers/reportController");

// Any authenticated user (patient, doctor, centre_owner) can file/view their own reports.
router.post("/", protect, createReport);
router.get("/my", protect, getMyReports);

module.exports = router;
