const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema(
  {
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    centreId: { type: mongoose.Schema.Types.ObjectId, ref: "Centre", required: true },
    day: {
      type: String,
      enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      required: true,
    },
    startTime: { type: String, required: true }, // "10:00"
    endTime: { type: String, required: true }, // "13:00"
    slotDuration: { type: Number, default: 15 }, // minutes
  },
  { timestamps: true }
);

module.exports = mongoose.model("Schedule", scheduleSchema);
