const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    centreId: { type: mongoose.Schema.Types.ObjectId, ref: "Centre", required: true },

    appointmentDate: { type: Date, required: true },
    tokenNumber: { type: Number, required: true },

    reason: { type: String, default: "" },

    status: {
      type: String,
      enum: ["waiting", "in_queue", "consulting", "completed", "cancelled", "no_show"],
      default: "waiting",
    },

    source: {
      type: String,
      enum: ["online", "walk_in"],
      default: "online",
    },

    patientDetails: {
      name: { type: String, default: "" },
      phone: { type: String, default: "" },
      age: { type: Number },
      gender: { type: String, default: "" },
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "unpaid", "cash", "refunded"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "online", "none"],
      default: "none",
    },
    amount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
