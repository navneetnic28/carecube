import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BadgeCheck,
  BookOpen,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  GraduationCap,
  HeartPulse,
  Hospital,
  MapPin,
  Navigation,
  ShieldCheck,
  Sparkles,
  Star,
  Stethoscope,
  Users,
  XCircle,
} from "lucide-react";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import StatusBadge from "../components/StatusBadge";
import Footer from "../components/Footer";
import BookingFlow from "../components/BookingFlow";
import { getUpcomingDatesForSchedule } from "../utils/scheduleDates";
import Logo from "../components/Logo";

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const HIGHLIGHTS = [
  "Clean & Safe Environment",
  "Modern Treatment Facilities",
  "Patient Friendly Staff",
  "Easy Appointment Booking",
];

const TABS = [
  { key: "about", label: "About", icon: HeartPulse },
  { key: "experience", label: "Experience", icon: Award },
  { key: "education", label: "Education", icon: GraduationCap },
  { key: "reviews", label: "Reviews", icon: Star },
];

function Stars({ value = 0, size = 16 }) {
  const rating = Math.max(0, Math.min(5, Math.round(Number(value) || 0)));

  return (
    <span
      className="inline-flex items-center gap-0.5"
      aria-label={`${rating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          strokeWidth={1.8}
          className={
            star <= rating
              ? "fill-amber-400 text-amber-400"
              : "text-slate-300"
          }
        />
      ))}
    </span>
  );
}

function SectionHeading({ icon: Icon, eyebrow, title, description }) {
  return (
    <div className="mb-6 min-w-0">
      {eyebrow && (
        <span className="mb-2 inline-flex max-w-full items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-blue-700 sm:text-[11px]">
          <Sparkles size={13} className="shrink-0" />
          <span className="truncate">{eyebrow}</span>
        </span>
      )}

      <h2 className="flex min-w-0 items-center gap-2 text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
        {Icon && <Icon size={22} className="shrink-0 text-blue-600" />}
        <span className="break-words">{title}</span>
      </h2>

      {description && (
        <p className="mt-2 max-w-3xl break-words text-sm leading-6 text-slate-500">
          {description}
        </p>
      )}
    </div>
  );
}

function InfoPill({ icon: Icon, children }) {
  return (
    <span className="inline-flex min-w-0 max-w-full items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 shadow-sm">
      <Icon size={15} className="shrink-0 text-blue-600" />
      <span className="min-w-0 truncate">{children}</span>
    </span>
  );
}

function DoctorProfile() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [chambers, setChambers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("about");
  const [bookingCentreId, setBookingCentreId] = useState("");
  const [showFullBio, setShowFullBio] = useState(false);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const load = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await api.get(`/doctors/${id}`);

      setDoctor(res.data.doctor);
      setChambers(res.data.chambers || []);
      setReviews(res.data.reviews || []);
    } catch (err) {
      setError(err.response?.data?.message || "Doctor not found");
    } finally {
      setLoading(false);
    }
  };

  const startBooking = (centreId) => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== "patient") {
      alert("Only patient accounts can book appointments.");
      return;
    }

    setBookingCentreId(centreId);
  };

  const availableDays = useMemo(() => {
    return chambers
      .flatMap(({ centre, schedule = [] }) =>
        getUpcomingDatesForSchedule(schedule, 3, 14).map((d) => ({
          date: d.date,
          centre,
          slots: schedule.filter(
            (s) => s.day === DAY_NAMES[d.date.getDay()]
          ),
        }))
      )
      .sort((a, b) => a.date - b.date)
      .slice(0, 6);
  }, [chambers]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
            <Logo size="md" />
            <div className="h-9 w-28 animate-pulse rounded-xl bg-slate-100" />
          </div>
        </header>

        <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
          <div className="h-7 w-40 animate-pulse rounded-lg bg-slate-200" />

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div className="h-80 animate-pulse rounded-[2rem] bg-white shadow-sm" />
            <div className="h-80 animate-pulse rounded-[2rem] bg-white shadow-sm" />
          </div>

          <div className="h-72 animate-pulse rounded-[2rem] bg-white shadow-sm" />
        </main>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
            <Logo size="md" />
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Back to Explore</span>
              <span className="sm:hidden">Back</span>
            </Link>
          </div>
        </header>

        <main className="flex flex-1 items-center justify-center px-4 py-16">
          <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-200/50">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <XCircle size={32} />
            </div>

            <h1 className="mt-5 text-2xl font-black text-slate-900">
              Doctor not found
            </h1>

            <p className="mt-2 break-words text-sm leading-6 text-slate-500">
              {error || "We couldn't load this doctor's profile."}
            </p>

            <Link
              to="/explore"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-blue-700"
            >
              Explore Doctors
              <ArrowRight size={16} />
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  const primary = chambers[0];

  const anyAvailable = chambers.some(
    (c) =>
      c.todayStatus?.status !== "unavailable" &&
      c.todayStatus?.status !== "holiday"
  );

  const primaryTimes = primary?.schedule?.[0]
    ? `${primary.schedule[0].startTime} – ${primary.schedule[0].endTime}`
    : null;

  const tags = doctor.specializationTags || [];

  const educationLines = (doctor.education || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const bookingChamber = chambers.find(
    (c) => c.centre?._id === bookingCentreId
  );

  const rating = Number(doctor.avgRating || 0);
  const reviewCount = Number(
    doctor.reviewCount || reviews.length || 0
  );

  const bio =
    doctor.bio ||
    `Dr. ${doctor.name} is a ${
      doctor.specialization || "doctor"
    } at CareCube.`;

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <Logo size="md" />

          <Link
            to="/explore"
            className="group inline-flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 sm:px-4"
          >
            <ArrowLeft
              size={16}
              className="transition group-hover:-translate-x-0.5"
            />
            <span className="hidden sm:inline">Back to Doctors</span>
            <span className="sm:hidden">Back</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5 flex min-w-0 items-center gap-2 overflow-hidden text-xs font-medium text-slate-500 sm:text-sm"
        >
          <Link
            to="/explore"
            className="shrink-0 hover:text-blue-600"
          >
            Doctors
          </Link>

          <ChevronRight size={14} className="shrink-0" />

          <span className="truncate text-slate-800">
            Dr. {doctor.name}
          </span>
        </motion.div>

        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-200/50"
        >
          <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-br from-blue-50 via-sky-50 to-white" />
          <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-blue-300/20 blur-3xl" />

          <div className="relative grid gap-6 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_330px] lg:p-8">
            <div className="min-w-0">
              <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-start">
                {doctor.photoUrl ? (
                  <img
                    src={doctor.photoUrl}
                    alt={doctor.name}
                    className="h-28 w-28 shrink-0 rounded-3xl object-cover shadow-lg ring-4 ring-white sm:h-32 sm:w-32"
                  />
                ) : (
                  <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500 to-blue-800 text-4xl font-black text-white shadow-lg ring-4 ring-white sm:h-32 sm:w-32">
                    {doctor.name?.[0]?.toUpperCase()}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {doctor.verificationStatus === "verified" ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-[10px] font-extrabold text-blue-700 sm:text-xs">
                        <BadgeCheck size={14} />
                        VERIFIED DOCTOR
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold text-slate-600 sm:text-xs">
                        Verification pending
                      </span>
                    )}

                    {anyAvailable && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-[10px] font-bold text-green-700 sm:text-xs">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                        Available today
                      </span>
                    )}
                  </div>

                  <h1 className="mt-3 break-words text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                    Dr. {doctor.name}
                  </h1>

                  <p className="mt-1 flex min-w-0 items-center gap-2 break-words text-base font-bold text-blue-600 sm:text-lg">
                    <Stethoscope size={19} className="shrink-0" />
                    <span className="break-words">
                      {doctor.specialization || "Medical Specialist"}
                    </span>
                  </p>

                  <div className="mt-4 flex min-w-0 flex-wrap gap-2">
                    {rating > 0 && (
                      <InfoPill icon={Star}>
                        <span className="font-bold text-slate-800">
                          {rating.toFixed(1)}
                        </span>{" "}
                        ({reviewCount} reviews)
                      </InfoPill>
                    )}

                    {doctor.experience && (
                      <InfoPill icon={Award}>
                        {doctor.experience} Experience
                      </InfoPill>
                    )}

                    {primary && (
                      <InfoPill icon={MapPin}>
                        {primary.centre.city ||
                          primary.centre.address}
                      </InfoPill>
                    )}
                  </div>

                  {tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {tags.slice(0, 7).map((tag) => (
                        <span
                          key={tag}
                          className="max-w-full break-words rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {primary && (
                <div className="mt-6 flex min-w-0 flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex min-w-0 items-center gap-2 text-sm font-bold text-slate-900">
                      <Building2
                        size={17}
                        className="shrink-0 text-blue-600"
                      />
                      <span className="truncate">
                        {primary.centre.name}
                      </span>
                    </div>

                    <p className="mt-1 flex min-w-0 items-start gap-2 text-xs leading-5 text-slate-500">
                      <MapPin
                        size={14}
                        className="mt-0.5 shrink-0"
                      />
                      <span className="break-words">
                        {primary.centre.address}
                        {primary.centre.city
                          ? `, ${primary.centre.city}`
                          : ""}
                      </span>
                    </p>
                  </div>

                  <Link
                    to={`/centre/${primary.centre._id}`}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-700"
                  >
                    View Clinic
                    <ArrowRight size={14} />
                  </Link>
                </div>
              )}
            </div>

            {/* Booking card */}
            <div className="min-w-0 lg:self-start">
              <div className="rounded-3xl bg-gradient-to-br from-[#032b86] via-[#0648c8] to-[#0879f9] p-5 text-white shadow-xl shadow-blue-200/50 sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-100">
                      Consultation
                    </p>

                    <p className="mt-1 text-3xl font-black">
                      {doctor.consultationFee > 0
                        ? `₹${doctor.consultationFee}`
                        : "Ask clinic"}
                    </p>
                  </div>

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white">
                    <HeartPulse size={23} />
                  </div>
                </div>

                <div className="my-5 h-px bg-white/15" />

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Clock3
                      size={18}
                      className="mt-0.5 shrink-0 text-blue-100"
                    />

                    <div className="min-w-0">
                      <p className="text-xs text-blue-100/80">
                        Available time
                      </p>
                      <p className="mt-0.5 break-words text-sm font-bold">
                        {primaryTimes ||
                          "Check clinic schedule"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    {anyAvailable ? (
                      <CheckCircle2
                        size={18}
                        className="mt-0.5 shrink-0 text-green-300"
                      />
                    ) : (
                      <XCircle
                        size={18}
                        className="mt-0.5 shrink-0 text-red-300"
                      />
                    )}

                    <div>
                      <p className="text-xs text-blue-100/80">
                        Today's status
                      </p>
                      <p
                        className={`mt-0.5 text-sm font-bold ${
                          anyAvailable
                            ? "text-green-200"
                            : "text-red-200"
                        }`}
                      >
                        {anyAvailable
                          ? "Appointments available"
                          : "Not available today"}
                      </p>
                    </div>
                  </div>
                </div>

                {primary && (
                  <button
                    type="button"
                    onClick={() =>
                      startBooking(primary.centre._id)
                    }
                    disabled={!anyAvailable}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3.5 text-sm font-extrabold text-blue-700 shadow-lg transition hover:bg-blue-50 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-white/20 disabled:text-white/50 disabled:shadow-none"
                  >
                    <CalendarDays size={18} />
                    Book Appointment
                    <ArrowRight size={17} />
                  </button>
                )}

                <p className="mt-3 text-center text-[11px] leading-5 text-blue-100">
                  Secure appointment booking through CareCube
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Available days */}
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="mt-6 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/40 sm:p-7"
        >
          <SectionHeading
            icon={CalendarDays}
            eyebrow="Schedule"
            title="Upcoming Available Days"
            description={`Dr. ${doctor.name} is available on these upcoming dates across the listed chambers.`}
          />

          {availableDays.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <CalendarDays
                className="mx-auto text-slate-400"
                size={30}
              />
              <p className="mt-3 text-sm font-semibold text-slate-600">
                No schedule published yet.
              </p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {availableDays.map((day, index) => (
                <motion.div
                  key={`${day.date.toISOString()}-${
                    day.centre?._id || index
                  }`}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.04 }}
                  className="min-w-0 rounded-2xl border border-slate-200 bg-slate-50/60 p-4 transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50/30 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-extrabold text-slate-900">
                        {DAY_NAMES[day.date.getDay()]}
                      </p>
                      <p className="mt-1 text-xs font-medium text-slate-500">
                        {day.date.toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>

                    <span className="shrink-0 rounded-full bg-blue-100 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-blue-700">
                      Available
                    </span>
                  </div>

                  <div className="mt-4 flex min-w-0 items-start gap-2 text-xs text-slate-600">
                    <MapPin
                      size={14}
                      className="mt-0.5 shrink-0 text-blue-600"
                    />
                    <span className="line-clamp-2 break-words font-medium">
                      {day.centre?.name}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {day.slots.map((slot) => (
                      <span
                        key={slot._id}
                        className="max-w-full break-words rounded-lg bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 shadow-sm ring-1 ring-slate-200"
                      >
                        {slot.startTime} – {slot.endTime}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>

        {/* Profile Tabs */}
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.12 }}
          className="mt-6 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-lg shadow-slate-200/40"
        >
          <div className="overflow-x-auto border-b border-slate-200 px-3 pt-3 sm:px-5">
            <div className="flex min-w-max gap-1">
              {TABS.map(({ key, label, icon: Icon }) => {
                const active = tab === key;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setTab(key)}
                    className={`inline-flex shrink-0 items-center gap-2 rounded-t-2xl px-4 py-3 text-sm font-bold transition sm:px-5 ${
                      active
                        ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                        : "text-slate-500 hover:bg-blue-50 hover:text-blue-700"
                    }`}
                  >
                    <Icon size={16} />
                    {label}

                    {key === "reviews" && (
                      <span
                        className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                          active
                            ? "bg-white/15 text-white"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {reviews.length}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="min-w-0 p-5 sm:p-7">
            <AnimatePresence mode="wait">
              {/* ABOUT */}
              {tab === "about" && (
                <motion.div
                  key="about"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="min-w-0"
                >
                  <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_290px]">
                    {/* Main description */}
                    <div className="min-w-0 overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-white to-blue-50/70 p-5 shadow-sm sm:p-6">
                      <div className="flex min-w-0 items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200">
                          <BookOpen size={21} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-blue-600 sm:text-[11px]">
                            Doctor Profile
                          </span>

                          <h3 className="mt-1 break-words text-xl font-black text-slate-900 sm:text-2xl">
                            About Dr. {doctor.name}
                          </h3>
                        </div>
                      </div>

                      <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 p-4 sm:p-5">
                        <p
                          className={`break-words whitespace-pre-line text-sm leading-7 text-slate-600 sm:text-[15px] ${
                            showFullBio ? "" : "line-clamp-6"
                          }`}
                          style={{ overflowWrap: "anywhere" }}
                        >
                          {bio}
                        </p>

                        {bio.length > 420 && (
                          <button
                            type="button"
                            onClick={() =>
                              setShowFullBio((value) => !value)
                            }
                            className="mt-3 inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-extrabold text-blue-600 transition hover:bg-blue-50"
                          >
                            {showFullBio
                              ? "Show less"
                              : "Read full profile"}

                            <ChevronRight
                              size={14}
                              className={`transition-transform ${
                                showFullBio ? "rotate-90" : ""
                              }`}
                            />
                          </button>
                        )}
                      </div>

                      {/* Trust cards */}
                      <div className="mt-4 grid gap-2 sm:grid-cols-3">
                        {[
                          [
                            "Verified",
                            "Trusted profile",
                            BadgeCheck,
                          ],
                          [
                            "Personalized",
                            "Patient-focused care",
                            HeartPulse,
                          ],
                          [
                            "Easy booking",
                            "Simple appointment flow",
                            CalendarDays,
                          ],
                        ].map(([title, subtitle, Icon]) => (
                          <div
                            key={title}
                            className="flex min-w-0 items-center gap-2 rounded-2xl bg-slate-50 p-3"
                          >
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                              <Icon size={17} />
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-xs font-extrabold text-slate-800">
                                {title}
                              </p>
                              <p className="truncate text-[10px] text-slate-500">
                                {subtitle}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quick overview */}
                    <div className="min-w-0 overflow-hidden rounded-3xl bg-gradient-to-br from-[#032b86] via-[#0648c8] to-[#0879f9] p-5 text-white shadow-xl shadow-blue-200/50 sm:p-6">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
                        <Stethoscope size={22} />
                      </div>

                      <p className="mt-5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-blue-100 sm:text-[11px]">
                        Quick overview
                      </p>

                      <h4 className="mt-1 break-words text-lg font-black">
                        Your care, simplified
                      </h4>

                      <div className="mt-5 space-y-3">
                        {[
                          [
                            "Specialization",
                            doctor.specialization ||
                              "Medical Specialist",
                          ],
                          [
                            "Experience",
                            doctor.experience ||
                              "Not specified",
                          ],
                          [
                            "Qualification",
                            doctor.qualification ||
                              "Not specified",
                          ],
                        ].map(([label, value]) => (
                          <div
                            key={label}
                            className="min-w-0 rounded-2xl bg-white/10 p-3"
                          >
                            <p className="text-[10px] font-bold uppercase tracking-wide text-blue-100">
                              {label}
                            </p>

                            <p
                              className="mt-1 break-words text-sm font-bold text-white"
                              style={{ overflowWrap: "anywhere" }}
                            >
                              {value}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Specializations */}
                  {tags.length > 0 && (
                    <div className="mt-5 min-w-0 overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                          <Award size={19} />
                        </div>

                        <div className="min-w-0">
                          <h4 className="text-base font-black text-slate-900">
                            Areas of Specialization
                          </h4>
                          <p className="text-xs text-slate-500">
                            Expertise and clinical focus areas
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {tags.map((tag) => (
                          <span
                            key={tag}
                            className="max-w-full break-words rounded-full border border-blue-100 bg-blue-50 px-3.5 py-2 text-xs font-bold text-blue-700"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Friendly CTA */}
                  <div className="mt-5 overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-r from-blue-50 via-white to-blue-50 p-5 sm:p-6">
                    <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200">
                        <ShieldCheck size={23} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4 className="break-words text-sm font-black text-slate-900 sm:text-base">
                          Your health, our priority
                        </h4>

                        <p className="mt-1 break-words text-xs leading-6 text-slate-600 sm:text-sm">
                          Book an appointment with Dr. {doctor.name} for
                          personalized consultation, guidance and follow-up
                          care through CareCube.
                        </p>
                      </div>

                      {primary && (
                        <button
                          type="button"
                          onClick={() =>
                            startBooking(primary.centre._id)
                          }
                          disabled={!anyAvailable}
                          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-extrabold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          Book Now
                          <ArrowRight size={15} />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* EXPERIENCE */}
              {tab === "experience" && (
                <motion.div
                  key="experience"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="min-w-0"
                >
                  <SectionHeading
                    icon={Award}
                    eyebrow="Professional Journey"
                    title="Experience"
                    description="A clear overview of the doctor's professional expertise."
                  />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5">
                      <p className="text-xs font-bold uppercase tracking-wide text-blue-500">
                        Experience
                      </p>
                      <p className="mt-2 break-words text-xl font-black text-slate-900">
                        {doctor.experience || "Not specified"}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                        Specialization
                      </p>
                      <p className="mt-2 break-words text-xl font-black text-slate-900">
                        {doctor.specialization ||
                          "Patient Care"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    {[
                      doctor.experience &&
                        `${doctor.experience} of ${
                          doctor.specialization || "clinical"
                        } experience`,
                      "Patient Consultation & Follow-up",
                      "Personalized Treatment Planning",
                    ]
                      .filter(Boolean)
                      .map((item) => (
                        <div
                          key={item}
                          className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4"
                        >
                          <CheckCircle2
                            size={18}
                            className="mt-0.5 shrink-0 text-blue-600"
                          />
                          <p className="break-words text-sm leading-6 text-slate-600">
                            {item}
                          </p>
                        </div>
                      ))}
                  </div>
                </motion.div>
              )}

              {/* EDUCATION */}
              {tab === "education" && (
                <motion.div
                  key="education"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="min-w-0"
                >
                  <SectionHeading
                    icon={GraduationCap}
                    eyebrow="Qualifications"
                    title="Education & Qualifications"
                    description="Academic background and qualifications added to the profile."
                  />

                  <div className="space-y-3">
                    {[
                      doctor.qualification,
                      ...educationLines,
                    ]
                      .filter(Boolean)
                      .map((item, index) => (
                        <div
                          key={`${item}-${index}`}
                          className="flex min-w-0 items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4"
                        >
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                            <GraduationCap size={18} />
                          </div>

                          <p className="min-w-0 break-words pt-1 text-sm font-semibold leading-6 text-slate-700">
                            {item}
                          </p>
                        </div>
                      ))}

                    {!doctor.qualification &&
                      educationLines.length === 0 && (
                        <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-400">
                          Education details not added yet.
                        </div>
                      )}
                  </div>
                </motion.div>
              )}

              {/* REVIEWS */}
              {tab === "reviews" && (
                <motion.div
                  key="reviews"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="min-w-0"
                >
                  <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <SectionHeading
                      icon={Star}
                      eyebrow="Patient Feedback"
                      title="Patient Reviews"
                      description="Reviews from patients after completed visits."
                    />

                    {rating > 0 && (
                      <div className="flex shrink-0 items-center gap-3 rounded-2xl bg-amber-50 px-4 py-3">
                        <div className="text-2xl font-black text-slate-900">
                          {rating.toFixed(1)}
                        </div>

                        <div>
                          <Stars value={rating} size={14} />
                          <p className="mt-1 text-[11px] font-medium text-slate-500">
                            {reviewCount} review
                            {reviewCount !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {reviews.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                      <Star
                        className="mx-auto text-slate-300"
                        size={32}
                      />
                      <p className="mt-3 text-sm font-semibold text-slate-500">
                        No reviews yet.
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        Reviews appear after patients complete a visit.
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-3 md:grid-cols-2">
                      {reviews.map((review) => (
                        <div
                          key={review._id}
                          className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <Stars
                              value={review.rating}
                              size={15}
                            />

                            <span className="shrink-0 text-[11px] font-medium text-slate-400">
                              {review.createdAt
                                ? new Date(
                                    review.createdAt
                                  ).toLocaleDateString(
                                    "en-IN"
                                  )
                                : ""}
                            </span>
                          </div>

                          {review.comment && (
                            <p className="mt-3 break-words text-sm leading-6 text-slate-600">
                              “{review.comment}”
                            </p>
                          )}

                          <p className="mt-3 text-xs font-bold text-slate-400">
                            — {review.patientName || "Patient"}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.section>

        {/* Chambers + Booking */}
        <motion.section
          id="booking-panel"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.16 }}
          className="mt-6 min-w-0 overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/40 sm:p-7"
        >
          <SectionHeading
            icon={Building2}
            eyebrow="CareCube Network"
            title="Chambers & Booking"
            description="Choose a clinic, check today's status and book your appointment."
          />

          {chambers.length === 0 ? (
            <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-5 text-sm text-yellow-700">
              Dr. {doctor.name} is not associated with any chamber yet, so
              online booking isn't open. Please check back soon.
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {chambers.map(
                ({ centre, schedule = [], todayStatus }) => {
                  const disabled =
                    todayStatus?.status === "unavailable" ||
                    todayStatus?.status === "holiday";

                  return (
                    <motion.div
                      key={centre._id}
                      whileHover={{ y: -2 }}
                      className="min-w-0 rounded-3xl border border-slate-200 bg-slate-50/60 p-5 transition-shadow hover:shadow-lg hover:shadow-slate-200/50"
                    >
                      <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <Link
                            to={`/centre/${centre._id}`}
                            className="line-clamp-2 break-words text-lg font-black text-slate-900 transition hover:text-blue-600"
                          >
                            {centre.name}
                          </Link>

                          <p className="mt-2 flex min-w-0 items-start gap-2 text-xs leading-5 text-slate-500">
                            <MapPin
                              size={14}
                              className="mt-0.5 shrink-0 text-blue-600"
                            />
                            <span className="break-words">
                              {centre.address}
                              {centre.city
                                ? `, ${centre.city}`
                                : ""}
                            </span>
                          </p>

                          {centre.openingHours && (
                            <p className="mt-2 flex items-center gap-2 text-xs font-medium text-slate-400">
                              <Clock3 size={14} />
                              <span className="break-words">
                                {centre.openingHours}
                              </span>
                            </p>
                          )}
                        </div>

                        <div className="shrink-0">
                          <StatusBadge
                            status={todayStatus?.status}
                            delayMinutes={
                              todayStatus?.delayMinutes
                            }
                          />
                        </div>
                      </div>

                      {todayStatus?.note && (
                        <p className="mt-4 break-words rounded-xl bg-white p-3 text-xs italic leading-5 text-slate-500 ring-1 ring-slate-200">
                          "{todayStatus.note}"
                        </p>
                      )}

                      {schedule.length > 0 && (
                        <div className="mt-4">
                          <p className="mb-2 text-[11px] font-extrabold uppercase tracking-wide text-slate-400">
                            Weekly schedule
                          </p>

                          <div className="flex flex-wrap gap-2">
                            {schedule.map((slot) => (
                              <span
                                key={slot._id}
                                className="max-w-full break-words rounded-xl bg-white px-3 py-2 text-[11px] font-semibold text-slate-600 shadow-sm ring-1 ring-slate-200"
                              >
                                {slot.day}: {slot.startTime}–
                                {slot.endTime}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {bookingCentreId !== centre._id && (
                        <button
                          type="button"
                          onClick={() =>
                            startBooking(centre._id)
                          }
                          disabled={disabled}
                          className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                        >
                          <CalendarDays size={17} />
                          {disabled
                            ? "Booking Unavailable"
                            : "Book Appointment"}
                          {!disabled && (
                            <ArrowRight size={16} />
                          )}
                        </button>
                      )}
                    </motion.div>
                  );
                }
              )}
            </div>
          )}

          {bookingChamber && (
            <div className="mt-5">
              <BookingFlow
                doctor={doctor}
                centre={bookingChamber.centre}
                schedule={bookingChamber.schedule}
                onClose={() => setBookingCentreId("")}
              />
            </div>
          )}
        </motion.section>

        {/* Location + clinic info */}
        {primary && (
          <div className="mt-6 grid min-w-0 gap-6 lg:grid-cols-2">
            <motion.section
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.2 }}
              className="min-w-0 overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/40 sm:p-7"
            >
              <SectionHeading
                icon={Navigation}
                eyebrow="Find us"
                title="Doctor Location & Directions"
              />

              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="flex min-w-0 items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                    <MapPin size={19} />
                  </div>

                  <div className="min-w-0">
                    <p className="break-words font-extrabold text-slate-900">
                      {primary.centre.name}
                    </p>

                    <p className="mt-1 break-words text-sm leading-6 text-slate-500">
                      {primary.centre.address}
                      {primary.centre.city
                        ? `, ${primary.centre.city}`
                        : ""}
                    </p>
                  </div>
                </div>
              </div>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${primary.centre.name} ${primary.centre.address} ${
                    primary.centre.city || ""
                  }`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-blue-700"
              >
                <Navigation size={17} />
                Get Directions
                <ArrowRight size={16} />
              </a>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.24 }}
              className="min-w-0 overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/40 sm:p-7"
            >
              <SectionHeading
                icon={Hospital}
                eyebrow="Clinic"
                title="Clinic Information"
              />

              <div className="space-y-3">
                <div className="flex min-w-0 items-start gap-3">
                  <Building2
                    size={18}
                    className="mt-0.5 shrink-0 text-blue-600"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Clinic
                    </p>
                    <p className="mt-1 break-words text-sm font-extrabold text-slate-800">
                      {primary.centre.name}
                    </p>
                  </div>
                </div>

                <div className="flex min-w-0 items-start gap-3">
                  <MapPin
                    size={18}
                    className="mt-0.5 shrink-0 text-blue-600"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Location
                    </p>
                    <p className="mt-1 break-words text-sm font-semibold text-slate-600">
                      {primary.centre.city ||
                        primary.centre.address}
                    </p>
                  </div>
                </div>

                <div className="flex min-w-0 items-start gap-3">
                  <Clock3
                    size={18}
                    className="mt-0.5 shrink-0 text-blue-600"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Hours
                    </p>
                    <p className="mt-1 break-words text-sm font-semibold text-slate-600">
                      {primary.centre.openingHours ||
                        "Based on available appointment slots"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
                  Why patients choose CareCube
                </p>

                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {HIGHLIGHTS.map((highlight) => (
                    <div
                      key={highlight}
                      className="flex min-w-0 items-center gap-2 rounded-xl bg-blue-50 px-3 py-2.5 text-xs font-bold text-blue-700"
                    >
                      <CheckCircle2
                        size={15}
                        className="shrink-0"
                      />
                      <span className="break-words">
                        {highlight}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>
          </div>
        )}

        {/* Bottom CTA */}
        {primary && (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.28 }}
            className="mt-6 overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#021b55] via-[#033b9e] to-[#0879f9] p-6 text-white shadow-xl shadow-blue-200/50 sm:p-8"
          >
            <div className="flex min-w-0 flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">
                <div className="inline-flex max-w-full items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-blue-100">
                  <ShieldCheck size={14} />
                  CareCube Verified Experience
                </div>

                <h2 className="mt-3 break-words text-2xl font-black tracking-tight sm:text-3xl">
                  Ready to book your appointment?
                </h2>

                <p className="mt-2 max-w-2xl break-words text-sm leading-6 text-blue-100">
                  Choose a chamber and reserve your visit with Dr.{" "}
                  {doctor.name}.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  startBooking(primary.centre._id)
                }
                disabled={!anyAvailable}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-extrabold text-blue-700 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:bg-white/20 disabled:text-white/50"
              >
                <CalendarDays size={18} />
                {anyAvailable
                  ? "Book Appointment"
                  : "Not Available Today"}
                {anyAvailable && <ArrowRight size={17} />}
              </button>
            </div>
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default DoctorProfile;
