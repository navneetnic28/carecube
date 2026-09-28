const mongoose = require("mongoose");

const centreSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, lowercase: true, trim: true, required: true },
    phone: { type: String, unique: true, sparse: true, trim: true },
    password: { type: String, required: true, select: false },

    address: { type: String, default: "" },
    city: { type: String, default: "", trim: true },
    type: { type: String, default: "clinic" }, // clinic / hospital

    openingHours: { type: String, default: "" },
    photos: [{ type: String }],
    facilities: [{ type: String }],

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

    // Admin can disable an already-verified centre without losing verification history.
    isDisabled: { type: Boolean, default: false },
    disabledReason: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Centre", centreSchema);
