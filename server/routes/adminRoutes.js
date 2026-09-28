const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const {
  getDashboard,
  getPendingDoctors,
  verifyDoctor,
  rejectDoctor,
  getPendingCentres,
  verifyCentre,
  rejectCentre,
  getUsers,
  getAppointments,
  getAllDoctors,
  getDoctorDetail,
  disableDoctor,
  enableDoctor,
  getAllCentres,
  getCentreDetail,
  disableCentre,
  enableCentre,
  getReports,
  resolveReport,
} = require("../controllers/adminController");

router.use(protect, authorize("admin"));

router.get("/dashboard", getDashboard);

router.get("/doctors/pending", getPendingDoctors);
router.patch("/doctors/:id/verify", verifyDoctor);
router.patch("/doctors/:id/reject", rejectDoctor);
router.get("/doctors", getAllDoctors);
router.get("/doctors/:id", getDoctorDetail);
router.patch("/doctors/:id/disable", disableDoctor);
router.patch("/doctors/:id/enable", enableDoctor);

router.get("/centres/pending", getPendingCentres);
router.patch("/centres/:id/verify", verifyCentre);
router.patch("/centres/:id/reject", rejectCentre);
router.get("/centres", getAllCentres);
router.get("/centres/:id", getCentreDetail);
router.patch("/centres/:id/disable", disableCentre);
router.patch("/centres/:id/enable", enableCentre);

router.get("/users", getUsers);
router.get("/appointments", getAppointments);

router.get("/reports", getReports);
router.patch("/reports/:id/resolve", resolveReport);

module.exports = router;
