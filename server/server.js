const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
console.log("MONGO_URI loaded:", !!process.env.MONGO_URI);

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ success: true, message: "CareCube API is running" });
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api", require("./routes/appointmentRoutes")); // /api/doctors/search, /api/appointments/*
app.use("/api/doctor", require("./routes/doctorRoutes"));
app.use("/api/centre", require("./routes/centreRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/reports", require("./routes/reportRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
// Mounted last: Explore + public profile pages ("/api/centres", "/api/centres/:id",
// "/api/doctors/:id"). Must come after appointmentRoutes above so "/api/doctors/search"
// is matched first and never swallowed by "/api/doctors/:id".
app.use("/api", require("./routes/publicRoutes"));

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`CareCube server running on port ${PORT}`);
});
