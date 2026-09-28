const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const {
  getDashboard,
  getMyDoctors,
  requestDoctor,
  getCentreQueue,
  createWalkIn,
  updatePaymentStatus,
  updateAppointmentStatus,
  getCentreAppointments,
  getCentreSchedule,
  getCentreStatuses,
  setDoctorStatus,
  getMyProfile,
  updateMyProfile,
  getJoinRequests,
  respondJoinRequest,
  searchDoctorsToAdd,
} = require("../controllers/centreController");

router.use(protect, authorize("centre_owner"));

router.get("/dashboard", getDashboard);
router.get("/doctors", getMyDoctors);
router.get("/doctors/search", searchDoctorsToAdd);
router.post("/doctors/request", requestDoctor);
router.get("/queue", getCentreQueue);
router.post("/walk-in", createWalkIn);
router.get("/appointments", getCentreAppointments);
router.patch("/appointments/:id/payment", updatePaymentStatus);
router.patch("/appointments/:id/status", updateAppointmentStatus);
router.get("/schedule", getCentreSchedule);

router.get("/status", getCentreStatuses);
router.patch("/status", setDoctorStatus);

router.get("/join-requests", getJoinRequests);
router.patch("/join-requests/:id/:action", respondJoinRequest);

router.get("/profile", getMyProfile);
router.patch("/profile", updateMyProfile);

module.exports = router;
