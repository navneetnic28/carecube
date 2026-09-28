const express = require("express");
const router = express.Router();
const {
  exploreCentres,
  getCentrePublic,
  getDoctorPublic,
  getAllDoctorsPublic,
} = require("../controllers/publicController");

// Public Explore + profile pages (no auth). Mounted AFTER appointmentRoutes in
// server.js so the more specific "/doctors/search" route always wins over
// this file's "/doctors/:id".
router.get("/doctors", getAllDoctorsPublic);
router.get("/centres", exploreCentres);
router.get("/centres/:id", getCentrePublic);
router.get("/doctors/:id", getDoctorPublic);

module.exports = router;
