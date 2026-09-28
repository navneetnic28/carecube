const Doctor = require("../models/Doctor");
const Centre = require("../models/Centre");
const Appointment = require("../models/Appointment");
const Review = require("../models/Review");
const { notifyAppointmentStatusChange } = require("../utils/notify");
const { startOfDay, endOfDay } = require("../utils/dateHelpers");

// GET /api/doctors/search?query=...&specialization=...&city=...
// Public search, only verified doctors
const searchDoctors = async (req, res) => {
  try {
    const { query, specialization, city } = req.query;

    const filter = { isDisabled: { $ne: true } };

    if (specialization) filter.specialization = specialization;
    if (query) filter.name = { $regex: query, $options: "i" };

    if (city) {
      const centresInCity = await Centre.find({
        city: { $regex: city, $options: "i" },
        isDisabled: { $ne: true },
      }).select("_id");
      filter.chambers = { $in: centresInCity.map((c) => c._id) };
    }

    const doctors = await Doctor.find(filter)
      .select("name specialization qualification experience photoUrl chambers consultationFee verificationStatus")
      .populate("chambers", "name address city");

    res.json({ success: true, doctors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/appointments/book
// body: { doctorId, centreId, appointmentDate, reason }
const bookAppointment = async (req, res) => {
  try {
    const patientId = req.user.id;
    const { doctorId, centreId, appointmentDate, reason, paymentMethod, amount, patientDetails } = req.body;

    if (!doctorId || !centreId || !appointmentDate) {
      return res.status(400).json({
        success: false,
        message: "doctorId, centreId and appointmentDate are required",
      });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor || doctor.isDisabled) {
      return res.status(404).json({ success: false, message: "Doctor not available" });
    }

    if (!doctor.chambers.some((c) => c.toString() === centreId.toString())) {
      return res.status(400).json({
        success: false,
        message: "This doctor is not associated with that centre yet",
      });
    }

    const date = new Date(appointmentDate);

    const last = await Appointment.findOne({
      centreId,
      doctorId,
      appointmentDate: { $gte: startOfDay(date), $lte: endOfDay(date) },
    }).sort({ tokenNumber: -1 });

    const tokenNumber = last ? last.tokenNumber + 1 : 1;

    const appointment = await Appointment.create({
      patientId,
      doctorId,
      centreId,
      appointmentDate: date,
      tokenNumber,
      reason: reason || "",
      patientDetails: {
        name: patientDetails?.name || req.user.name || "",
        phone: patientDetails?.phone || "",
        age: patientDetails?.age ? Number(patientDetails.age) : undefined,
        gender: patientDetails?.gender || "",
      },
      source: "online",
      status: "waiting",
      paymentMethod: paymentMethod || "none",
      amount: amount || 0,
      paymentStatus: paymentMethod === "online" ? "pending" : paymentMethod === "cash" ? "cash" : "unpaid",
    });

    await appointment.populate([
      { path: "doctorId", select: "name specialization" },
      { path: "centreId", select: "name address city" },
    ]);

    res.status(201).json({ success: true, appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/appointments/my
// Patient's own appointments, newest first
const myAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.user.id })
      .populate("doctorId", "name specialization")
      .populate("centreId", "name address")
      .sort({ appointmentDate: -1 });

    res.json({ success: true, appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/appointments/:id/queue-status
// Live queue position for a patient's appointment
const queueStatus = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    const currentConsulting = await Appointment.findOne({
      doctorId: appointment.doctorId,
      centreId: appointment.centreId,
      appointmentDate: {
        $gte: startOfDay(appointment.appointmentDate),
        $lte: endOfDay(appointment.appointmentDate),
      },
      status: "consulting",
    });

    const patientsAhead = await Appointment.countDocuments({
      doctorId: appointment.doctorId,
      centreId: appointment.centreId,
      appointmentDate: {
        $gte: startOfDay(appointment.appointmentDate),
        $lte: endOfDay(appointment.appointmentDate),
      },
      status: { $in: ["waiting", "in_queue"] },
      tokenNumber: { $lt: appointment.tokenNumber },
    });

    res.json({
      success: true,
      yourToken: appointment.tokenNumber,
      currentToken: currentConsulting ? currentConsulting.tokenNumber : null,
      patientsAhead,
      status: appointment.status,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/appointments/doctor
// Doctor's today's appointments
const getDoctorAppointments = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const today = new Date();

    const appointments = await Appointment.find({
      doctorId,
      appointmentDate: { $gte: startOfDay(today), $lte: endOfDay(today) },
    })
      .populate("patientId", "name phone")
      .populate("centreId", "name")
      .sort({ tokenNumber: 1 });

    res.json({ success: true, appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/appointments/doctor/call-next
// body: { centreId, date }
const callNext = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const { centreId, date } = req.body;
    const targetDate = date ? new Date(date) : new Date();

    // Mark any currently-consulting patient as completed is NOT automatic;
    // caller should complete the current one first. We just find next waiting.
    const alreadyConsulting = await Appointment.findOne({
      doctorId,
      centreId,
      appointmentDate: { $gte: startOfDay(targetDate), $lte: endOfDay(targetDate) },
      status: "consulting",
    });

    if (alreadyConsulting) {
      return res.status(400).json({
        success: false,
        message: "Please complete the current consultation before calling next",
      });
    }

    const next = await Appointment.findOne({
      doctorId,
      centreId,
      appointmentDate: { $gte: startOfDay(targetDate), $lte: endOfDay(targetDate) },
      status: { $in: ["waiting", "in_queue"] },
    }).sort({ tokenNumber: 1 });

    if (!next) {
      return res.status(404).json({ success: false, message: "No waiting patients" });
    }

    next.status = "consulting";
    await next.save();

    await notifyAppointmentStatusChange(next, "consulting");

    res.json({ success: true, appointment: next });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/appointments/doctor/:id/complete
const completeAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.id, doctorId: req.user.id },
      { status: "completed" },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    await notifyAppointmentStatusChange(appointment, "completed");

    res.json({ success: true, appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/appointments/doctor/:id/no-show
// Doctor marks a waiting/in-queue patient who never showed up.
const markNoShow = async (req, res) => {
  try {
    const appointment = await Appointment.findOneAndUpdate(
      {
        _id: req.params.id,
        doctorId: req.user.id,
        status: { $in: ["waiting", "in_queue"] },
      },
      { status: "no_show" },
      { new: true }
    );

    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found or already handled" });
    }

    res.json({ success: true, appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/appointments/:id/review
// body: { rating, comment } — patient reviews their own completed appointment (once)
const submitReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const stars = Number(rating);

    if (!stars || stars < 1 || stars > 5) {
      return res.status(400).json({ success: false, message: "Rating must be between 1 and 5" });
    }

    const appointment = await Appointment.findOne({
      _id: req.params.id,
      patientId: req.user.id,
    });

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    if (appointment.status !== "completed") {
      return res
        .status(400)
        .json({ success: false, message: "You can only review a completed appointment" });
    }

    const existing = await Review.findOne({ appointmentId: appointment._id });
    if (existing) {
      return res.status(400).json({ success: false, message: "You already reviewed this visit" });
    }

    const review = await Review.create({
      doctorId: appointment.doctorId,
      patientId: req.user.id,
      appointmentId: appointment._id,
      rating: stars,
      comment: comment || "",
    });

    res.status(201).json({ success: true, review });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "You already reviewed this visit" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  searchDoctors,
  bookAppointment,
  myAppointments,
  queueStatus,
  getDoctorAppointments,
  callNext,
  completeAppointment,
  markNoShow,
  submitReview,
};
