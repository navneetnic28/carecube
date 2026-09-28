const User = require("../models/User");
const Doctor = require("../models/Doctor");
const Centre = require("../models/Centre");
const Appointment = require("../models/Appointment");
const Report = require("../models/Report");
const { startOfDay, endOfDay } = require("../utils/dateHelpers");

// GET /api/admin/dashboard
const getDashboard = async (req, res) => {
  try {
    const today = new Date();

    const [
      users,
      doctors,
      centres,
      appointments,
      pendingDoctors,
      pendingCentres,
      activeDoctors,
      activeCentres,
      todaysAppointments,
      openReports,
    ] = await Promise.all([
      User.countDocuments(),
      Doctor.countDocuments(),
      Centre.countDocuments(),
      Appointment.countDocuments(),
      Doctor.countDocuments({ verificationStatus: "pending" }),
      Centre.countDocuments({ verificationStatus: "pending" }),
      Doctor.countDocuments({ verificationStatus: "verified", isDisabled: { $ne: true } }),
      Centre.countDocuments({ verificationStatus: "verified", isDisabled: { $ne: true } }),
      Appointment.countDocuments({
        appointmentDate: { $gte: startOfDay(today), $lte: endOfDay(today) },
      }),
      Report.countDocuments({ status: "open" }),
    ]);

    res.json({
      success: true,
      users,
      doctors,
      centres,
      appointments,
      pendingDoctors,
      pendingCentres,
      activeDoctors,
      activeCentres,
      todaysAppointments,
      openReports,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/admin/doctors/pending
const getPendingDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({ verificationStatus: "pending" }).select("-password");
    res.json({ success: true, doctors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/admin/doctors/:id/verify
const verifyDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { verificationStatus: "verified", verifiedAt: new Date(), verifiedBy: req.user.id },
      { new: true }
    );

    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    res.json({ success: true, message: "Doctor verified successfully", doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/admin/doctors/:id/reject
const rejectDoctor = async (req, res) => {
  try {
    const { reason } = req.body;

    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      {
        verificationStatus: "rejected",
        rejectionReason: reason || "",
        rejectedAt: new Date(),
        rejectedBy: req.user.id,
      },
      { new: true }
    );

    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    res.json({ success: true, message: "Doctor rejected", doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/admin/centres/pending
const getPendingCentres = async (req, res) => {
  try {
    const centres = await Centre.find({ verificationStatus: "pending" }).select("-password");
    res.json({ success: true, centres });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/admin/centres/:id/verify
const verifyCentre = async (req, res) => {
  try {
    const centre = await Centre.findByIdAndUpdate(
      req.params.id,
      { verificationStatus: "verified", verifiedAt: new Date(), verifiedBy: req.user.id },
      { new: true }
    );

    if (!centre) {
      return res.status(404).json({ success: false, message: "Centre not found" });
    }

    res.json({ success: true, message: "Centre verified successfully", centre });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/admin/centres/:id/reject
const rejectCentre = async (req, res) => {
  try {
    const { reason } = req.body;

    const centre = await Centre.findByIdAndUpdate(
      req.params.id,
      {
        verificationStatus: "rejected",
        rejectionReason: reason || "",
        rejectedAt: new Date(),
        rejectedBy: req.user.id,
      },
      { new: true }
    );

    if (!centre) {
      return res.status(404).json({ success: false, message: "Centre not found" });
    }

    res.json({ success: true, message: "Centre rejected", centre });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/admin/users?role=&status=&page=&limit=
const getUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (role) filter.role = role;

    const users = await User.find(filter)
      .select("-password")
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(filter);

    res.json({ success: true, users, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/admin/appointments?date=&status=
const getAppointments = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const appointments = await Appointment.find(filter)
      .populate("doctorId", "name")
      .populate("centreId", "name")
      .populate("patientId", "name phone")
      .sort({ appointmentDate: -1 })
      .limit(100);

    res.json({ success: true, appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/admin/doctors?status=&query=
// Full doctor list (not just pending) for management — Section 13 "View doctor details"
const getAllDoctors = async (req, res) => {
  try {
    const { status, query } = req.query;
    const filter = {};
    if (status) filter.verificationStatus = status;
    if (query) filter.name = { $regex: query, $options: "i" };

    const doctors = await Doctor.find(filter).select("-password").sort({ createdAt: -1 });
    res.json({ success: true, doctors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/admin/doctors/:id
const getDoctorDetail = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .select("-password")
      .populate("chambers", "name address city");
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }
    res.json({ success: true, doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/admin/doctors/:id/disable
// body: { reason }
const disableDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { isDisabled: true, disabledReason: req.body.reason || "" },
      { new: true }
    );
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }
    res.json({ success: true, message: "Doctor account disabled", doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/admin/doctors/:id/enable
const enableDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { isDisabled: false, disabledReason: "" },
      { new: true }
    );
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }
    res.json({ success: true, message: "Doctor account re-enabled", doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/admin/centres?status=&query=
const getAllCentres = async (req, res) => {
  try {
    const { status, query } = req.query;
    const filter = {};
    if (status) filter.verificationStatus = status;
    if (query) filter.name = { $regex: query, $options: "i" };

    const centres = await Centre.find(filter).select("-password").sort({ createdAt: -1 });
    res.json({ success: true, centres });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/admin/centres/:id
const getCentreDetail = async (req, res) => {
  try {
    const centre = await Centre.findById(req.params.id).select("-password");
    if (!centre) {
      return res.status(404).json({ success: false, message: "Centre not found" });
    }
    res.json({ success: true, centre });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/admin/centres/:id/disable
const disableCentre = async (req, res) => {
  try {
    const centre = await Centre.findByIdAndUpdate(
      req.params.id,
      { isDisabled: true, disabledReason: req.body.reason || "" },
      { new: true }
    );
    if (!centre) {
      return res.status(404).json({ success: false, message: "Centre not found" });
    }
    res.json({ success: true, message: "Centre account disabled", centre });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/admin/centres/:id/enable
const enableCentre = async (req, res) => {
  try {
    const centre = await Centre.findByIdAndUpdate(
      req.params.id,
      { isDisabled: false, disabledReason: "" },
      { new: true }
    );
    if (!centre) {
      return res.status(404).json({ success: false, message: "Centre not found" });
    }
    res.json({ success: true, message: "Centre account re-enabled", centre });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/admin/reports?status=
const getReports = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const reports = await Report.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/admin/reports/:id/resolve
// body: { resolutionNote }
const resolveReport = async (req, res) => {
  try {
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      {
        status: "resolved",
        resolutionNote: req.body.resolutionNote || "",
        resolvedAt: new Date(),
        resolvedBy: req.user.id,
      },
      { new: true }
    );
    if (!report) {
      return res.status(404).json({ success: false, message: "Report not found" });
    }
    res.json({ success: true, report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getDashboard,
  getPendingDoctors,
  verifyDoctor,
  rejectDoctor,
  getPendingCentres,
  verifyCentre,
  rejectCentre,
  getUsers,
  getAppointments,
  getAllDoctors,
  getDoctorDetail,
  disableDoctor,
  enableDoctor,
  getAllCentres,
  getCentreDetail,
  disableCentre,
  enableCentre,
  getReports,
  resolveReport,
};
