const mongoose = require("mongoose");

// In-app notifications for patients (and others) — e.g. "Doctor accepted your
// appointment", "Your consultation has started", "Appointment cancelled".
const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    message: { type: String, default: "" },
    type: {
      type: String,
      enum: ["appointment_accepted", "appointment_started", "appointment_completed", "appointment_cancelled", "general"],
      default: "general",
    },
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
