const bcrypt = require("bcryptjs");
const Doctor = require("../models/Doctor");
const User = require("../models/User");
const Appointment = require("../models/Appointment");
const CentreDoctorRequest = require("../models/CentreDoctorRequest");
const Schedule = require("../models/Schedule");
const LiveStatus = require("../models/LiveStatus");
const { notifyAppointmentStatusChange } = require("../utils/notify");
const { startOfDay, endOfDay } = require("../utils/dateHelpers");

// GET /api/centre/dashboard
const getDashboard = async (req, res) => {
  try {
    const centreId = req.user.centreId;
    const today = new Date();

    const [doctors, appointments, waiting, completed] = await Promise.all([
      Doctor.countDocuments({ chambers: centreId }),
      Appointment.countDocuments({
        centreId,
        appointmentDate: { $gte: startOfDay(today), $lte: endOfDay(today) },
      }),
      Appointment.countDocuments({
        centreId,
        appointmentDate: { $gte: startOfDay(today), $lte: endOfDay(today) },
        status: { $in: ["waiting", "in_queue"] },
      }),
      Appointment.countDocuments({
        centreId,
        appointmentDate: { $gte: startOfDay(today), $lte: endOfDay(today) },
        status: "completed",
      }),
    ]);

    res.json({ success: true, doctors, appointments, waiting, completed });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/centre/doctors
const getMyDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({ chambers: req.user.centreId }).select("-password");
    res.json({ success: true, doctors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/centre/join-requests — doctors asking to join this centre
const getJoinRequests = async (req, res) => {
  try {
    const requests = await CentreDoctorRequest.find({
      centreId: req.user.centreId,
      status: "pending",
      initiatedBy: "doctor",
    }).populate("doctorId", "name specialization qualification");
    res.json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/centre/join-requests/:id/:action  (accept | reject)
const respondJoinRequest = async (req, res) => {
  try {
    const { id, action } = req.params;
    if (!["accept", "reject"].includes(action)) {
      return res.status(400).json({ success: false, message: "Invalid action" });
    }
    const request = await CentreDoctorRequest.findOne({
      _id: id,
      centreId: req.user.centreId,
      status: "pending",
      initiatedBy: "doctor",
    });
    if (!request) return res.status(404).json({ success: false, message: "Request not found" });

    request.status = action === "accept" ? "accepted" : "rejected";
    await request.save();
    if (action === "accept") {
      await Doctor.findByIdAndUpdate(request.doctorId, { $addToSet: { chambers: request.centreId } });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/centre/doctors/search?query=
// Find doctors by name / specialization to send an association request (no IDs needed)
const searchDoctorsToAdd = async (req, res) => {
  try {
    const centreId = req.user.centreId;
    const { query } = req.query;
    const filter = { isDisabled: { $ne: true } };
    if (query && query.trim()) {
      const rx = { $regex: query.trim(), $options: "i" };
      filter.$or = [{ name: rx }, { specialization: rx }];
    }

    const doctors = await Doctor.find(filter)
      .select("name specialization qualification experience photoUrl chambers verificationStatus")
      .sort({ createdAt: -1 })
      .limit(20);

    const pending = await CentreDoctorRequest.find({
      centreId,
      status: "pending",
      doctorId: { $in: doctors.map((d) => d._id) },
    });
    const pendingMap = Object.fromEntries(pending.map((p) => [p.doctorId.toString(), p.initiatedBy]));

    res.json({
      success: true,
      doctors: doctors.map((d) => ({
        _id: d._id,
        name: d.name,
        specialization: d.specialization,
        qualification: d.qualification,
        experience: d.experience,
        photoUrl: d.photoUrl,
        verificationStatus: d.verificationStatus,
        associated: d.chambers.some((c) => c.toString() === centreId.toString()),
        requested: pendingMap[d._id.toString()] === "centre",
        theyRequested: pendingMap[d._id.toString()] === "doctor",
      })),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/centre/doctors/request
// body: { doctorId }
const requestDoctor = async (req, res) => {
  try {
    const centreId = req.user.centreId;
    const { doctorId } = req.body;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    const alreadyConnected = doctor.chambers.some((c) => c.toString() === centreId.toString());
    if (alreadyConnected) {
      return res.status(400).json({ success: false, message: "Doctor already associated" });
    }

    const existingRequest = await CentreDoctorRequest.findOne({
      centreId,
      doctorId,
      status: "pending",
    });
    if (existingRequest) {
      return res.status(400).json({ success: false, message: "Request already sent" });
    }

    const request = await CentreDoctorRequest.create({ centreId, doctorId, status: "pending" });

    res.status(201).json({ success: true, request });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/centre/queue
const getCentreQueue = async (req, res) => {
  try {
    const centreId = req.user.centreId;
    const today = new Date();

    const appointments = await Appointment.find({
      centreId,
      appointmentDate: { $gte: startOfDay(today), $lte: endOfDay(today) },
    })
      .populate("doctorId", "name specialization")
      .populate("patientId", "name phone")
      .sort({ tokenNumber: 1 });

    res.json({ success: true, appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/centre/walk-in
// body: { name, phone, doctorId, reason, paymentMethod, amount }
const createWalkIn = async (req, res) => {
  try {
    const { name, phone, doctorId, reason, paymentMethod, amount } = req.body;
    const centreId = req.user.centreId;

    if (!name || !phone || !doctorId) {
      return res.status(400).json({
        success: false,
        message: "name, phone and doctorId are required",
      });
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

// PATCH /api/centre/appointments/:id/payment
// body: { paymentStatus }
const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    const allowed = ["pending", "paid", "unpaid", "cash", "refunded"];
    if (!allowed.includes(paymentStatus)) {
      return res.status(400).json({ success: false, message: "Invalid payment status" });
    }

    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.id, centreId: req.user.centreId },
      { paymentStatus },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    res.json({ success: true, appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/centre/appointments?date=&doctorId=&status=&source=
const getCentreAppointments = async (req, res) => {
  try {
    const centreId = req.user.centreId;
    const { date, doctorId, status, source } = req.query;

    const filter = { centreId };

    if (date) {
      const d = new Date(date);
      filter.appointmentDate = { $gte: startOfDay(d), $lte: endOfDay(d) };
    }
    if (doctorId) filter.doctorId = doctorId;
    if (status) filter.status = status;
    if (source) filter.source = source;

    const appointments = await Appointment.find(filter)
      .populate("doctorId", "name specialization")
      .populate("patientId", "name phone")
      .sort({ appointmentDate: -1, tokenNumber: 1 });

    res.json({ success: true, appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/centre/schedule?doctorId=
const getCentreSchedule = async (req, res) => {
  try {
    const centreId = req.user.centreId;
    const filter = { centreId };
    if (req.query.doctorId) filter.doctorId = req.query.doctorId;

    const schedule = await Schedule.find(filter).populate("doctorId", "name specialization");
    res.json({ success: true, schedule });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/centre/status?date=YYYY-MM-DD
// Live availability of all doctors associated with this centre for a given day (defaults today)
const getCentreStatuses = async (req, res) => {
  try {
    const centreId = req.user.centreId;
    const date = startOfDay(req.query.date ? new Date(req.query.date) : new Date());

    const statuses = await LiveStatus.find({ centreId, date }).populate(
      "doctorId",
      "name specialization"
    );

    res.json({ success: true, date, statuses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/centre/status
// body: { doctorId, date, status, delayMinutes, note }
// Centre owner updates today's live availability (🟢/🟡/🔴) for one of its doctors.
const setDoctorStatus = async (req, res) => {
  try {
    const centreId = req.user.centreId;
    const { doctorId, date, status, delayMinutes, note } = req.body;

    if (!doctorId || !status) {
      return res.status(400).json({ success: false, message: "doctorId and status are required" });
    }

    const doctor = await Doctor.findById(doctorId);
    const isAssociated = doctor && doctor.chambers.some((c) => c.toString() === centreId.toString());
    if (!isAssociated) {
      return res.status(403).json({ success: false, message: "Doctor not associated with your centre" });
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
        updatedByRole: "centre_owner",
      },
      { new: true, upsert: true }
    );

    res.json({ success: true, status: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/centre/appointments/:id/status
// body: { status } — centre can move a patient between waiting/in_queue, cancel it,
// or mark a no-show. Consulting/completed remain the doctor's own action.
const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["waiting", "in_queue", "cancelled", "no_show"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status for centre to set" });
    }

    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.id, centreId: req.user.centreId },
      { status },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    await notifyAppointmentStatusChange(appointment, status);

    res.json({ success: true, appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/centre/profile
const getMyProfile = async (req, res) => {
  try {
    const centre = await Centre.findById(req.user.centreId);
    res.json({ success: true, centre });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/centre/profile
// body: { name, address, city, openingHours, facilities: [], photos: [] }
// photos entries are data: URIs (base64) or external image URLs, sent as-is.
const updateMyProfile = async (req, res) => {
  try {
    const { name, address, city, openingHours, facilities, photos } = req.body;

    const update = {};
    if (name !== undefined && name.trim()) update.name = name.trim();
    if (address !== undefined) update.address = address;
    if (city !== undefined) update.city = city;
    if (openingHours !== undefined) update.openingHours = openingHours;
    if (Array.isArray(facilities)) update.facilities = facilities;
    if (Array.isArray(photos)) update.photos = photos.slice(0, 6);

    const centre = await Centre.findByIdAndUpdate(req.user.centreId, update, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, centre });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  searchDoctorsToAdd,
  getJoinRequests,
  respondJoinRequest,
  getDashboard,
  getMyDoctors,
  requestDoctor,
  getCentreQueue,
  createWalkIn,
  updatePaymentStatus,
  updateAppointmentStatus,
  getCentreAppointments,
  getCentreSchedule,
  getCentreStatuses,
  setDoctorStatus,
  getMyProfile,
  updateMyProfile,
};
