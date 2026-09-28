import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  MapPin,
  Stethoscope,
  Building2,
  ShieldCheck,
  Clock3,
  IndianRupee,
  ArrowRight,
  SlidersHorizontal,
  X,
  CheckCircle2,
  Home as HomeIcon,
  ChevronDown,
} from "lucide-react";

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

  const [tab, setTab] = useState("doctors");
  const [filters, setFilters] = useState({
    query: "",
    specialization: "",
    city: "",
  });

  const [doctors, setDoctors] = useState([]);
  const [centres, setCentres] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mobileFilters, setMobileFilters] = useState(false);

  useEffect(() => {
    runSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const runSearch = async (e) => {
    e?.preventDefault();

    try {
      setLoading(true);
      setSearched(true);

      if (tab === "doctors") {
        const res = await api.get("/doctors/search", {
          params: {
            query: filters.query || undefined,
            specialization: filters.specialization || undefined,
            city: filters.city || undefined,
          },
        });

        setDoctors(res.data.doctors || []);
      } else {
        const res = await api.get("/centres", {
          params: {
            query: filters.query || undefined,
            city: filters.city || undefined,
          },
        });

        setCentres(res.data.centres || []);
      }
    } catch (error) {
      console.error("Explore search failed:", error);

      if (tab === "doctors") {
        setDoctors([]);
      } else {
        setCentres([]);
      }

      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      query: "",
      specialization: "",
      city: "",
    });
  };

  const currentResults =
    tab === "doctors" ? doctors.length : centres.length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      {/* =====================================================
          NAVBAR
      ====================================================== */}
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">

          <Logo size="md" />

          <div className="flex items-center gap-3">

            {user ? (
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-600"
              >
                <HomeIcon size={17} />
                <span className="hidden sm:inline">Home</span>
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* =====================================================
          HERO
      ====================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-slate-50">

        <div className="absolute -left-32 top-10 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl" />
        <div className="absolute -right-32 top-0 h-80 w-80 rounded-full bg-cyan-200/30 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 pb-12 pt-14 sm:px-6 sm:pt-20 lg:px-8">

          <div className="mx-auto max-w-3xl text-center">

            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-bold text-blue-600 shadow-sm">
              <Search size={15} />
              Explore Healthcare
            </div>

            <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Find the right
              <span className="text-blue-600"> healthcare </span>
              for you.
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Discover verified doctors and healthcare centres, check
              availability and book your appointment with ease.
            </p>
          </div>

          {/* =================================================
              TAB SWITCHER
          ================================================== */}
          <div className="mx-auto mt-10 flex max-w-md rounded-2xl border border-slate-200 bg-white p-1.5 shadow-lg">

            <button
              type="button"
              onClick={() => {
                setTab("doctors");
                setSearched(false);
              }}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition ${
                tab === "doctors"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <Stethoscope size={18} />
              Doctors
            </button>

            <button
              type="button"
              onClick={() => {
                setTab("centres");
                setSearched(false);
              }}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition ${
                tab === "centres"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <Building2 size={18} />
              Centres
            </button>
          </div>
        </div>
      </section>

      {/* =====================================================
          SEARCH AREA
      ====================================================== */}
      <section className="relative z-10 mx-auto -mt-1 max-w-6xl px-5 sm:px-6 lg:px-8">

        <form
          onSubmit={runSearch}
          className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/60 sm:p-5"
        >

          <div className="grid gap-3 lg:grid-cols-12">

            {/* Search */}
            <div className="relative lg:col-span-5">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder={
                  tab === "doctors"
                    ? "Search doctor by name..."
                    : "Search centre name..."
                }
                value={filters.query}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    query: e.target.value,
                  })
                }
                className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
              />
            </div>

            {/* Specialization */}
            {tab === "doctors" && (
              <div className="relative lg:col-span-3">
                <select
                  value={filters.specialization}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      specialization: e.target.value,
                    })
                  }
                  className="h-14 w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 px-4 pr-10 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
                >
                  <option value="">All specializations</option>

                  {SPECIALIZATIONS.map((specialization) => (
                    <option
                      key={specialization}
                      value={specialization}
                    >
                      {specialization}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  size={18}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>
            )}

            {/* City */}
            <div
              className={`relative ${
                tab === "doctors"
                  ? "lg:col-span-2"
                  : "lg:col-span-4"
              }`}
            >
              <MapPin
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="City / location"
                value={filters.city}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    city: e.target.value,
                  })
                }
                className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
              />
            </div>

            {/* Search button */}
            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 lg:col-span-2"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Searching
                </>
              ) : (
                <>
                  <Search size={18} />
                  Search
                </>
              )}
            </button>
          </div>

          {/* Filter controls */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">

            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
            >
              <X size={15} />
              Clear filters
            </button>

            <div className="flex items-center gap-2 text-sm text-slate-400">
              <SlidersHorizontal size={16} />
              Search by name, specialization or location
            </div>
          </div>
        </form>
      </section>

      {/* =====================================================
          RESULTS
      ====================================================== */}
      <main className="mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:px-8">

        {/* Result heading */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
              {tab === "doctors"
                ? "Healthcare Professionals"
                : "Healthcare Centres"}
            </p>

            <h2 className="mt-2 text-2xl font-black sm:text-3xl">
              {tab === "doctors"
                ? "Find your doctor"
                : "Find a healthcare centre"}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {searched
                ? `${currentResults} result${
                    currentResults !== 1 ? "s" : ""
                  } found`
                : "Explore available healthcare options"}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm">
            {tab === "doctors" ? (
              <span className="inline-flex items-center gap-2">
                <Stethoscope size={16} className="text-blue-600" />
                Doctors
              </span>
            ) : (
              <span className="inline-flex items-center gap-2">
                <Building2 size={16} className="text-blue-600" />
                Centres
              </span>
            )}
          </div>
        </div>

        {/* =================================================
            DOCTORS
        ================================================== */}
        {tab === "doctors" && (
          <>
            {searched && doctors.length === 0 ? (
              <EmptyState
                icon={Stethoscope}
                title="No doctors found"
                text="Try changing the doctor name, specialization or location."
                action={() => clearFilters()}
              />
            ) : (
              <div className="grid gap-5 md:grid-cols-2">

                {doctors.map((doctor) => (
                  <Link
                    key={doctor._id}
                    to={`/doctor/${doctor._id}`}
                    className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-100/30 sm:p-6"
                  >

                    {/* Doctor header */}
                    <div className="flex gap-4">

                      {doctor.photoUrl ? (
                        <img
                          src={doctor.photoUrl}
                          alt={doctor.name}
                          className="h-20 w-20 shrink-0 rounded-2xl object-cover ring-4 ring-blue-50"
                        />
                      ) : (
                        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100 text-2xl font-black text-blue-600 ring-4 ring-blue-50">
                          {doctor.name?.[0]?.toUpperCase()}
                        </div>
                      )}

                      <div className="min-w-0 flex-1">

                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="truncate text-lg font-black text-slate-900">
                            Dr. {doctor.name}
                          </h3>

                          {doctor.verificationStatus === "verified" && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                              <CheckCircle2 size={11} />
                              Verified
                            </span>
                          )}
                        </div>

                        <p className="mt-1 font-semibold text-blue-600">
                          {doctor.specialization}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          {doctor.qualification}
                        </p>

                        {doctor.experience && (
                          <p className="mt-1 inline-flex items-center gap-1 text-xs text-slate-400">
                            <Clock3 size={13} />
                            {doctor.experience} experience
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="my-5 h-px bg-slate-100" />

                    {/* Details */}
                    <div className="grid gap-3">

                      {/* Chamber */}
                      <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-3.5">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                          <MapPin size={17} />
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Available at
                          </p>

                          <p className="mt-1 truncate text-sm font-bold text-slate-700">
                            {(doctor.chambers || [])
                              .map((c) => c.name)
                              .join(", ") ||
                              "No associated chamber yet"}
                          </p>
                        </div>
                      </div>

                      {/* Fee */}
                      {doctor.consultationFee > 0 && (
                        <div className="flex items-center justify-between rounded-2xl border border-blue-100 bg-blue-50/50 px-4 py-3">

                          <div className="flex items-center gap-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                              <IndianRupee size={17} />
                            </div>

                            <span className="text-sm font-medium text-slate-500">
                              Consultation fee
                            </span>
                          </div>

                          <span className="text-lg font-black text-slate-900">
                            ₹{doctor.consultationFee}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* CTA */}
                    <div className="mt-5 flex items-center justify-between">

                      <span className="text-sm font-semibold text-slate-400">
                        View details & booking
                      </span>

                      <span className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition group-hover:bg-blue-700">
                        View Profile
                        <ArrowRight
                          size={16}
                          className="transition group-hover:translate-x-1"
                        />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}

        {/* =================================================
            CENTRES
        ================================================== */}
        {tab === "centres" && (
          <>
            {searched && centres.length === 0 ? (
              <EmptyState
                icon={Building2}
                title="No centres found"
                text="Try changing the centre name or location."
                action={() => clearFilters()}
              />
            ) : (
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

                {centres.map((centre) => (
                  <Link
                    key={centre._id}
                    to={`/centre/${centre._id}`}
                    className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-100/30"
                  >

                    <div className="flex items-start justify-between">

                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                        <Building2 size={25} />
                      </div>

                      <ArrowRight
                        size={19}
                        className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600"
                      />
                    </div>

                    <h3 className="mt-6 text-xl font-black text-slate-900">
                      {centre.name}
                    </h3>

                    <div className="mt-4 flex items-start gap-3">
                      <MapPin
                        size={18}
                        className="mt-0.5 shrink-0 text-blue-600"
                      />

                      <p className="text-sm leading-6 text-slate-500">
                        {centre.address}
                        {centre.city ? `, ${centre.city}` : ""}
                      </p>
                    </div>

                    {centre.openingHours && (
                      <div className="mt-4 flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5 text-sm text-slate-500">
                        <Clock3 size={16} className="text-blue-600" />
                        {centre.openingHours}
                      </div>
                    )}

                    <div className="mt-6 border-t border-slate-100 pt-5">
                      <span className="inline-flex items-center gap-2 text-sm font-bold text-blue-600">
                        View Centre
                        <ArrowRight
                          size={16}
                          className="transition group-hover:translate-x-1"
                        />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}

      </main>

      {/* =====================================================
          BOTTOM CTA
      ====================================================== */}
      <section className="px-5 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-gradient-to-r from-blue-600 to-cyan-600 px-7 py-12 text-white sm:px-12 lg:px-16">

          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">

            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-blue-100">
                Carecube
              </p>

              <h2 className="mt-2 text-3xl font-black sm:text-4xl">
                Your healthcare journey starts here.
              </h2>

              <p className="mt-3 max-w-xl text-blue-100">
                Find a doctor, choose a centre and book your appointment
                without unnecessary waiting.
              </p>
            </div>

            <Link
              to="/explore"
              className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-white px-6 py-4 font-bold text-blue-600 shadow-xl transition hover:-translate-y-1"
            >
              Explore Now
              <ArrowRight size={18} />
            </Link>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

/* ============================================================
   EMPTY STATE
============================================================ */

function EmptyState({ icon: Icon, title, text, action }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">

      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-500">
        <Icon size={30} />
      </div>

      <h3 className="mt-5 text-xl font-black text-slate-900">
        {title}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        {text}
      </p>

      <button
        type="button"
        onClick={action}
        className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
      >
        Clear Filters
      </button>
    </div>
  );
}

export default Explore;