import { useEffect, useMemo, useState } from "react";
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
  BadgeCheck,
  Navigation,
  CalendarCheck2,
  Heart,
  LayoutDashboard,
  Star,
  Zap,
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

      setRecentAppointments(appointments);
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

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Date unavailable";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (date) => {
    if (!date) return "";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "";
    }

    return parsedDate.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const stats = useMemo(() => {
    const total = recentAppointments.length;

    const active = recentAppointments.filter((item) =>
      ["waiting", "in_queue", "consulting"].includes(item.status)
    ).length;

    const completed = recentAppointments.filter(
      (item) => item.status === "completed"
    ).length;

    return {
      total,
      active,
      completed,
    };
  }, [recentAppointments]);

  const displayedAppointments = recentAppointments.slice(0, 3);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f6f9ff] text-slate-900">

      {/* =========================================================
          NAVBAR
      ========================================================== */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-xl">

        <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* Logo */}
          <Link
            to="/patient"
            className="flex min-w-0 items-center"
          >
            <Logo size="lg" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-2 md:flex">

            <Link
              to="/patient"
              className="flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-2.5 text-sm font-bold text-blue-700"
            >
              <LayoutDashboard size={17} />
              Dashboard
            </Link>

            <Link
              to="/patient/appointments"
              className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              <CalendarDays size={18} />
              My Appointments
            </Link>

            <div className="px-1">
              <NotificationBell />
            </div>

            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-700"
            >
              <LogOut size={17} />
              Logout
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileMenu((prev) => !prev)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 md:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenu ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenu && (
          <div className="border-t border-slate-200 bg-white px-4 py-4 shadow-lg md:hidden">

            <div className="space-y-2">

              <Link
                to="/patient"
                onClick={() => setMobileMenu(false)}
                className="flex items-center gap-3 rounded-xl bg-blue-50 px-4 py-3 font-bold text-blue-700"
              >
                <LayoutDashboard size={19} />
                Dashboard
              </Link>

              <Link
                to="/patient/appointments"
                onClick={() => setMobileMenu(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                <CalendarDays size={19} />
                My Appointments
              </Link>

              <div className="rounded-xl border border-slate-100 px-4 py-3">
                <NotificationBell />
              </div>

              <button
                type="button"
                onClick={logout}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 font-semibold text-red-600 transition hover:bg-red-50"
              >
                <LogOut size={19} />
                Logout
              </button>

            </div>
          </div>
        )}
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 sm:py-7 lg:px-8">

        {/* =========================================================
            HERO
        ========================================================== */}
        <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#031b4e] via-[#063d92] to-[#0878ed] shadow-2xl shadow-blue-200">

          {/* Decorative elements */}
          <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-blue-300/20 blur-3xl" />
          <div className="pointer-events-none absolute right-1/3 top-1/2 h-40 w-40 rounded-full bg-white/10 blur-3xl" />

          <div className="relative z-10 grid gap-8 px-5 py-7 sm:px-8 sm:py-9 lg:grid-cols-[1.4fr_.6fr] lg:px-10 lg:py-11">

            <div className="min-w-0">

              <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold text-blue-50 backdrop-blur">
                <Sparkles size={14} className="shrink-0 text-cyan-200" />
                <span className="truncate">
                  Welcome to CareCube
                </span>
              </div>

              <h1 className="mt-5 max-w-2xl text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl xl:text-6xl">
                Your healthcare.
                <span className="block text-cyan-200">
                  Simplified.
                </span>
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-blue-100 sm:text-base">
                Find verified doctors, discover nearby centres, book
                appointments and stay updated with your healthcare journey —
                all from one simple platform.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">

                <Link
                  to="/explore"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-black text-[#063b8e] shadow-xl transition duration-200 hover:-translate-y-0.5 hover:shadow-2xl"
                >
                  <Search size={18} />
                  Explore Doctors
                  <ArrowRight size={16} />
                </Link>

                <Link
                  to="/patient/appointments"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3.5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/15"
                >
                  <CalendarDays size={18} />
                  My Appointments
                </Link>

              </div>

              {/* Hero trust points */}
              <div className="mt-7 flex flex-wrap gap-x-5 gap-y-3 text-xs font-semibold text-blue-100">

                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-cyan-200" />
                  Verified Doctors
                </div>

                <div className="flex items-center gap-2">
                  <ShieldCheck size={15} className="text-cyan-200" />
                  Trusted Centres
                </div>

                <div className="flex items-center gap-2">
                  <Zap size={15} className="text-cyan-200" />
                  Easy Booking
                </div>

              </div>
            </div>

            {/* Hero visual */}
            <div className="hidden lg:flex lg:items-center lg:justify-end">

              <div className="w-full max-w-sm rounded-[28px] border border-white/15 bg-white/10 p-4 shadow-2xl backdrop-blur-xl">

                <div className="rounded-2xl bg-white p-4 shadow-xl">

                  <div className="flex items-center gap-4">

                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                      <HeartPulse size={29} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-500">
                        CareCube Health
                      </p>

                      <p className="mt-1 text-lg font-black text-slate-900">
                        Care made simple
                      </p>
                    </div>

                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">

                  <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                    <Stethoscope
                      size={22}
                      className="text-cyan-200"
                    />
                    <p className="mt-3 text-xs font-semibold text-blue-100">
                      Verified Doctors
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                    <Hospital
                      size={22}
                      className="text-blue-100"
                    />
                    <p className="mt-3 text-xs font-semibold text-blue-100">
                      Nearby Centres
                    </p>
                  </div>

                </div>

                <div className="mt-3 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 p-4">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-cyan-200">
                    <CalendarCheck2 size={19} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white">
                      Healthcare journey
                    </p>
                    <p className="mt-0.5 text-[11px] text-blue-100">
                      Find • Book • Track
                    </p>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            STAT CARDS
        ========================================================== */}
        <section className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3">

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <CalendarDays size={19} />
              </div>

              <div className="min-w-0">
                <p className="text-xl font-black text-slate-900">
                  {loadingAppointments ? "—" : stats.total}
                </p>

                <p className="truncate text-xs font-medium text-slate-500">
                  Appointments
                </p>
              </div>

            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Activity size={19} />
              </div>

              <div className="min-w-0">
                <p className="text-xl font-black text-slate-900">
                  {loadingAppointments ? "—" : stats.active}
                </p>

                <p className="truncate text-xs font-medium text-slate-500">
                  Active
                </p>
              </div>

            </div>
          </div>

          <div className="col-span-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:col-span-1 sm:p-5">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <CheckCircle2 size={19} />
              </div>

              <div className="min-w-0">
                <p className="text-xl font-black text-slate-900">
                  {loadingAppointments ? "—" : stats.completed}
                </p>

                <p className="truncate text-xs font-medium text-slate-500">
                  Completed
                </p>
              </div>

            </div>
          </div>

        </section>

        {/* =========================================================
            QUICK ACTIONS
        ========================================================== */}
        <section className="mt-6">

          <div className="mb-4">
            <p className="text-[11px] font-black uppercase tracking-[0.15em] text-blue-600">
              Quick access
            </p>

            <h2 className="mt-1 text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
              What would you like to do?
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <Link
              to="/explore"
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
            >

              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-blue-50 transition group-hover:scale-125" />

              <div className="relative flex items-center justify-between">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                  <Search size={21} />
                </div>

                <ArrowRight
                  size={18}
                  className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600"
                />
              </div>

              <h3 className="relative mt-4 font-black text-slate-900">
                Find a Doctor
              </h3>

              <p className="relative mt-1 text-sm leading-6 text-slate-500">
                Search doctors by speciality and location.
              </p>
            </Link>

            <Link
              to="/patient/appointments"
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl"
            >

              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-emerald-50 transition group-hover:scale-125" />

              <div className="relative flex items-center justify-between">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition group-hover:bg-emerald-600 group-hover:text-white">
                  <CalendarDays size={21} />
                </div>

                <ArrowRight
                  size={18}
                  className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-emerald-600"
                />
              </div>

              <h3 className="relative mt-4 font-black text-slate-900">
                Appointments
              </h3>

              <p className="relative mt-1 text-sm leading-6 text-slate-500">
                View and manage your appointments.
              </p>
            </Link>

            <Link
              to="/explore"
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl"
            >

              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-violet-50 transition group-hover:scale-125" />

              <div className="relative flex items-center justify-between">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600 transition group-hover:bg-violet-600 group-hover:text-white">
                  <Hospital size={21} />
                </div>

                <ArrowRight
                  size={18}
                  className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-violet-600"
                />
              </div>

              <h3 className="relative mt-4 font-black text-slate-900">
                Explore Centres
              </h3>

              <p className="relative mt-1 text-sm leading-6 text-slate-500">
                Discover clinics and chambers near you.
              </p>
            </Link>

            <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-amber-50" />

              <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <ShieldCheck size={21} />
              </div>

              <h3 className="relative mt-4 font-black text-slate-900">
                Verified Care
              </h3>

              <p className="relative mt-1 text-sm leading-6 text-slate-500">
                Discover verified doctors on CareCube.
              </p>
            </div>

          </div>
        </section>

        {/* =========================================================
            RECENT APPOINTMENTS
        ========================================================== */}
        <section className="mt-10">

          <div className="mb-5 flex items-end justify-between gap-4">

            <div className="min-w-0">
              <p className="text-[11px] font-black uppercase tracking-[0.15em] text-blue-600">
                Your activity
              </p>

              <h2 className="mt-1 text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
                Recent appointments
              </h2>
            </div>

            <Link
              to="/patient/appointments"
              className="hidden shrink-0 items-center gap-1 text-sm font-bold text-blue-600 transition hover:text-blue-800 sm:flex"
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
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 animate-pulse rounded-xl bg-slate-200" />

                    <div className="flex-1">
                      <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />
                      <div className="mt-2 h-3 w-20 animate-pulse rounded bg-slate-200" />
                    </div>
                  </div>

                  <div className="mt-6 h-3 w-32 animate-pulse rounded bg-slate-200" />
                  <div className="mt-5 h-8 w-28 animate-pulse rounded-full bg-slate-200" />
                </div>
              ))}

            </div>

          ) : displayedAppointments.length > 0 ? (

            <div className="grid gap-4 md:grid-cols-3">

              {displayedAppointments.map((appt) => {

                const status = getStatus(appt.status);
                const StatusIcon = status.icon;

                return (
                  <div
                    key={appt._id}
                    className="group min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
                  >

                    <div className="flex min-w-0 items-start justify-between gap-3">

                      <div className="flex min-w-0 items-center gap-3">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                          <UserRound size={20} />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate font-black text-slate-900">
                            Dr. {appt.doctorId?.name || "Doctor"}
                          </p>

                          <p className="mt-0.5 truncate text-xs text-slate-500">
                            {appt.centreId?.name || "Centre unavailable"}
                          </p>
                        </div>

                      </div>

                      <span className="shrink-0 rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-slate-500">
                        #{appt.tokenNumber || "--"}
                      </span>

                    </div>

                    <div className="mt-5 rounded-xl bg-slate-50 p-3">

                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                        <CalendarDays
                          size={16}
                          className="shrink-0 text-blue-500"
                        />
                        <span className="truncate">
                          {formatDate(appt.appointmentDate)}
                        </span>
                      </div>

                      {formatTime(appt.appointmentDate) && (
                        <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                          <Clock3 size={14} />
                          {formatTime(appt.appointmentDate)}
                        </div>
                      )}

                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3">

                      <span
                        className={`inline-flex max-w-full items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold ${status.cls}`}
                      >
                        <StatusIcon size={14} className="shrink-0" />
                        <span className="truncate">
                          {status.label}
                        </span>
                      </span>

                      <span className="flex shrink-0 items-center gap-1 text-[11px] font-semibold text-slate-400">
                        <Heart size={12} />
                        CareCube
                      </span>

                    </div>
                  </div>
                );
              })}

            </div>

          ) : (

            <div className="overflow-hidden rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center sm:p-10">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <CalendarDays size={28} />
              </div>

              <h3 className="mt-5 text-lg font-black text-slate-900">
                No appointments yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Find a doctor and book your first appointment through
                CareCube.
              </p>

              <Link
                to="/explore"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                Find a Doctor
                <ArrowRight size={16} />
              </Link>

            </div>
          )}

          <Link
            to="/patient/appointments"
            className="mt-4 flex items-center justify-center gap-1 text-sm font-bold text-blue-600 sm:hidden"
          >
            View all appointments
            <ChevronRight size={17} />
          </Link>
        </section>

        {/* =========================================================
            DOCTOR SEARCH
        ========================================================== */}
        <section className="mt-10">

          <div className="relative overflow-hidden rounded-[28px] border border-blue-100 bg-white p-5 shadow-sm sm:p-7">

            <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-blue-50" />

            <div className="relative">

              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-black text-blue-700">
                <Stethoscope size={15} />
                Doctor discovery
              </div>

              <h2 className="mt-4 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                Find the right doctor
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Search for verified doctors by name and explore their
                associated chambers.
              </p>

              <form
                onSubmit={search}
                className="mt-6 flex flex-col gap-3 lg:flex-row"
              >

                <div className="relative min-w-0 flex-1">

                  <Search
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    placeholder="Search doctor by name..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="h-14 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loadingDoctors}
                  className="flex h-14 shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 text-sm font-black text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
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
                  className="flex h-14 shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 text-sm font-black text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                >
                  Advanced Explore
                  <ArrowRight size={16} />
                </Link>

              </form>
            </div>
          </div>
        </section>

        {/* =========================================================
            SEARCH ERROR
        ========================================================== */}
        {searchError && (
          <section className="mt-5">
            <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
              <XCircle size={19} className="mt-0.5 shrink-0" />
              <p className="break-words">
                {searchError}
              </p>
            </div>
          </section>
        )}

        {/* =========================================================
            NO RESULTS
        ========================================================== */}
        {searched &&
          !loadingDoctors &&
          doctors.length === 0 &&
          !searchError && (
            <section className="mt-6">

              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm sm:p-10">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                  <Search size={27} />
                </div>

                <h3 className="mt-5 text-lg font-black text-slate-900">
                  No verified doctors found
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Try another doctor name or use Advanced Explore.
                </p>

                <Link
                  to="/explore"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700"
                >
                  Explore Doctors
                  <ArrowRight size={16} />
                </Link>

              </div>
            </section>
          )}

        {/* =========================================================
            SEARCH RESULTS
        ========================================================== */}
        {doctors.length > 0 && (
          <section className="mt-7">

            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

              <div className="min-w-0">
                <p className="text-[11px] font-black uppercase tracking-[0.15em] text-blue-600">
                  Search results
                </p>

                <h2 className="mt-1 text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
                  Doctors available for you
                </h2>
              </div>

              <span className="w-fit rounded-full bg-blue-50 px-3 py-1.5 text-xs font-black text-blue-700">
                {doctors.length} found
              </span>

            </div>

            <div className="grid gap-5 lg:grid-cols-2">

              {doctors.map((doctor) => (

                <article
                  key={doctor._id}
                  className="group min-w-0 overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-2xl"
                >

                  {/* Doctor top */}
                  <div className="relative overflow-hidden bg-gradient-to-br from-[#031b4e] to-[#0878ed] p-5 sm:p-6">

                    <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-cyan-300/20 blur-2xl" />

                    <div className="relative flex min-w-0 items-start gap-4">

                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-cyan-200 ring-1 ring-white/10">
                        <Stethoscope size={27} />
                      </div>

                      <div className="min-w-0 flex-1">

                        <div className="flex flex-wrap items-center gap-2">

                          <h3 className="min-w-0 break-words text-lg font-black text-white">
                            Dr. {doctor.name}
                          </h3>

                          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-white/10 px-2 py-1 text-[10px] font-black text-cyan-100">
                            <BadgeCheck size={12} />
                            Verified
                          </span>

                        </div>

                        <p className="mt-1 break-words text-sm font-bold text-cyan-200">
                          {doctor.specialization ||
                            "General Physician"}
                        </p>

                        {doctor.qualification && (
                          <p className="mt-1 break-words text-xs text-blue-100">
                            {doctor.qualification}
                          </p>
                        )}

                        <div className="mt-3 flex flex-wrap gap-2">

                          <span className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-2.5 py-1 text-[10px] font-bold text-blue-100">
                            <ShieldCheck size={12} />
                            Trusted
                          </span>

                          {doctor.experience && (
                            <span className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-2.5 py-1 text-[10px] font-bold text-blue-100">
                              <Star size={12} />
                              {doctor.experience}
                            </span>
                          )}

                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Chambers */}
                  <div className="p-5 sm:p-6">

                    <div className="flex items-center justify-between gap-3">

                      <div className="flex min-w-0 items-center gap-2">
                        <Hospital
                          size={17}
                          className="shrink-0 text-blue-600"
                        />

                        <h4 className="truncate text-sm font-black text-slate-900">
                          Associated chambers
                        </h4>
                      </div>

                      <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black text-slate-500">
                        {doctor.chambers?.length || 0} centre
                        {doctor.chambers?.length === 1 ? "" : "s"}
                      </span>
                    </div>

                    <div className="mt-4 space-y-3">

                      {(doctor.chambers || []).map((centre) => (

                        <div
                          key={centre._id}
                          className="group/centre rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-blue-200 hover:bg-blue-50/40"
                        >

                          <div className="flex min-w-0 items-start gap-3">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                              <MapPin size={17} />
                            </div>

                            <div className="min-w-0 flex-1">

                              <p className="break-words font-black text-slate-900">
                                {centre.name}
                              </p>

                              <p className="mt-1 break-words text-xs leading-5 text-slate-500">
                                {centre.address ||
                                  "Address unavailable"}
                              </p>

                              <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-blue-600">
                                <Navigation size={11} />
                                CareCube Centre
                              </div>

                            </div>

                          </div>
                        </div>
                      ))}

                      {(!doctor.chambers ||
                        doctor.chambers.length === 0) && (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center">

                          <Hospital
                            size={24}
                            className="mx-auto text-slate-400"
                          />

                          <p className="mt-2 text-sm font-bold text-slate-500">
                            No associated centre yet
                          </p>
                        </div>
                      )}
                    </div>

                    <Link
                      to={`/doctor/${doctor._id}`}
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl"
                    >
                      View Profile & Book
                      <ArrowRight size={17} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* =========================================================
            TRUST / CTA
        ========================================================== */}
        <section className="mt-10 mb-6">

          <div className="relative overflow-hidden rounded-[28px] border border-blue-100 bg-gradient-to-r from-blue-50 via-white to-cyan-50 p-5 shadow-sm sm:p-7">

            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-blue-100/60 blur-2xl" />

            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex min-w-0 items-start gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200">
                  <ShieldCheck size={23} />
                </div>

                <div className="min-w-0">

                  <h3 className="break-words text-base font-black text-slate-900 sm:text-lg">
                    Your healthcare journey, in one place
                  </h3>

                  <p className="mt-1 max-w-2xl break-words text-xs leading-6 text-slate-500 sm:text-sm">
                    Search doctors, discover centres, manage appointments
                    and stay updated with your queue.
                  </p>

                </div>
              </div>

              <Link
                to="/explore"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                Explore CareCube
                <ArrowRight size={16} />
              </Link>

            </div>
          </div>
        </section>
      </main>

      {/* =========================================================
          FOOTER
      ========================================================== */}
      <footer className="border-t border-slate-200 bg-white">

        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-7 text-center sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:text-left">

          <div>
            <p className="text-xs font-semibold text-slate-400">
              © {new Date().getFullYear()} CareCube
            </p>

            <p className="mt-1 text-[11px] text-slate-400">
              Healthcare made simpler.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3">

            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-[11px] font-bold text-blue-600">
              <HeartPulse size={13} />
              Find
            </span>

            <span className="text-slate-300">•</span>

            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-bold text-emerald-600">
              <CalendarCheck2 size={13} />
              Book
            </span>

            <span className="text-slate-300">•</span>

            <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1.5 text-[11px] font-bold text-violet-600">
              <Activity size={13} />
              Track
            </span>

          </div>
        </div>
      </footer>
    </div>
  );
}

export default PatientDashboard;