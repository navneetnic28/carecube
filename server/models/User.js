const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
    phone: { type: String, unique: true, sparse: true, trim: true },
    password: { type: String, select: false },
    role: {
      type: String,
      enum: ["patient", "admin"],
      default: "patient",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
