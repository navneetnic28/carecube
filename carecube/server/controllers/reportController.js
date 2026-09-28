const Report = require("../models/Report");

// POST /api/reports
// Any logged-in patient, doctor or centre owner can file an issue.
// body: { targetType, targetId, subject, message }
const createReport = async (req, res) => {
  try {
    const { targetType, targetId, subject, message } = req.body;

    if (!subject || !message) {
      return res.status(400).json({ success: false, message: "subject and message are required" });
    }

    const report = await Report.create({
      reporterId: req.user.id,
      reporterRole: req.user.role,
      targetType: targetType || "other",
      targetId: targetId || undefined,
      subject,
      message,
    });

    res.status(201).json({ success: true, report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/reports/my
const getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({ reporterId: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createReport, getMyReports };
