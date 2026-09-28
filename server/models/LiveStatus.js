const mongoose = require("mongoose");

// Real-time per-day availability of a doctor at a specific centre/chamber.
// One document per (doctorId, centreId, date). Lets patients see
// 🟢 Available / 🟡 Delayed / 🔴 Unavailable / Holiday without phone calls.
const liveStatusSchema = new mongoose.Schema(
  {
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    centreId: { type: mongoose.Schema.Types.ObjectId, ref: "Centre", required: true },
    date: { type: Date, required: true }, // normalized to start of day

    status: {
      type: String,
      enum: ["available", "delayed", "unavailable", "holiday"],
      default: "available",
    },
    delayMinutes: { type: Number, default: 0 },
    note: { type: String, default: "" },

    updatedByRole: {
      type: String,
      enum: ["doctor", "centre_owner"],
    },
  },
  { timestamps: true }
);

liveStatusSchema.index({ doctorId: 1, centreId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("LiveStatus", liveStatusSchema);
