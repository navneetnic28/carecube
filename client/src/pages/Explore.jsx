import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";
import Logo from "../components/Logo";

const SPECIALIZATIONS = [
  "General Physician",
  "ENT",
  "Cardiologist",
  "Dentist",
  "Dermatologist",
  "Orthopedic",
  "Gynecologist",
  "Pediatrician",
];

function Explore() {
  const { user } = useAuth();
  const [tab, setTab] = useState("doctors"); // doctors | centres
  const [filters, setFilters] = useState({ query: "", specialization: "", city: "" });
  const [doctors, setDoctors] = useState([]);
  const [centres, setCentres] = useState([]);
  const [searched, setSearched] = useState(false);

  // Show ALL doctors / centres by default, and reload when the tab changes
  useEffect(() => {
    runSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const runSearch = async (e) => {
    e?.preventDefault();
    setSearched(true);
    if (tab === "doctors") {
      const res = await api.get("/doctors/search", {
        params: {
          query: filters.query || undefined,
          specialization: filters.specialization || undefined,
          city: filters.city || undefined,
        },
      });
      setDoctors(res.data.doctors);
    } else {
      const res = await api.get("/centres", {
        params: { query: filters.query || undefined, city: filters.city || undefined },
      });
      setCentres(res.data.centres);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex items-center justify-between border-b bg-white p-5">
        <Logo size="md" />
        <div className="flex gap-3">
          {user ? (
            <Link to="/" className="rounded-lg bg-white px-4 py-2 shadow">
              Home
            </Link>
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

      <section className="mx-auto max-w-4xl px-6 py-8">
        <h1 className="text-3xl font-bold">Explore Doctors &amp; Centres</h1>
        <p className="mt-1 text-gray-600">
          Search by specialization, location, doctor name or centre name.
        </p>

        <div className="mt-6 flex gap-2 rounded-lg bg-white p-1 shadow w-fit">
          <button
            onClick={() => {
              setTab("doctors");
              setSearched(false);
            }}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              tab === "doctors" ? "bg-blue-600 text-white" : "text-gray-600"
            }`}
          >
            Doctors
          </button>
          <button
            onClick={() => {
              setTab("centres");
              setSearched(false);
            }}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              tab === "centres" ? "bg-blue-600 text-white" : "text-gray-600"
            }`}
          >
            Centres
          </button>
        </div>

        <form onSubmit={runSearch} className="mt-5 grid gap-3 rounded-xl bg-white p-5 shadow md:grid-cols-4">
          <input
            type="text"
            placeholder={tab === "doctors" ? "Doctor name..." : "Centre name..."}
            value={filters.query}
            onChange={(e) => setFilters({ ...filters, query: e.target.value })}
            className="rounded-lg border p-3 md:col-span-2"
          />

          {tab === "doctors" && (
            <select
              value={filters.specialization}
              onChange={(e) => setFilters({ ...filters, specialization: e.target.value })}
              className="rounded-lg border p-3"
            >
              <option value="">All specializations</option>
              {SPECIALIZATIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          )}

          <input
            type="text"
            placeholder="Location / city..."
            value={filters.city}
            onChange={(e) => setFilters({ ...filters, city: e.target.value })}
            className="rounded-lg border p-3"
          />

          <button
            type="submit"
            className={`rounded-lg bg-blue-600 px-5 py-3 text-white ${
              tab === "doctors" ? "" : "md:col-start-4"
            }`}
          >
            Search
          </button>
        </form>

        <div className="mt-6 space-y-4">
          {tab === "doctors" && (
            <>
              {searched && doctors.length === 0 && (
                <p className="text-center text-gray-500">No doctors found.</p>
              )}
              {doctors.map((doctor) => (
                <Link
                  key={doctor._id}
                  to={`/doctor/${doctor._id}`}
                  className="block rounded-xl bg-white p-5 shadow hover:shadow-md"
                >
                  <div className="flex items-center gap-4">
                    {doctor.photoUrl ? (
                      <img src={doctor.photoUrl} alt={doctor.name} className="h-16 w-16 rounded-full object-cover" />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-600">
                        {doctor.name?.[0]}
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-lg font-bold">Dr. {doctor.name} {doctor.verificationStatus === "verified" && <span className="ml-1 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700">✓ Verified</span>}</h3>
                      <p className="text-blue-600">{doctor.specialization}</p>
                      <p className="text-sm text-gray-500">
                        {doctor.qualification}
                        {doctor.experience ? ` · ${doctor.experience} experience` : ""}
                      </p>
                    </div>
                    {doctor.consultationFee > 0 && (
                      <div className="text-right">
                        <p className="text-xs text-gray-400">Fee</p>
                        <p className="font-bold">₹{doctor.consultationFee}</p>
                      </div>
                    )}
                  </div>
                  <p className="mt-3 text-sm text-gray-500">
                    🏥 {(doctor.chambers || []).map((c) => c.name).join(", ") || "Not associated with a chamber yet"}
                  </p>
                  <span className="mt-3 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm text-white">
                    View Profile &amp; Book →
                  </span>
                </Link>
              ))}
            </>
          )}

          {tab === "centres" && (
            <>
              {searched && centres.length === 0 && (
                <p className="text-center text-gray-500">No centres found.</p>
              )}
              {centres.map((centre) => (
                <Link
                  key={centre._id}
                  to={`/centre/${centre._id}`}
                  className="block rounded-xl bg-white p-5 shadow hover:shadow-md"
                >
                  <h3 className="text-lg font-bold">{centre.name}</h3>
                  <p className="text-gray-500">
                    {centre.address}
                    {centre.city ? `, ${centre.city}` : ""}
                  </p>
                  {centre.openingHours && (
                    <p className="mt-1 text-sm text-gray-400">{centre.openingHours}</p>
                  )}
                </Link>
              ))}
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Explore;
