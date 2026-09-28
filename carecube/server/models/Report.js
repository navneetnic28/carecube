const mongoose = require("mongoose");

// Lets patients, doctors or centre owners flag a problem (a bad experience,
// a wrong listing, a payment dispute, etc.) for the CareCube admin to review
// and resolve — Section 13's "Handle reports/issues".
const reportSchema = new mongoose.Schema(
  {
    reporterId: { type: mongoose.Schema.Types.ObjectId, required: true },
    reporterRole: {
      type: String,
      enum: ["patient", "doctor", "centre_owner"],
      required: true,
    },

    targetType: {
      type: String,
      enum: ["doctor", "centre", "appointment", "other"],
      default: "other",
    },
    targetId: { type: mongoose.Schema.Types.ObjectId },

    subject: { type: String, required: true },
    message: { type: String, required: true },

    status: {
      type: String,
      enum: ["open", "resolved"],
      default: "open",
    },
    resolutionNote: { type: String, default: "" },
    resolvedAt: Date,
    resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);
