const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const {
  getMySchedule,
  addSchedule,
  deleteSchedule,
  getMyRequests,
  acceptRequest,
  rejectRequest,
  getMyStatus,
  setMyStatus,
  getMyProfile,
  updateMyProfile,
  createWalkIn,
  listJoinableCentres,
  requestToJoinCentre,
} = require("../controllers/doctorController");

router.get("/schedule", protect, authorize("doctor"), getMySchedule);
router.post("/schedule", protect, authorize("doctor"), addSchedule);
router.delete("/schedule/:id", protect, authorize("doctor"), deleteSchedule);

router.get("/requests", protect, authorize("doctor"), getMyRequests);
router.patch("/requests/:id/accept", protect, authorize("doctor"), acceptRequest);
router.patch("/requests/:id/reject", protect, authorize("doctor"), rejectRequest);

router.get("/status", protect, authorize("doctor"), getMyStatus);
router.patch("/status", protect, authorize("doctor"), setMyStatus);

router.get("/profile", protect, authorize("doctor"), getMyProfile);
router.patch("/profile", protect, authorize("doctor"), updateMyProfile);

router.post("/walk-in", protect, authorize("doctor"), createWalkIn);
router.get("/centres", protect, authorize("doctor"), listJoinableCentres);
router.post("/join-request", protect, authorize("doctor"), requestToJoinCentre);

module.exports = router;
