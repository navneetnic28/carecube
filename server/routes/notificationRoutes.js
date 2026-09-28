const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { getMyNotifications, markAsRead, markAllAsRead } = require("../controllers/notificationController");

// Any logged-in user (patient, doctor, centre owner, admin) can have notifications.
router.use(protect);

router.get("/", getMyNotifications);
router.patch("/:id/read", markAsRead);
router.patch("/read-all", markAllAsRead);

module.exports = router;
