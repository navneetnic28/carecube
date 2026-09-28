const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const {
  searchDoctors,
  bookAppointment,
  myAppointments,
  queueStatus,
  getDoctorAppointments,
  callNext,
  completeAppointment,
  markNoShow,
  submitReview,
} = require("../controllers/appointmentController");

// Public
router.get("/doctors/search", searchDoctors);

// Patient
router.post("/appointments/book", protect, authorize("patient"), bookAppointment);
router.get("/appointments/my", protect, authorize("patient"), myAppointments);
router.get("/appointments/:id/queue-status", protect, authorize("patient"), queueStatus);
router.post("/appointments/:id/review", protect, authorize("patient"), submitReview);

// Doctor
router.get("/appointments/doctor", protect, authorize("doctor"), getDoctorAppointments);
router.patch("/appointments/doctor/call-next", protect, authorize("doctor"), callNext);
router.patch("/appointments/doctor/:id/complete", protect, authorize("doctor"), completeAppointment);
router.patch("/appointments/doctor/:id/no-show", protect, authorize("doctor"), markNoShow);

module.exports = router;
