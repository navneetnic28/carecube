const mongoose = require("mongoose");

// A patient's review of a doctor, tied to one completed appointment so
// reviews are always from a real visit (one review per appointment).
const reviewSchema = new mongoose.Schema(
  {
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
      unique: true,
    },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, default: "", maxlength: 500 },
  },
  { timestamps: true }
);

reviewSchema.index({ doctorId: 1, createdAt: -1 });

module.exports = mongoose.model("Review", reviewSchema);
