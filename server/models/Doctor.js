const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, lowercase: true, trim: true, required: true },
    phone: { type: String, unique: true, sparse: true, trim: true },
    password: { type: String, required: true, select: false },

    specialization: { type: String, default: "" },
    qualification: { type: String, default: "" },
    registrationNumber: { type: String, default: "" },
    experience: { type: String, default: "" }, // e.g. "5 years"
    bio: { type: String, default: "" },
    photoUrl: { type: String, default: "" },
    consultationFee: { type: Number, default: 0 },
    education: { type: String, default: "" },
    specializationTags: [{ type: String }],

    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
    rejectionReason: { type: String },
    verifiedAt: Date,
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    rejectedAt: Date,
    rejectedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    // Admin can disable an already-verified doctor (misconduct, complaints, etc.)
    // without losing their verification history.
    isDisabled: { type: Boolean, default: false },
    disabledReason: { type: String, default: "" },

    // Centres this doctor is associated with (approved)
    chambers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Centre" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Doctor", doctorSchema);
