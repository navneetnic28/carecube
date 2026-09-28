const Schedule = require("../models/Schedule");
const Doctor = require("../models/Doctor");
const CentreDoctorRequest = require("../models/CentreDoctorRequest");
const LiveStatus = require("../models/LiveStatus");
const Appointment = require("../models/Appointment");
const Centre = require("../models/Centre");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { startOfDay, endOfDay } = require("../utils/dateHelpers");

// GET /api/doctor/schedule
const getMySchedule = async (req, res) => {
  try {
    const schedule = await Schedule.find({ doctorId: req.user.id }).populate(
      "centreId",
      "name address"
    );
    res.json({ success: true, schedule });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/doctor/schedule
// body: { centreId, day, startTime, endTime, slotDuration }
const addSchedule = async (req, res) => {
  try {
    const { centreId, day, startTime, endTime, slotDuration } = req.body;

    if (!centreId || !day || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: "centreId, day, startTime and endTime are required",
      });
    }

    if (startTime >= endTime) {
      return res.status(400).json({
        success: false,
        message: "End time must be after start time",
      });
    }

    // Doctor must be associated with this centre
    const doctor = await Doctor.findById(req.user.id);
    const isAssociated = doctor.chambers.some((c) => c.toString() === centreId);

    if (!isAssociated) {
      return res.status(403).json({
        success: false,
        message: "You are not associated with this centre",
      });
    }

    const schedule = await Schedule.create({
      doctorId: req.user.id,
      centreId,
      day,
      startTime,
      endTime,
      slotDuration: slotDuration || 15,
    });

    res.status(201).json({ success: true, schedule });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/doctor/schedule/:id
const deleteSchedule = async (req, res) => {
  try {
    await Schedule.findOneAndDelete({ _id: req.params.id, doctorId: req.user.id });
    res.json({ success: true, message: "Schedule removed" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/doctor/requests
const getMyRequests = async (req, res) => {
  try {
    const requests = await CentreDoctorRequest.find({
      doctorId: req.user.id,
      status: "pending",
      initiatedBy: { $ne: "doctor" },
    }).populate("centreId", "name address type");

    res.json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/doctor/requests/:id/accept
const acceptRequest = async (req, res) => {
  try {
    const request = await CentreDoctorRequest.findOne({
      _id: req.params.id,
      doctorId: req.user.id,
      status: "pending",
    });

    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    request.status = "accepted";
    await request.save();

    await Doctor.findByIdAndUpdate(req.user.id, {
      $addToSet: { chambers: request.centreId },
    });

    res.json({ success: true, message: "Association accepted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/doctor/requests/:id/reject
const rejectRequest = async (req, res) => {
  try {
    const request = await CentreDoctorRequest.findOneAndUpdate(
      { _id: req.params.id, doctorId: req.user.id, status: "pending" },
      { status: "rejected" },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    res.json({ success: true, message: "Association rejected" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/doctor/status?date=YYYY-MM-DD
// This doctor's own live availability across all their chambers for a given day
const getMyStatus = async (req, res) => {
  try {
    const date = startOfDay(req.query.date ? new Date(req.query.date) : new Date());
    const statuses = await LiveStatus.find({ doctorId: req.user.id, date }).populate(
      "centreId",
      "name address"
    );
    res.json({ success: true, date, statuses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/doctor/status
// body: { centreId, date, status, delayMinutes, note }
// Doctor self-updates availability at one chamber: 🟢 available / 🟡 delayed / 🔴 unavailable / holiday
const setMyStatus = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const { centreId, date, status, delayMinutes, note } = req.body;

    if (!centreId || !status) {
      return res.status(400).json({ success: false, message: "centreId and status are required" });
    }

    const doctor = await Doctor.findById(doctorId);
    const isAssociated = doctor.chambers.some((c) => c.toString() === centreId);
    if (!isAssociated) {
      return res.status(403).json({ success: false, message: "You are not associated with this centre" });
    }

    const day = startOfDay(date ? new Date(date) : new Date());

    const updated = await LiveStatus.findOneAndUpdate(
      { doctorId, centreId, date: day },
      {
        doctorId,
        centreId,
        date: day,
        status,
        delayMinutes: delayMinutes || 0,
        note: note || "",
        updatedByRole: "doctor",
      },
      { new: true, upsert: true }
    );

    res.json({ success: true, status: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/doctor/profile
// The logged-in doctor's own full profile (for the edit form)
const getMyProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.user.id)
      .select("-password")
      .populate("chambers", "name address city");
    res.json({ success: true, doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/doctor/profile
// body: { specialization, qualification, experience, bio, photoUrl }
// photoUrl is a data: URI (base64) or an external image URL — sent as-is from the client.
const updateMyProfile = async (req, res) => {
  try {
    const {
      specialization,
      qualification,
      experience,
      bio,
      photoUrl,
      name,
      phone,
      consultationFee,
      education,
      specializationTags,
    } = req.body;

    const update = {};
    if (specialization !== undefined) update.specialization = specialization;
    if (qualification !== undefined) update.qualification = qualification;
    if (experience !== undefined) update.experience = experience;
    if (bio !== undefined) update.bio = bio;
    if (photoUrl !== undefined) update.photoUrl = photoUrl;
    if (name !== undefined && name.trim()) update.name = name.trim();
    if (phone !== undefined) update.phone = phone;
    if (consultationFee !== undefined) update.consultationFee = Number(consultationFee) || 0;
    if (education !== undefined) update.education = education;
    if (Array.isArray(specializationTags)) update.specializationTags = specializationTags;

    const doctor = await Doctor.findByIdAndUpdate(req.user.id, update, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.json({ success: true, doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/doctor/walk-in
// body: { name, phone, centreId, reason, paymentMethod, amount }
// Lets a doctor book an appointment directly for a patient who is present in
// person (or called in) but doesn't have/use the app — mirrors the centre's walk-in flow.
const createWalkIn = async (req, res) => {
  try {
    const { name, phone, centreId, reason, paymentMethod, amount } = req.body;
    const doctorId = req.user.id;

    if (!name || !phone || !centreId) {
      return res.status(400).json({
        success: false,
        message: "name, phone and centreId are required",
      });
    }

    const doctor = await Doctor.findById(doctorId);
    const isAssociated = doctor.chambers.some((c) => c.toString() === centreId);
    if (!isAssociated) {
      return res.status(403).json({ success: false, message: "You are not associated with this centre" });
    }

    let patient = await User.findOne({ phone, role: "patient" });
    if (!patient) {
      const randomPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);
      patient = await User.create({ name, phone, password: hashedPassword, role: "patient" });
    }

    const today = new Date();

    const last = await Appointment.findOne({
      centreId,
      doctorId,
      appointmentDate: { $gte: startOfDay(today), $lte: endOfDay(today) },
    }).sort({ tokenNumber: -1 });

    const tokenNumber = last ? last.tokenNumber + 1 : 1;

    const appointment = await Appointment.create({
      patientId: patient._id,
      doctorId,
      centreId,
      appointmentDate: today,
      tokenNumber,
      reason: reason || "",
      source: "walk_in",
      status: "waiting",
      paymentMethod: paymentMethod || "cash",
      amount: amount || 0,
      paymentStatus: paymentMethod === "cash" || !paymentMethod ? "cash" : "pending",
    });

    res.status(201).json({ success: true, appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/doctor/centres — centres this doctor can ask to join
const listJoinableCentres = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.user.id);
    const pending = await CentreDoctorRequest.find({ doctorId: req.user.id, status: "pending" });
    const pendingIds = pending.map((p) => p.centreId.toString());
    const centres = await Centre.find({
      _id: { $nin: doctor.chambers },
      isDisabled: { $ne: true },
    }).select("name address city type");

    res.json({
      success: true,
      centres: centres.map((c) => ({ ...c.toObject(), requested: pendingIds.includes(c._id.toString()) })),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/doctor/join-request  body: { centreId }
const requestToJoinCentre = async (req, res) => {
  try {
    const { centreId } = req.body;
    const centre = await Centre.findById(centreId);
    if (!centre) return res.status(404).json({ success: false, message: "Centre not found" });

    const doctor = await Doctor.findById(req.user.id);
    if (doctor.chambers.some((c) => c.toString() === centreId)) {
      return res.status(400).json({ success: false, message: "Already associated" });
    }
    const existing = await CentreDoctorRequest.findOne({ centreId, doctorId: req.user.id, status: "pending" });
    if (existing) return res.status(400).json({ success: false, message: "Request already sent" });

    const request = await CentreDoctorRequest.create({
      centreId,
      doctorId: req.user.id,
      initiatedBy: "doctor",
    });
    res.status(201).json({ success: true, request });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  listJoinableCentres,
  requestToJoinCentre,
  getMySchedule,
  addSchedule,
  deleteSchedule,
  getMyRequests,
  acceptRequest,
  rejectRequest,
  getMyStatus,
  setMyStatus,
  getMyProfile,
  updateMyProfile,
  createWalkIn,
};
