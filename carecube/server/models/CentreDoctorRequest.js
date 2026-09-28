const mongoose = require("mongoose");

const centreDoctorRequestSchema = new mongoose.Schema(
  {
    centreId: { type: mongoose.Schema.Types.ObjectId, ref: "Centre", required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    initiatedBy: { type: String, enum: ["centre", "doctor"], default: "centre" },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CentreDoctorRequest", centreDoctorRequestSchema);
