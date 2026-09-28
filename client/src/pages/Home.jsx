import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import ReviewsSection from "../components/ReviewsSection";
import FeaturedDoctors from "../components/FeaturedDoctors";
import NotificationBell from "../components/NotificationBell";
import Footer from "../components/Footer";
import Logo from "../components/Logo";

function Home() {
  const { user, logout } = useAuth();
  const [query, setQuery] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [searched, setSearched] = useState(false);

  const search = async (e) => {
    e.preventDefault();
    const response = await api.get("/doctors/search", { params: { query } });
    setDoctors(response.data.doctors);
    setSearched(true);
  };

  const dashboardPath = {
    patient: "/patient/dashboard",
    doctor: "/doctor/dashboard",
    centre_owner: "/centre/dashboard",
    admin: "/admin/dashboard",
  }[user?.role];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="flex items-center justify-between border-b bg-white p-5">
        <Logo size="md" />

        <div className="flex gap-3">
          <Link to="/explore" className="rounded-lg px-4 py-2 hover:bg-gray-100">
            Explore
          </Link>
          {user ? (
            <>
              <NotificationBell />
              <Link to={dashboardPath} className="rounded-lg bg-blue-600 px-4 py-2 text-white">
                Go to Dashboard
              </Link>
              <button onClick={logout} className="rounded-lg bg-white px-4 py-2 shadow">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="rounded-lg px-4 py-2 hover:bg-gray-100">
                Login
              </Link>
              <Link to="/register" className="rounded-lg bg-blue-600 px-4 py-2 text-white">
                Register
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white p-8 text-center">
        <span className="inline-block rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-700">
          🟢 Live doctor availability · No more phone calls
        </span>
        <h2 className="mx-auto mt-4 max-w-2xl text-4xl font-bold leading-tight md:text-5xl">
          Book doctor appointments, <span className="text-blue-600">skip the wait</span>
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-gray-600">
          Search verified doctors and centres near you, book a slot, and track your live queue
          token — all in one place.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link to="/explore" className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow hover:bg-blue-700">
            Find a Doctor
          </Link>
          {!user && (
            <Link
              to="/register"
              className="rounded-lg bg-white px-6 py-3 font-medium text-blue-600 shadow"
            >
              Register your Clinic
            </Link>
          )}
        </div>

        <div className="mx-auto mt-10 grid max-w-2xl grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-blue-600">🔍</p>
            <p className="mt-1 text-sm text-gray-500">Search &amp; Explore</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-600">🎫</p>
            <p className="mt-1 text-sm text-gray-500">Get a Live Token</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-600">📱</p>
            <p className="mt-1 text-sm text-gray-500">QR Chamber Booking</p>
          </div>
        </div>
      </section>

      <FeaturedDoctors />

      {/* Search */}
      <section className="mx-auto max-w-2xl px-6">
        <form onSubmit={search} className="flex gap-3">
          <input
            type="text"
            placeholder="Search doctor by name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-lg border p-3"
          />
          <button type="submit" className="rounded-lg bg-blue-600 px-5 py-3 text-white">
            Search
          </button>
        </form>

        <div className="mt-6 space-y-4 pb-12">
          {searched && doctors.length === 0 && (
            <p className="text-center text-gray-500">No verified doctors found.</p>
          )}

          {doctors.map((doctor) => (
            <div key={doctor._id} className="rounded-xl bg-white p-5 shadow">
              <div className="flex items-center gap-4">
                {doctor.photoUrl ? (
                  <img
                    src={doctor.photoUrl}
                    alt={doctor.name}
                    className="h-14 w-14 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-600">
                    {doctor.name?.[0]}
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-bold">Dr. {doctor.name}</h3>
                  <p className="text-blue-600">{doctor.specialization}</p>
                  <p className="text-gray-500">{doctor.qualification}</p>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                {(doctor.chambers || []).map((centre) => (
                  <div key={centre._id} className="rounded-lg border p-3">
                    <p className="font-medium">{centre.name}</p>
                    <p className="text-sm text-gray-500">{centre.address}</p>
                  </div>
                ))}
                {(!doctor.chambers || doctor.chambers.length === 0) && (
                  <p className="text-sm text-gray-400">No associated centre yet</p>
                )}
              </div>

              <Link
                to={`/doctor/${doctor._id}`}
                className="mt-4 inline-block rounded-lg bg-blue-600 px-5 py-2 text-sm text-white"
              >
                View Profile &amp; Book
              </Link>

              {!user && (
                <p className="mt-3 text-sm text-gray-500">
                  <Link to="/login" className="text-blue-600">
                    Login
                  </Link>{" "}
                  as a patient to book this doctor.
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      <ReviewsSection />

      <Footer />
    </div>
  );
}

export default Home;
