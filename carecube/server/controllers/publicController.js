const Centre = require("../models/Centre");
const Doctor = require("../models/Doctor");
const Schedule = require("../models/Schedule");
const LiveStatus = require("../models/LiveStatus");
const Review = require("../models/Review");
const { startOfDay } = require("../utils/dateHelpers");

// Computes { avgRating, reviewCount } for a doctor from real patient reviews.
async function getRatingSummary(doctorId) {
  const result = await Review.aggregate([
    { $match: { doctorId } },
    { $group: { _id: "$doctorId", avg: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);
  if (result.length === 0) return { avgRating: null, reviewCount: 0 };
  return { avgRating: Math.round(result[0].avg * 10) / 10, reviewCount: result[0].count };
}

// GET /api/centres?query=&city=
// Explore/search participating centres — used by the public Explore page.
const exploreCentres = async (req, res) => {
  try {
    const { query, city } = req.query;
    const filter = { isDisabled: { $ne: true } };

    if (query) filter.name = { $regex: query, $options: "i" };
    if (city) filter.city = { $regex: city, $options: "i" };

    const centres = await Centre.find(filter).select(
      "name address city type openingHours photos facilities verificationStatus"
    );

    res.json({ success: true, centres });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/centres/:id
// Public centre profile page: centre details + its doctors + today's live status.
// This is also what a centre's QR code opens.
const getCentrePublic = async (req, res) => {
  try {
    const centre = await Centre.findOne({
      _id: req.params.id,
      isDisabled: { $ne: true },
    }).select("name address city type openingHours photos facilities verificationStatus");

    if (!centre) {
      return res.status(404).json({ success: false, message: "Centre not found" });
    }

    const doctors = await Doctor.find({
      chambers: centre._id,
      isDisabled: { $ne: true },
    }).select("name specialization qualification experience photoUrl consultationFee verificationStatus");

    const today = startOfDay(new Date());

    const [schedules, statuses] = await Promise.all([
      Schedule.find({ centreId: centre._id }).select("doctorId day startTime endTime slotDuration"),
      LiveStatus.find({ centreId: centre._id, date: today }),
    ]);

    const doctorsWithDetails = doctors.map((doctor) => {
      const doctorSchedule = schedules.filter(
        (s) => s.doctorId.toString() === doctor._id.toString()
      );
      const todayStatus = statuses.find(
        (s) => s.doctorId.toString() === doctor._id.toString()
      );

      return {
        ...doctor.toObject(),
        schedule: doctorSchedule,
        todayStatus: todayStatus
          ? {
              status: todayStatus.status,
              delayMinutes: todayStatus.delayMinutes,
              note: todayStatus.note,
            }
          : { status: "available", delayMinutes: 0, note: "" },
      };
    });

    res.json({ success: true, centre, doctors: doctorsWithDetails });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/doctors/:id
// Public doctor profile page: doctor details + all associated chambers + today's live status per chamber.
const getDoctorPublic = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({
      _id: req.params.id,
      isDisabled: { $ne: true },
    })
      .select(
        "name specialization qualification experience bio photoUrl chambers consultationFee education specializationTags verificationStatus"
      )
      .populate("chambers", "name address city openingHours");

    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    const today = startOfDay(new Date());

    const [schedules, statuses, ratingSummary, reviews] = await Promise.all([
      Schedule.find({ doctorId: doctor._id }).select("centreId day startTime endTime slotDuration"),
      LiveStatus.find({ doctorId: doctor._id, date: today }),
      getRatingSummary(doctor._id),
      Review.find({ doctorId: doctor._id })
        .sort({ createdAt: -1 })
        .limit(10)
        .populate("patientId", "name"),
    ]);

    const chambersWithDetails = doctor.chambers.map((centre) => {
      const centreSchedule = schedules.filter(
        (s) => s.centreId.toString() === centre._id.toString()
      );
      const todayStatus = statuses.find(
        (s) => s.centreId.toString() === centre._id.toString()
      );

      return {
        centre,
        schedule: centreSchedule,
        todayStatus: todayStatus
          ? {
              status: todayStatus.status,
              delayMinutes: todayStatus.delayMinutes,
              note: todayStatus.note,
            }
          : { status: "available", delayMinutes: 0, note: "" },
      };
    });

    res.json({
      success: true,
      doctor: {
        _id: doctor._id,
        name: doctor.name,
        specialization: doctor.specialization,
        qualification: doctor.qualification,
        experience: doctor.experience,
        bio: doctor.bio,
        photoUrl: doctor.photoUrl,
        consultationFee: doctor.consultationFee,
        education: doctor.education,
        specializationTags: doctor.specializationTags,
        verificationStatus: doctor.verificationStatus,
        avgRating: ratingSummary.avgRating,
        reviewCount: ratingSummary.reviewCount,
      },
      chambers: chambersWithDetails,
      reviews: reviews.map((r) => ({
        _id: r._id,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt,
        patientName: r.patientId?.name || "Patient",
      })),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/doctors?limit=8
// Public list of verified doctors — powers the homepage "Meet Our Doctors" section
const getAllDoctorsPublic = async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 8, 50);
    const doctors = await Doctor.find({ isDisabled: { $ne: true } })
      .select("name specialization qualification experience photoUrl chambers consultationFee")
      .populate("chambers", "name city")
      .sort({ createdAt: -1 })
      .limit(limit);

    const ratings = await Review.aggregate([
      { $match: { doctorId: { $in: doctors.map((d) => d._id) } } },
      { $group: { _id: "$doctorId", avg: { $avg: "$rating" }, count: { $sum: 1 } } },
    ]);
    const ratingMap = Object.fromEntries(
      ratings.map((r) => [r._id.toString(), { avgRating: Math.round(r.avg * 10) / 10, reviewCount: r.count }])
    );

    const doctorsWithRatings = doctors.map((d) => ({
      ...d.toObject(),
      avgRating: ratingMap[d._id.toString()]?.avgRating || null,
      reviewCount: ratingMap[d._id.toString()]?.reviewCount || 0,
    }));

    res.json({ success: true, doctors: doctorsWithRatings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { exploreCentres, getCentrePublic, getDoctorPublic, getAllDoctorsPublic };
