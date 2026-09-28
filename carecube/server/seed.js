// Run this once to create the first Admin account:
//   node seed.js admin@carecube.com yourpassword "Admin Name"
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const User = require("./models/User");

dotenv.config();

const run = async () => {
  const [, , email, password, name] = process.argv;

  if (!email || !password) {
    console.log('Usage: node seed.js <email> <password> "<name>"');
    process.exit(1);
  }

  await connectDB();

  const existing = await User.findOne({ email });
  if (existing) {
    console.log("An account with this email already exists.");
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await User.create({
    name: name || "Admin",
    email,
    password: hashedPassword,
    role: "admin",
  });

  console.log("Admin account created:", admin.email);
  process.exit(0);
};

run();
