import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "../components/Logo";

function Register() {
  const { register } = useAuth();
  const [form, setForm] = useState({
    role: "patient",
    name: "",
    email: "",
    phone: "",
    password: "",
    specialization: "",
    qualification: "",
    experience: "",
    address: "",
    city: "",
    type: "clinic",
    openingHours: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-8 shadow">
        <Logo size="md" />
        <p className="mt-1 text-gray-500">Create your account</p>

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
          >
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
            <option value="centre_owner">Centre Owner</option>
          </select>

          <input
            type="text"
            name="name"
            placeholder="Full name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full rounded-lg border p-3"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full rounded-lg border p-3"
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
          />

          {form.role === "doctor" && (
            <>
              <input
                type="text"
                name="specialization"
                placeholder="Specialization (e.g. ENT, Cardiologist)"
                value={form.specialization}
                onChange={handleChange}
                className="w-full rounded-lg border p-3"
              />
              <input
                type="text"
                name="qualification"
                placeholder="Qualification (e.g. MBBS, MD)"
                value={form.qualification}
                onChange={handleChange}
                className="w-full rounded-lg border p-3"
              />
              <input
                type="text"
                name="experience"
                placeholder="Experience (e.g. 5 years)"
                value={form.experience}
                onChange={handleChange}
                className="w-full rounded-lg border p-3"
              />
            </>
          )}

          {form.role === "centre_owner" && (
            <>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full rounded-lg border p-3"
              >
                <option value="clinic">Clinic</option>
                <option value="hospital">Hospital</option>
                <option value="medical_shop">Medical Shop</option>
              </select>
              <input
                type="text"
                name="address"
                placeholder="Centre address"
                value={form.address}
                onChange={handleChange}
                className="w-full rounded-lg border p-3"
              />
              <input
                type="text"
                name="city"
                placeholder="City / Location"
                value={form.city}
                onChange={handleChange}
                className="w-full rounded-lg border p-3"
              />
              <input
                type="text"
                name="openingHours"
                placeholder="Opening hours (e.g. 9 AM - 8 PM)"
                value={form.openingHours}
                onChange={handleChange}
                className="w-full rounded-lg border p-3"
              />
            </>
          )}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full rounded-lg border p-3"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 p-3 text-white disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
