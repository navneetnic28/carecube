const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Doctor = require("../models/Doctor");
const Centre = require("../models/Centre");
const generateToken = require("../utils/generateToken");

// POST /
// body: { role: "patient" | "doctor" | "centre_owner", name, email, phone, password, ...extra }
const register = async (req, res) => {
  try {
    const { role, name, email, phone, password } = req.body;

    if (!role || !name || !password || (!email && !phone)) {
      return res.status(400).json({
        success: false,
        message: "name, password, role and email/phone are required",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let account;
    let payload;

    if (role === "patient") {
      const exists = await User.findOne({
        $or: [{ email }, { phone }],
      });
      if (exists) {
        return res
          .status(400)
          .json({ success: false, message: "Account already exists" });
      }

      account = await User.create({
        name,
        email,
        phone,
        password: hashedPassword,
        role: "patient",
      });

      payload = { id: account._id, role: "patient", name: account.name };
    } else if (role === "doctor") {
      const exists = await Doctor.findOne({ email });
      if (exists) {
        return res
          .status(400)
          .json({ success: false, message: "Account already exists" });
      }

      account = await Doctor.create({
        name,
        email,
        phone,
        password: hashedPassword,
        specialization: req.body.specialization || "",
        qualification: req.body.qualification || "",
        registrationNumber: req.body.registrationNumber || "",
        experience: req.body.experience || "",
        bio: req.body.bio || "",
      });

      payload = { id: account._id, role: "doctor", name: account.name };
    } else if (role === "centre_owner") {
      const exists = await Centre.findOne({ email });
      if (exists) {
        return res
          .status(400)
          .json({ success: false, message: "Account already exists" });
      }

      account = await Centre.create({
        name,
        email,
        phone,
        password: hashedPassword,
        address: req.body.address || "",
        city: req.body.city || "",
        type: req.body.type || "clinic",
        openingHours: req.body.openingHours || "",
      });

      // For a centre owner, centreId === their own centre document id
      payload = {
        id: account._id,
        role: "centre_owner",
        centreId: account._id,
        name: account.name,
      };
    } else {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }

    const token = generateToken(payload);

    res.status(201).json({
      success: true,
      token,
      user: payload,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/auth/login
// body: { email or phone, password }
const login = async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    if ((!email && !phone) || !password) {
      return res.status(400).json({
        success: false,
        message: "email/phone and password are required",
      });
    }

    const query = email ? { email } : { phone };

    // Try each collection in turn
    let account = await User.findOne(query).select("+password");
    let role = account ? account.role : null;

    if (!account) {
      account = await Doctor.findOne(query).select("+password");
      role = account ? "doctor" : null;
    }

    if (!account) {
      account = await Centre.findOne(query).select("+password");
      role = account ? "centre_owner" : null;
    }

    if (!account) {
      return res
        .status(404)
        .json({ success: false, message: "Account not found" });
    }

    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    if ((role === "doctor" || role === "centre_owner") && account.isDisabled) {
      return res.status(403).json({
        success: false,
        message: "Your account has been disabled by the CareCube admin. Please contact support.",
      });
    }

    const payload = { id: account._id, role, name: account.name };
    if (role === "centre_owner") {
      payload.centreId = account._id;
    }

    const token = generateToken(payload);

    res.json({
      success: true,
      token,
      user: payload,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

module.exports = { register, login, getMe };
