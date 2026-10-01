import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  HeartPulse,
  Hospital,
  LogOut,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  UserRound,
  Users,
  XCircle,
  Menu,
  X,
  RefreshCw,
} from "lucide-react";

import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import NotificationBell from "../../components/NotificationBell";
import Logo from "../../components/Logo";

const STATUS_LABEL = {
  waiting: {
    label: "Waiting for confirmation",
    cls: "bg-amber-50 text-amber-700 border-amber-200",
    icon: Clock3,
  },
  in_queue: {
    label: "Accepted • In queue",
    cls: "bg-blue-50 text-blue-700 border-blue-200",
    icon: Users,
  },
  consulting: {
    label: "In consultation",
    cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: Activity,
  },
  completed: {
    label: "Completed",
    cls: "bg-slate-100 text-slate-600 border-slate-200",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Cancelled",
    cls: "bg-red-50 text-red-700 border-red-200",
    icon: XCircle,
  },
  no_show: {
    label: "No-show",
    cls: "bg-red-50 text-red-700 border-red-200",
    icon: XCircle,
  },
};

function PatientDashboard() {
  const { logout } = useAuth();

  const [query, setQuery] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [searched, setSearched] = useState(false);

  const [recentAppointments, setRecentAppointments] = useState([]);

  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [searchError, setSearchError] = useState("");

  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoadingAppointments(true);

      const res = await api.get("/appointments/my");

      const appointments = res?.data?.appointments || [];

      setRecentAppointments(appointments.slice(0, 3));
    } catch (error) {
      console.error("Appointment fetch error:", error);
      setRecentAppointments([]);
    } finally {
      setLoadingAppointments(false);
    }
  };

  const search = async (e) => {
    e.preventDefault();

    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setDoctors([]);
      setSearched(false);
      setSearchError("");
      return;
    }

    try {
      setLoadingDoctors(true);
      setSearchError("");

      const response = await api.get("/doctors/search", {
        params: {
          query: trimmedQuery,
        },
      });

      setDoctors(response?.data?.doctors || []);
      setSearched(true);
    } catch (error) {
      console.error("Doctor search error:", error);

      setDoctors([]);
      setSearched(true);
      setSearchError(
        error?.response?.data?.message ||
          "Unable to search doctors right now."
      );
    } finally {
      setLoadingDoctors(false);
    }
  };

  const getStatus = (status) => {
    return (
      STATUS_LABEL[status] || {
        label: status || "Unknown",
        cls: "bg-slate-100 text-slate-600 border-slate-200",
        icon: Activity,
      }
    );
  };

  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      {/* =========================
          TOP NAVIGATION
      ========================== */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          <div className="flex items-center gap-3">
            <Logo size="lg" />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-2 md:flex">

            <Link
              to="/patient/appointments"
              className="group flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              <CalendarDays size={18} />
              My Appointments
            </Link>

            <NotificationBell />

            <button
              onClick={logout}
              className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              <LogOut size={17} />
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenu((prev) => !prev)}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 md:hidden"
          >
            {mobileMenu ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenu && (
          <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
            <div className="space-y-2">

              <Link
                to="/patient/appointments"
                onClick={() => setMobileMenu(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3 font-medium text-slate-700 hover:bg-slate-100"
              >
                <CalendarDays size={19} />
                My Appointments
              </Link>

              <div className="rounded-xl px-4 py-3">
                <NotificationBell />
              </div>

              <button
                onClick={logout}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 font-medium text-red-600 hover:bg-red-50"
              >
                <LogOut size={19} />
                Logout
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        {/* =========================
            HERO SECTION
        ========================== */}
        <section className="relative overflow-hidden rounded-3xl bg-slate-900 px-6 py-8 shadow-xl sm:px-8 lg:px-10 lg:py-10">

          {/* Background Decorations */}
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />

          <div className="relative z-10 grid items-center gap-8 lg:grid-cols-[1.4fr_0.6fr]">

            <div>

              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/80 backdrop-blur">
                <Sparkles size={14} className="text-emerald-300" />
                Welcome to CareCube
              </div>

              <h1 className="max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Your health,
                <span className="block text-emerald-300">
                  simplified.
                </span>
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                Find verified doctors, explore nearby chambers, book
                appointments and track your queue — all from one place.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">

                <Link
                  to="/explore"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-900 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
                >
                  <Search size={18} />
                  Explore Doctors
                  <ArrowRight size={16} />
                </Link>

                <Link
                  to="/patient/appointments"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/15"
                >
                  <CalendarDays size={18} />
                  My Appointments
                </Link>

              </div>
            </div>

            {/* Hero Illustration Card */}
            <div className="hidden lg:block">
              <div className="mx-auto max-w-sm rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl">

                <div className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-xl">

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                    <HeartPulse size={28} />
                  </div>

                  <div>
                    <p className="text-xs font-medium text-slate-500">
                      CareCube Health
                    </p>

                    <p className="mt-1 text-lg font-bold text-slate-900">
                      Care made simple
                    </p>
                  </div>

                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">

                  <div className="rounded-2xl bg-white/10 p-4">
                    <Stethoscope
                      size={21}
                      className="text-emerald-300"
                    />
                    <p className="mt-3 text-xs text-slate-300">
                      Verified Doctors
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-4">
                    <Hospital
                      size={21}
                      className="text-blue-300"
                    />
                    <p className="mt-3 text-xs text-slate-300">
                      Nearby Centres
                    </p>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </section>

        {/* =========================
            QUICK ACTIONS
        ========================== */}
        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <Link
            to="/explore"
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-center justify-between">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Search size={21} />
              </div>

              <ArrowRight
                size={18}
                className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-slate-600"
              />

            </div>

            <h3 className="mt-4 font-bold">Find a Doctor</h3>

            <p className="mt-1 text-sm text-slate-500">
              Search doctors by speciality and location.
            </p>
          </Link>

          <Link
            to="/patient/appointments"
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-center justify-between">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <CalendarDays size={21} />
              </div>

              <ArrowRight
                size={18}
                className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-slate-600"
              />

            </div>

            <h3 className="mt-4 font-bold">Appointments</h3>

            <p className="mt-1 text-sm text-slate-500">
              View and manage your appointments.
            </p>
          </Link>

          <Link
            to="/explore"
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-center justify-between">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <Hospital size={21} />
              </div>

              <ArrowRight
                size={18}
                className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-slate-600"
              />

            </div>

            <h3 className="mt-4 font-bold">Explore Centres</h3>

            <p className="mt-1 text-sm text-slate-500">
              Discover clinics and chambers near you.
            </p>
          </Link>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <ShieldCheck size={21} />
            </div>

            <h3 className="mt-4 font-bold">Verified Care</h3>

            <p className="mt-1 text-sm text-slate-500">
              Discover verified doctors on CareCube.
            </p>

          </div>

        </section>

        {/* =========================
            RECENT APPOINTMENTS
        ========================== */}
        <section className="mt-8">

          <div className="mb-4 flex items-end justify-between gap-4">

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Your activity
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">
                Recent appointments
              </h2>
            </div>

            <Link
              to="/patient/appointments"
              className="hidden items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 sm:flex"
            >
              View all
              <ChevronRight size={17} />
            </Link>

          </div>

          {loadingAppointments ? (

            <div className="grid gap-4 md:grid-cols-3">

              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5"
                >
                  <div className="h-5 w-32 rounded bg-slate-200" />
                  <div className="mt-3 h-4 w-24 rounded bg-slate-200" />
                  <div className="mt-5 h-8 w-28 rounded bg-slate-200" />
                </div>
              ))}

            </div>

          ) : recentAppointments.length > 0 ? (

            <div className="grid gap-4 md:grid-cols-3">

              {recentAppointments.map((appt) => {

                const status = getStatus(appt.status);
                const StatusIcon = status.icon;

                return (
                  <div
                    key={appt._id}
                    className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >

                    <div className="flex items-start justify-between gap-3">

                      <div className="flex min-w-0 items-center gap-3">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                          <UserRound size={20} />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate font-bold text-slate-900">
                            Dr. {appt.doctorId?.name || "Doctor"}
                          </p>

                          <p className="truncate text-xs text-slate-500">
                            {appt.centreId?.name || "Centre unavailable"}
                          </p>
                        </div>

                      </div>

                      <span className="rounded-lg bg-slate-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                        #{appt.tokenNumber || "--"}
                      </span>

                    </div>

                    <div className="mt-5 flex items-center gap-2 text-sm text-slate-500">
                      <CalendarDays size={16} />
                      {formatDate(appt.appointmentDate)}
                    </div>

                    <div className="mt-4 border-t border-slate-100 pt-4">

                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${status.cls}`}
                      >
                        <StatusIcon size={14} />
                        {status.label}
                      </span>

                    </div>

                  </div>
                );
              })}

            </div>

          ) : (

            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                <CalendarDays size={25} />
              </div>

              <h3 className="mt-4 font-bold text-slate-900">
                No appointments yet
              </h3>

              <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
                Find a doctor and book your first appointment through
                CareCube.
              </p>

              <Link
                to="/explore"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800"
              >
                Find a Doctor
                <ArrowRight size={16} />
              </Link>

            </div>

          )}

          <Link
            to="/patient/appointments"
            className="mt-4 flex items-center justify-center gap-1 text-sm font-semibold text-blue-600 sm:hidden"
          >
            View all appointments
            <ChevronRight size={17} />
          </Link>

        </section>

        {/* =========================
            SEARCH DOCTOR
        ========================== */}
        <section className="mt-10">

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">

            <div className="max-w-2xl">

              <div className="flex items-center gap-2 text-emerald-600">
                <Stethoscope size={20} />
                <span className="text-sm font-bold">
                  Doctor discovery
                </span>
              </div>

              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Find the right doctor
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Search for verified doctors by name and explore their
                associated chambers.
              </p>

            </div>

            <form
              onSubmit={search}
              className="mt-6 flex flex-col gap-3 lg:flex-row"
            >

              <div className="relative flex-1">

                <Search
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  placeholder="Search doctor by name..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="h-13 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                />

              </div>

              <button
                type="submit"
                disabled={loadingDoctors}
                className="flex h-13 items-center justify-center gap-2 rounded-xl bg-slate-900 px-7 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >

                {loadingDoctors ? (
                  <>
                    <RefreshCw
                      size={18}
                      className="animate-spin"
                    />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search size={18} />
                    Search Doctors
                  </>
                )}

              </button>

              <Link
                to="/explore"
                className="flex h-13 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                Advanced Explore
                <ArrowRight size={16} />
              </Link>

            </form>

          </div>

        </section>

        {/* =========================
            SEARCH RESULTS
        ========================== */}
        <section className="mt-6">

          {searchError && (
            <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
              {searchError}
            </div>
          )}

          {searched && !loadingDoctors && doctors.length === 0 && !searchError && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                <Search size={27} />
              </div>

              <h3 className="mt-4 text-lg font-bold">
                No verified doctors found
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Try another doctor name or use Advanced Explore.
              </p>

              <Link
                to="/explore"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white"
              >
                Explore Doctors
                <ArrowRight size={16} />
              </Link>

            </div>
          )}

          {doctors.length > 0 && (

            <div>

              <div className="mb-4 flex items-center justify-between">

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                    Search results
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-slate-900">
                    Doctors available for you
                  </h2>
                </div>

                <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
                  {doctors.length} found
                </span>

              </div>

              <div className="grid gap-5 lg:grid-cols-2">

                {doctors.map((doctor) => (

                  <div
                    key={doctor._id}
                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >

                    {/* Doctor Header */}
                    <div className="relative bg-slate-900 p-5 sm:p-6">

                      <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-emerald-400/10 blur-2xl" />

                      <div className="relative flex items-start gap-4">

                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-emerald-300 ring-1 ring-white/10">
                          <Stethoscope size={27} />
                        </div>

                        <div className="min-w-0 flex-1">

                          <div className="flex flex-wrap items-center gap-2">

                            <h3 className="text-lg font-bold text-white">
                              Dr. {doctor.name}
                            </h3>

                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/10 px-2 py-1 text-[10px] font-bold text-emerald-300">
                              <ShieldCheck size={12} />
                              Verified
                            </span>

                          </div>

                          <p className="mt-1 text-sm font-semibold text-emerald-300">
                            {doctor.specialization || "General Physician"}
                          </p>

                          {doctor.qualification && (
                            <p className="mt-1 text-xs text-slate-400">
                              {doctor.qualification}
                            </p>
                          )}

                        </div>

                      </div>
                    </div>

                    {/* Chambers */}
                    <div className="p-5 sm:p-6">

                      <div className="flex items-center justify-between">

                        <div className="flex items-center gap-2">
                          <Hospital
                            size={17}
                            className="text-slate-500"
                          />

                          <h4 className="text-sm font-bold text-slate-900">
                            Associated chambers
                          </h4>
                        </div>

                        <span className="text-xs font-medium text-slate-400">
                          {doctor.chambers?.length || 0} centre
                          {doctor.chambers?.length === 1 ? "" : "s"}
                        </span>

                      </div>

                      <div className="mt-4 space-y-3">

                        {(doctor.chambers || []).map((centre) => (

                          <div
                            key={centre._id}
                            className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300 hover:bg-white"
                          >

                            <div className="flex items-start gap-3">

                              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm">
                                <MapPin size={17} />
                              </div>

                              <div className="min-w-0">

                                <p className="font-bold text-slate-900">
                                  {centre.name}
                                </p>

                                <p className="mt-1 text-xs leading-5 text-slate-500">
                                  {centre.address ||
                                    "Address unavailable"}
                                </p>

                              </div>

                            </div>

                          </div>

                        ))}

                        {(!doctor.chambers ||
                          doctor.chambers.length === 0) && (

                          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-center">

                            <Hospital
                              size={22}
                              className="mx-auto text-slate-400"
                            />

                            <p className="mt-2 text-sm font-medium text-slate-500">
                              No associated centre yet
                            </p>

                          </div>
                        )}

                      </div>

                      <Link
                        to={`/doctor/${doctor._id}`}
                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 hover:shadow-md"
                      >
                        View Profile & Book
                        <ArrowRight size={17} />
                      </Link>

                    </div>

                  </div>

                ))}

              </div>

            </div>
          )}

        </section>

        {/* =========================
            BOTTOM TRUST SECTION
        ========================== */}
        <section className="mt-10 mb-6">

          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <ShieldCheck size={23} />
                </div>

                <div>
                  <h3 className="font-bold text-slate-900">
                    Your healthcare journey, in one place
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                    Search doctors, manage appointments and stay updated
                    with your queue.
                  </p>
                </div>

              </div>

              <Link
                to="/explore"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                Explore CareCube
                <ArrowRight size={16} />
              </Link>

            </div>

          </div>

        </section>

      </main>

      {/* =========================
          FOOTER
      ========================== */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-center text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8 lg:text-left">

          <p>
            © {new Date().getFullYear()} CareCube. Healthcare made simpler.
          </p>

          <div className="flex items-center justify-center gap-2">
            <HeartPulse size={14} />
            <span>Find • Book • Track</span>
          </div>

        </div>
      </footer>

    </div>
  );
}

export default PatientDashboard;
