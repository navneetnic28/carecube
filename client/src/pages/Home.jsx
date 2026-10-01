import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Brain,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  CreditCard,
  HeartPulse,
  MapPin,
  Menu,
  QrCode,
  Search,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  X,
  Zap,
} from "lucide-react";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import ReviewsSection from "../components/ReviewsSection";
import FeaturedDoctors from "../components/FeaturedDoctors";
import NotificationBell from "../components/NotificationBell";
import Footer from "../components/Footer";
import Logo from "../components/Logo";

/*
  CareCube Home
  - Keeps existing /doctors/search API
  - Keeps AuthContext, Login/Register, Dashboard, Explore
  - Keeps FeaturedDoctors, ReviewsSection, NotificationBell and Footer
  - Uses CSS 3D/parallax instead of adding Three.js, so no new dependency is required.
*/

const medicalImages = {
  hero:
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1400&q=90",
  consultation:
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1000&q=85",
  hospital:
    "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1000&q=85",
  tablet:
    "https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=1000&q=85",
  patient:
    "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1000&q=85",
  team:
    "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1000&q=85",
};

const imageAlt = {
  hero: "Doctor consulting a patient in a modern clinic",
  consultation: "Healthcare consultation",
  hospital: "Modern hospital interior",
  tablet: "Healthcare professional using a tablet",
  patient: "Patient receiving healthcare support",
  team: "Healthcare team",
};

const faqData = [
  {
    question: "What is CareCube?",
    answer:
      "CareCube is a healthcare platform that helps people discover doctors and centres, check availability, book appointments and follow their appointment journey.",
  },
  {
    question: "Can I search for a doctor?",
    answer:
      "Yes. Use the homepage search or Explore Doctors to find providers by name, specialty or other available search criteria.",
  },
  {
    question: "How does QR booking work?",
    answer:
      "Scan a CareCube QR code at a participating healthcare location and continue the booking journey from your phone.",
  },
  {
    question: "Can I book an appointment in advance?",
    answer:
      "Yes, where advance booking is enabled, you can choose an available slot and reserve the appointment before visiting.",
  },
  {
    question: "Can I track my appointment?",
    answer:
      "CareCube is designed to provide appointment and queue information so you can follow the journey instead of relying only on phone calls.",
  },
];

const featureData = [
  {
    icon: Activity,
    title: "Real-Time Availability",
    text: "See available doctors before you travel.",
  },
  {
    icon: Clock3,
    title: "Live Appointment Tracking",
    text: "Follow appointment and queue status in real time.",
  },
  {
    icon: CalendarDays,
    title: "Smart Booking",
    text: "Reserve an available appointment in a few steps.",
  },
  {
    icon: QrCode,
    title: "QR Booking",
    text: "Scan, book and continue your healthcare journey.",
  },
  {
    icon: ShieldCheck,
    title: "Verified Reviews",
    text: "Use patient feedback as one part of your decision.",
  },
  {
    icon: Brain,
    title: "AI Search",
    text: "Use intelligent search to discover relevant care options.",
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    text: "A simple digital payment experience where enabled.",
  },
  {
    icon: HeartPulse,
    title: "Patient Journey",
    text: "Connect discovery, booking, tracking and visit.",
  },
];

const journeySteps = [
  ["01", Search, "Find Doctor", "Search doctors and check available options."],
  ["02", CalendarDays, "Choose Slot", "Select an available appointment time."],
  ["03", QrCode, "Book", "Confirm digitally or continue from a QR code."],
  ["04", Activity, "Track", "Follow appointment and queue updates."],
  ["05", Stethoscope, "Visit", "Arrive with a clearer idea of your turn."],
  ["06", Check, "Complete", "Finish your healthcare journey."],
];

const FloatingOrb = ({ className = "", duration = 8, delay = 0 }) => (
  <motion.div
    animate={{
      y: [0, -18, 0],
      x: [0, 10, 0],
      rotate: [0, 8, 0],
    }}
    transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    className={`pointer-events-none absolute rounded-full blur-3xl ${className}`}
  />
);

function MagneticButton({ children, className = "", ...props }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 18 });
  const sy = useSpring(y, { stiffness: 260, damping: 18 });

  return (
    <motion.button
      style={{ x: sx, y: sy }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * 0.08);
        y.set((e.clientY - (r.top + r.height / 2)) * 0.08);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      whileTap={{ scale: 0.96 }}
      className={`relative overflow-hidden ${className}`}
      {...props}
    >
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      <span className="relative">{children}</span>
    </motion.button>
  );
}

function GlassCard({ children, className = "", ...props }) {
  return (
    <motion.div
      whileHover={{ y: -7, rotateX: 1.5, rotateY: -1.5 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className={`rounded-3xl border border-white/60 bg-white/70 shadow-[0_25px_80px_-30px_rgba(37,99,235,.35)] backdrop-blur-2xl ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}

function Stat({ value, label, index }) {
  const [shown, setShown] = useState("0");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (value === "24/7") {
        setShown(value);
        return;
      }

      const numeric = parseInt(value.replace(/\D/g, ""), 10);
      if (!numeric) {
        setShown(value);
        return;
      }

      let current = 0;
      const step = Math.max(1, Math.ceil(numeric / 28));
      const interval = setInterval(() => {
        current += step;
        if (current >= numeric) {
          current = numeric;
          clearInterval(interval);
        }
        setShown(`${current}${value.includes("K") ? "K+" : value.includes("+") ? "+" : ""}`);
      }, 35);

      return () => clearInterval(interval);
    }, index * 100);

    return () => clearTimeout(timer);
  }, [value, index]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ delay: index * 0.08 }}
      className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white/80 p-6 text-center shadow-lg shadow-blue-100/40 backdrop-blur-xl"
    >
      <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-blue-100/70 blur-2xl" />
      <div className="relative">
        <p className="text-3xl font-black tracking-tight text-blue-600">{shown}</p>
        <p className="mt-1 text-xs font-bold uppercase tracking-[.16em] text-slate-500">
          {label}
        </p>
      </div>
    </motion.div>
  );
}

function Home() {
  const { user, logout } = useAuth();

  const [query, setQuery] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [searched, setSearched] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const [activeToken, setActiveToken] = useState(18);
  const [searchFocused, setSearchFocused] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const heroRef = useRef(null);

  const dashboardPath = {
    patient: "/patient/dashboard",
    doctor: "/doctor/dashboard",
    centre_owner: "/centre/dashboard",
    admin: "/admin/dashboard",
  }[user?.role];

  const searchSuggestions = useMemo(
    () => [
      "Cardiologist",
      "Dentist",
      "Dermatologist",
      "General Physician",
      "ENT",
      "Orthopedic",
    ],
    []
  );

  useEffect(() => {
    const onMove = (event) => {
      if (!heroRef.current) return;
      const r = heroRef.current.getBoundingClientRect();
      setMouse({
        x: ((event.clientX - r.left) / r.width - 0.5) * 2,
        y: ((event.clientY - r.top) / r.height - 0.5) * 2,
      });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveToken((token) => (token >= 23 ? 18 : token + 1));
    }, 2400);

    return () => clearInterval(timer);
  }, []);

  const search = async (e) => {
    e.preventDefault();

    if (!query.trim()) {
      setDoctors([]);
      setSearched(false);
      return;
    }

    try {
      const response = await api.get("/doctors/search", {
        params: { query },
      });

      setDoctors(response.data.doctors || []);
      setSearched(true);
    } catch (error) {
      console.error("Doctor search failed:", error);
      setDoctors([]);
      setSearched(true);
    }
  };

  const selectSuggestion = (value) => {
    setQuery(value);
    setSearchFocused(false);
  };

  const tiltX = mouse.y * -4;
  const tiltY = mouse.x * 5;

  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-slate-900">
      <style>{`
        @keyframes cc-grid {
          0% { transform: translate3d(0,0,0); }
          100% { transform: translate3d(40px,40px,0); }
        }
        @keyframes cc-scan {
          0%,100% { transform: translateX(-120%); opacity: 0; }
          35% { opacity: .8; }
          65% { opacity: .2; }
          100% { transform: translateX(120%); opacity: 0; }
        }
        @keyframes cc-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes cc-pulse {
          0%,100% { transform: scale(.96); opacity: .45; }
          50% { transform: scale(1.04); opacity: .9; }
        }
        @keyframes cc-wave {
          0% { transform: translateX(-30%); }
          100% { transform: translateX(30%); }
        }
        .cc-grid {
          background-image:
            linear-gradient(rgba(37,99,235,.055) 1px, transparent 1px),
            linear-gradient(90deg, rgba(37,99,235,.055) 1px, transparent 1px);
          background-size: 42px 42px;
          animation: cc-grid 18s linear infinite;
        }
        .cc-scan::after {
          content: "";
          position: absolute;
          inset: 0;
          width: 35%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.45), transparent);
          animation: cc-scan 5s ease-in-out infinite;
        }
        .cc-orbit {
          animation: cc-spin 18s linear infinite;
        }
        .cc-pulse {
          animation: cc-pulse 3s ease-in-out infinite;
        }
        .cc-wave {
          animation: cc-wave 4s ease-in-out infinite alternate;
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
            transition-duration: .01ms !important;
          }
        }
      `}</style>

      {/* NAVBAR */}
      <header className="sticky top-0 z-[100] border-b border-slate-200/60 bg-white/75 backdrop-blur-2xl">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
          <Link to="/" className="shrink-0">
            <Logo size="md" />
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {[
              ["#features", "Features"],
              ["#how-it-works", "How it works"],
              ["#live-queue", "Live Queue"],
              ["#why-carecube", "Why CareCube"],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="rounded-xl px-3 py-2 text-sm font-bold text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
              >
                {label}
              </a>
            ))}
            <Link
              to="/explore"
              className="rounded-xl px-3 py-2 text-sm font-bold text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
            >
              Explore Doctors
            </Link>
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            {user ? (
              <>
                <NotificationBell />
                <Link
                  to={dashboardPath}
                  className="rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-600"
                >
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:text-blue-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-blue-50 hover:text-blue-600"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            {!user && (
              <Link
                to="/login"
                className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20"
              >
                Login
              </Link>
            )}
            {user && <NotificationBell />}
            <button
              type="button"
              aria-label="Toggle menu"
              aria-expanded={mobileMenu}
              onClick={() => setMobileMenu((v) => !v)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700"
            >
              {mobileMenu ? <X size={21} /> : <Menu size={21} />}
            </button>
          </div>
        </div>

        <motion.div
          initial={false}
          animate={{
            height: mobileMenu ? "auto" : 0,
            opacity: mobileMenu ? 1 : 0,
          }}
          className="overflow-hidden border-t border-slate-200/70 bg-white/95 lg:hidden"
        >
          <div className="mx-auto max-w-7xl px-5 py-4">
            <div className="grid gap-1">
              {[
                ["#features", "Features"],
                ["#how-it-works", "How it works"],
                ["#live-queue", "Live Queue"],
                ["#why-carecube", "Why CareCube"],
              ].map(([href, label]) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setMobileMenu(false)}
                  className="rounded-xl px-4 py-3 font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                >
                  {label}
                </a>
              ))}
              <Link
                to="/explore"
                onClick={() => setMobileMenu(false)}
                className="rounded-xl px-4 py-3 font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-600"
              >
                Explore Doctors
              </Link>

              {!user ? (
                <Link
                  to="/register"
                  onClick={() => setMobileMenu(false)}
                  className="mt-2 rounded-xl bg-slate-950 px-4 py-3 text-center font-bold text-white"
                >
                  Get Started
                </Link>
              ) : (
                <>
                  <Link
                    to={dashboardPath}
                    onClick={() => setMobileMenu(false)}
                    className="mt-2 rounded-xl bg-blue-600 px-4 py-3 text-center font-bold text-white"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenu(false);
                      logout();
                    }}
                    className="rounded-xl border border-slate-200 px-4 py-3 font-bold text-slate-700"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </header>

      <main>
        {/* HERO */}
        <section
          ref={heroRef}
          className="relative isolate overflow-hidden bg-[radial-gradient(circle_at_15%_15%,rgba(59,130,246,.16),transparent_30%),radial-gradient(circle_at_85%_25%,rgba(34,211,238,.15),transparent_30%),linear-gradient(180deg,#eff7ff_0%,#ffffff_70%)]"
        >
          <div className="cc-grid pointer-events-none absolute inset-0 opacity-70" />
          <FloatingOrb className="-left-40 top-24 h-96 w-96 bg-blue-400/25" duration={9} />
          <FloatingOrb className="-right-44 top-10 h-[460px] w-[460px] bg-cyan-300/25" duration={11} delay={1} />

          <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-white/70 to-transparent" />

          <div className="relative mx-auto max-w-7xl px-5 pb-24 pt-14 sm:px-6 sm:pt-20 lg:px-8 lg:pb-32 lg:pt-24">
            <div className="grid items-center gap-14 lg:grid-cols-[1.02fr_.98fr]">
              <div className="relative z-20 text-center lg:text-left">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-4 py-2 text-xs font-black uppercase tracking-[.12em] text-blue-700 shadow-lg shadow-blue-100/30 backdrop-blur"
                >
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  </span>
                  Live healthcare network
                  <span className="text-slate-300">•</span>
                  2030-ready experience
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.75, delay: 0.08 }}
                  className="text-5xl font-black leading-[.98] tracking-[-.055em] text-slate-950 sm:text-6xl lg:text-[78px]"
                >
                  Healthcare,
                  <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text pb-2 text-transparent">
                    reimagined
                  </span>
                  <span className="block">for the future.</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.65, delay: 0.18 }}
                  className="mx-auto mt-7 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg lg:mx-0"
                >
                  Find trusted doctors, discover healthcare centres, book
                  appointments and follow your journey in real time — through
                  one intelligent healthcare platform.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.65, delay: 0.28 }}
                  className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start"
                >
                  <Link to="/explore">
                    <MagneticButton className="group w-full rounded-2xl bg-blue-600 px-7 py-4 font-black text-white shadow-[0_20px_45px_-15px_rgba(37,99,235,.65)] transition hover:bg-blue-700 sm:w-auto">
                      <span className="flex items-center justify-center gap-2">
                        Find a Doctor
                        <ArrowRight size={18} className="transition group-hover:translate-x-1" />
                      </span>
                    </MagneticButton>
                  </Link>

                  <Link
                    to={user ? dashboardPath : "/register"}
                    className="group inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white/85 px-7 py-4 font-black text-slate-800 shadow-lg shadow-slate-200/40 backdrop-blur transition hover:-translate-y-1 hover:border-blue-200 hover:text-blue-600"
                  >
                    {user ? "Open Dashboard" : "Register Your Centre"}
                    <ArrowRight size={18} className="transition group-hover:translate-x-1" />
                  </Link>
                </motion.div>

                {/* Futuristic search */}
                <motion.form
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.65, delay: 0.38 }}
                  onSubmit={search}
                  className={`relative mx-auto mt-10 max-w-3xl rounded-[24px] border bg-white/85 p-2 shadow-[0_30px_80px_-30px_rgba(15,23,42,.28)] backdrop-blur-2xl transition lg:mx-0 ${
                    searchFocused
                      ? "border-blue-300 ring-4 ring-blue-100/70"
                      : "border-white"
                  }`}
                >
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <div className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl px-3">
                      <Search className="shrink-0 text-blue-500" size={21} />
                      <input
                        type="text"
                        placeholder="Search doctor, specialty or service..."
                        value={query}
                        onFocus={() => setSearchFocused(true)}
                        onBlur={() => setTimeout(() => setSearchFocused(false), 120)}
                        onChange={(e) => setQuery(e.target.value)}
                        className="min-w-0 w-full bg-transparent py-3.5 text-sm font-semibold outline-none placeholder:text-slate-400"
                      />
                    </div>

                    <div className="hidden items-center gap-2 rounded-2xl border border-slate-100 px-4 sm:flex">
                      <MapPin size={18} className="text-blue-500" />
                      <span className="text-sm font-semibold text-slate-500">Your location</span>
                    </div>

                    <button
                      type="submit"
                      className="rounded-2xl bg-slate-950 px-7 py-3.5 text-sm font-black text-white transition hover:bg-blue-600"
                    >
                      Search
                    </button>
                  </div>

                  {searchFocused && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute left-2 right-2 top-[calc(100%+10px)] z-50 rounded-3xl border border-white bg-white/95 p-3 text-left shadow-2xl backdrop-blur-2xl"
                    >
                      <p className="px-3 py-2 text-[10px] font-black uppercase tracking-[.18em] text-slate-400">
                        Popular searches
                      </p>
                      <div className="grid gap-1 sm:grid-cols-2">
                        {searchSuggestions.map((suggestion) => (
                          <button
                            type="button"
                            key={suggestion}
                            onMouseDown={() => selectSuggestion(suggestion)}
                            className="flex items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-bold text-slate-700 transition hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Search size={16} />
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </motion.form>

                <div className="mt-7 flex flex-wrap justify-center gap-5 text-xs font-bold text-slate-500 lg:justify-start">
                  <span className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-emerald-500" />
                    Secure experience
                  </span>
                  <span className="flex items-center gap-2">
                    <Zap size={16} className="text-blue-500" />
                    Fast booking
                  </span>
                  <span className="flex items-center gap-2">
                    <HeartPulse size={16} className="text-rose-500" />
                    Patient focused
                  </span>
                </div>
              </div>

              {/* HERO 3D VISUAL */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, x: 35 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.15 }}
                className="relative mx-auto w-full max-w-[610px]"
                style={{ perspective: 1200 }}
              >
                <motion.div
                  animate={{ rotateX: tiltX, rotateY: tiltY }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  className="relative"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Orbital rings */}
                  <div className="pointer-events-none absolute -inset-8 sm:-inset-12">
                    <div className="cc-orbit absolute inset-0 rounded-full border border-blue-300/30" />
                    <div className="cc-orbit absolute inset-10 rounded-full border border-cyan-300/30 [animation-direction:reverse] [animation-duration:13s]" />
                    <div className="cc-pulse absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400/20 blur-3xl" />
                  </div>

                  {/* Main photo */}
                  <div
                    className="relative overflow-hidden rounded-[42px] border border-white/80 bg-white/45 p-3 shadow-[0_45px_100px_-30px_rgba(37,99,235,.5)] backdrop-blur-2xl"
                    style={{ transform: "translateZ(20px)" }}
                  >
                    <div className="cc-scan relative overflow-hidden rounded-[34px]">
                      <img
                        src={medicalImages.hero}
                        alt={imageAlt.hero}
                        className="h-[440px] w-full object-cover object-center sm:h-[530px]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-blue-500/10" />
                      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                        <div className="max-w-xs rounded-3xl border border-white/20 bg-slate-950/45 p-5 text-white backdrop-blur-xl">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-[.18em] text-blue-200">
                                Live consultation
                              </p>
                              <p className="mt-1 text-xl font-black">Dr. Priya Sharma</p>
                              <p className="text-sm text-blue-100">General Physician</p>
                            </div>
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
                              <Stethoscope size={22} />
                            </div>
                          </div>
                          <div className="mt-4 flex items-center gap-2 text-xs font-bold">
                            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400" />
                            Available today
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Floating status card */}
                  <GlassCard
                    className="absolute -left-5 top-12 w-52 p-4 sm:-left-8"
                    style={{ transform: "translateZ(90px)" }}
                    animate={{ y: [0, -9, 0] }}
                    transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-[9px] font-black uppercase tracking-[.16em] text-slate-400">
                        Doctor available
                      </p>
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_14px_rgba(16,185,129,.8)]" />
                    </div>
                    <p className="mt-2 text-sm font-black text-slate-900">Online now</p>
                    <p className="mt-1 text-xs font-medium text-slate-500">2 slots open</p>
                  </GlassCard>

                  {/* Queue card */}
                  <GlassCard
                    className="absolute -right-4 bottom-28 w-52 p-4 sm:-right-8"
                    style={{ transform: "translateZ(100px)" }}
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 3.7, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <Clock3 size={18} />
                      </div>
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-[.15em] text-slate-400">
                          Live queue
                        </p>
                        <p className="text-sm font-black">5 patients ahead</p>
                      </div>
                    </div>
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                      <motion.div
                        animate={{ width: ["35%", "72%", "48%"] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400"
                      />
                    </div>
                  </GlassCard>

                  {/* Confirmed card */}
                  <GlassCard
                    className="absolute right-4 top-2 hidden w-52 p-4 sm:block"
                    style={{ transform: "translateZ(120px)" }}
                    animate={{ rotate: [0, 1.5, 0], y: [0, -5, 0] }}
                    transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                        <Check size={20} />
                      </div>
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-[.15em] text-slate-400">
                          Confirmed
                        </p>
                        <p className="text-sm font-black">10:30 AM</p>
                      </div>
                    </div>
                  </GlassCard>

                  {/* AI match */}
                  <GlassCard
                    className="absolute bottom-5 left-4 hidden w-48 p-4 sm:block"
                    style={{ transform: "translateZ(130px)" }}
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles size={17} className="text-cyan-500" />
                      <span className="text-xs font-black">98% MATCH</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">AI healthcare search</p>
                  </GlassCard>

                  {/* 3D medical objects */}
                  <motion.div
                    animate={{ rotateZ: 360, y: [0, -10, 0] }}
                    transition={{ rotateZ: { duration: 18, repeat: Infinity, ease: "linear" }, y: { duration: 4, repeat: Infinity } }}
                    className="absolute -bottom-5 -right-3 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/70 bg-white/70 text-blue-600 shadow-xl backdrop-blur-xl sm:-right-8"
                    style={{ transform: "translateZ(160px)" }}
                  >
                    <HeartPulse size={28} />
                  </motion.div>

                  <motion.div
                    animate={{ rotate: [0, 8, -8, 0], y: [0, -14, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -left-3 bottom-40 hidden h-14 w-14 items-center justify-center rounded-2xl border border-white/70 bg-slate-950/90 text-cyan-300 shadow-2xl sm:flex"
                    style={{ transform: "translateZ(150px)" }}
                  >
                    <Activity size={24} />
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>

            {/* Stats */}
            <div className="mx-auto mt-16 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Stat value="10K+" label="Appointments" index={0} />
              <Stat value="2K+" label="Providers" index={1} />
              <Stat value="50+" label="Cities" index={2} />
              <Stat value="24/7" label="Digital Access" index={3} />
            </div>
          </div>
        </section>

        {/* SEARCH RESULTS */}
        {searched && (
          <section className="bg-slate-50 px-5 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">
              <div className="mb-8">
                <p className="text-xs font-black uppercase tracking-[.18em] text-blue-600">
                  Search results
                </p>
                <h2 className="mt-2 text-3xl font-black">
                  Doctors matching “{query}”
                </h2>
              </div>

              {doctors.length === 0 ? (
                <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-xl shadow-slate-200/30">
                  <Stethoscope className="mx-auto text-slate-300" size={48} />
                  <p className="mt-4 font-black text-slate-700">
                    No verified doctors found.
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Try another search or explore all doctors.
                  </p>
                  <Link
                    to="/explore"
                    className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 font-bold text-white"
                  >
                    Explore Doctors
                  </Link>
                </div>
              ) : (
                <div className="space-y-5">
                  {doctors.map((doctor) => (
                    <motion.div
                      key={doctor._id}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-3xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/30 transition hover:-translate-y-1 hover:shadow-2xl sm:p-6"
                    >
                      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                          {doctor.photoUrl ? (
                            <img
                              src={doctor.photoUrl}
                              alt={doctor.name}
                              className="h-16 w-16 rounded-2xl object-cover"
                            />
                          ) : (
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-xl font-black text-blue-600">
                              {doctor.name?.[0]}
                            </div>
                          )}

                          <div>
                            <h3 className="text-lg font-black">
                              Dr. {doctor.name}
                            </h3>
                            <p className="mt-1 font-bold text-blue-600">
                              {doctor.specialization}
                            </p>
                            <p className="mt-1 text-sm text-slate-500">
                              {doctor.qualification}
                            </p>
                          </div>
                        </div>

                        <Link
                          to={`/doctor/${doctor._id}`}
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-black text-white transition hover:bg-blue-700"
                        >
                          View Profile
                          <ArrowRight size={16} />
                        </Link>
                      </div>

                      <div className="mt-5 grid gap-3">
                        {(doctor.chambers || []).map((centre) => (
                          <div
                            key={centre._id}
                            className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                          >
                            <div className="flex gap-3">
                              <MapPin size={19} className="mt-0.5 text-blue-600" />
                              <div>
                                <p className="font-bold">{centre.name}</p>
                                <p className="mt-1 text-sm text-slate-500">
                                  {centre.address}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* FEATURES */}
        <section id="features" className="scroll-mt-20 bg-white py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              className="mx-auto max-w-3xl text-center"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-black uppercase tracking-[.15em] text-blue-600">
                <Sparkles size={15} />
                Next-generation care
              </span>
              <h2 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl">
                Everything healthcare
                <span className="text-blue-600"> should feel like.</span>
              </h2>
              <p className="mt-5 leading-8 text-slate-600">
                A connected digital experience for discovery, booking,
                tracking and the journey around your appointment.
              </p>
            </motion.div>

            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featureData.map((feature, index) => {
                const Icon = feature.icon;

                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 28, rotateX: 8 }}
                    whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ delay: index * 0.05, duration: 0.55 }}
                    whileHover={{ y: -10, rotateX: 2, rotateY: -2 }}
                    className="group relative overflow-hidden rounded-[30px] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-100 transition hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-100/60"
                    style={{ perspective: 900 }}
                  >
                    <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-blue-100/70 blur-3xl transition group-hover:bg-cyan-100/80" />
                    <div className="relative">
                      <div className="flex items-center justify-between">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 text-blue-600 shadow-inner transition group-hover:scale-110 group-hover:from-blue-600 group-hover:to-cyan-500 group-hover:text-white">
                          <Icon size={24} />
                        </div>
                        <span className="text-xs font-black text-slate-200">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <h3 className="mt-7 font-black text-slate-900">{feature.title}</h3>
                      <p className="mt-3 text-sm leading-6 text-slate-500">
                        {feature.text}
                      </p>
                      <div className="mt-6 h-px overflow-hidden bg-slate-100">
                        <div className="h-full w-1/3 -translate-x-full bg-gradient-to-r from-blue-600 to-cyan-400 transition duration-700 group-hover:translate-x-[250%]" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FEATURED DOCTORS */}
        <section className="relative overflow-hidden bg-slate-50 py-24">
          <FloatingOrb className="-right-40 top-0 h-80 w-80 bg-blue-300/20" duration={10} />
          <div className="relative">
            <FeaturedDoctors />
          </div>
        </section>

        {/* LIVE QUEUE */}
        <section id="live-queue" className="scroll-mt-20 relative overflow-hidden bg-slate-950 py-24 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,.28),transparent_35%),radial-gradient(circle_at_80%_70%,rgba(6,182,212,.18),transparent_35%)]" />
          <div className="cc-grid absolute inset-0 opacity-20" />

          <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="grid items-center gap-14 lg:grid-cols-[.85fr_1.15fr]">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-black uppercase tracking-[.16em] text-cyan-300">
                  <Activity size={14} />
                  Live appointment engine
                </span>
                <h2 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                  Stop waiting
                  <span className="block text-cyan-300">blindly.</span>
                </h2>
                <p className="mt-6 max-w-xl text-base leading-8 text-slate-400 sm:text-lg">
                  Know what's happening before you reach the chamber. CareCube
                  turns an appointment into a visible, trackable journey.
                </p>

                <div className="mt-8 grid grid-cols-2 gap-3">
                  {[
                    ["Now consulting", "Dr. Rahul Kumar"],
                    ["Your token", "#23"],
                    ["Ahead", "5 patients"],
                    ["Estimated", "18 minutes"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-2xl border border-white/10 bg-white/[.04] p-4 backdrop-blur"
                    >
                      <p className="text-[9px] font-black uppercase tracking-[.16em] text-slate-500">
                        {label}
                      </p>
                      <p className="mt-2 font-black text-white">{value}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.94, x: 30 }}
                whileInView={{ opacity: 1, scale: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="absolute -inset-10 rounded-[50px] bg-blue-500/15 blur-3xl" />

                <div className="relative overflow-hidden rounded-[34px] border border-white/10 bg-white/[.06] p-5 shadow-2xl backdrop-blur-xl sm:p-7">
                  <div className="flex items-center justify-between border-b border-white/10 pb-5">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[.18em] text-cyan-300">
                        Chamber command centre
                      </p>
                      <p className="mt-1 text-lg font-black">Cardiology OPD</p>
                    </div>
                    <span className="flex items-center gap-2 rounded-full bg-emerald-400/10 px-3 py-2 text-xs font-bold text-emerald-300">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                      LIVE
                    </span>
                  </div>

                  <div className="mt-7 rounded-3xl border border-white/10 bg-slate-950/60 p-5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400">CURRENTLY CONSULTING</span>
                      <span className="text-xs font-black text-cyan-300">TOKEN #{activeToken}</span>
                    </div>

                    <div className="mt-5 flex items-center gap-4">
                      <div className="h-14 w-14 overflow-hidden rounded-2xl border border-white/10">
                        <img
                          src={medicalImages.hero}
                          alt="Doctor"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-black">Dr. Rahul Kumar</p>
                        <p className="text-sm text-slate-500">Cardiologist</p>
                      </div>
                    </div>

                    <div className="mt-7">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-500">QUEUE PROGRESS</span>
                        <span className="font-black text-cyan-300">72%</span>
                      </div>
                      <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/5">
                        <motion.div
                          animate={{ width: ["55%", "72%", "62%", "72%"] }}
                          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                          className="h-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center gap-2 overflow-hidden">
                    {[18, 19, 20, 21, 22, 23].map((token) => (
                      <motion.div
                        key={token}
                        animate={{
                          scale: activeToken === token ? 1.12 : 1,
                          y: activeToken === token ? -6 : 0,
                        }}
                        className={`flex h-11 min-w-11 items-center justify-center rounded-xl border text-xs font-black ${
                          activeToken === token
                            ? "border-cyan-300/40 bg-cyan-300/15 text-cyan-300 shadow-[0_0_30px_rgba(34,211,238,.2)]"
                            : "border-white/10 bg-white/[.03] text-slate-500"
                        }`}
                      >
                        #{token}
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-7 overflow-hidden rounded-2xl border border-white/5 bg-black/20 px-4 py-3">
                    <motion.div
                      animate={{ x: ["-20%", "20%", "-20%"] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="cc-wave h-8 w-[140%]"
                    >
                      <svg viewBox="0 0 500 40" className="h-full w-full">
                        <path
                          d="M0 22 H80 L95 22 L105 5 L117 34 L130 22 H190 L205 22 L215 12 L225 30 L237 22 H320 L335 22 L347 2 L360 37 L372 22 H500"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="text-cyan-300"
                        />
                      </svg>
                    </motion.div>
                  </div>

                  <div className="mt-5 grid gap-2 sm:grid-cols-3">
                    {["Doctor consulting", "Queue moving", "Appointment confirmed"].map(
                      (status) => (
                        <div
                          key={status}
                          className="flex items-center gap-2 rounded-xl bg-white/[.04] px-3 py-2 text-xs font-bold text-slate-400"
                        >
                          <Check size={14} className="text-emerald-400" />
                          {status}
                        </div>
                      )
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="scroll-mt-20 bg-white py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <span className="text-xs font-black uppercase tracking-[.18em] text-blue-600">
                The CareCube journey
              </span>
              <h2 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">
                From search to chamber,
                <span className="text-blue-600"> connected.</span>
              </h2>
              <p className="mt-5 leading-8 text-slate-600">
                A simple sequence with a modern digital layer around the
                healthcare visit.
              </p>
            </div>

            <div className="relative mt-16">
              <div className="absolute left-[8%] right-[8%] top-9 hidden h-px bg-gradient-to-r from-blue-100 via-blue-500 to-cyan-300 lg:block" />
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-6">
                {journeySteps.map(([number, Icon, title, text], index) => (
                  <motion.div
                    key={number}
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ delay: index * 0.08 }}
                    className="relative text-center"
                  >
                    <motion.div
                      whileHover={{ scale: 1.08, rotate: 4 }}
                      className="relative z-10 mx-auto flex h-[74px] w-[74px] items-center justify-center rounded-3xl border border-blue-100 bg-white text-blue-600 shadow-xl shadow-blue-100/60"
                    >
                      <Icon size={25} />
                      <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-slate-950 text-[9px] font-black text-white">
                        {number}
                      </span>
                    </motion.div>
                    <h3 className="mt-5 font-black">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* QR + PHONE */}
        <section className="overflow-hidden bg-slate-50 py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="grid items-center gap-14 lg:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <span className="text-xs font-black uppercase tracking-[.18em] text-blue-600">
                  QR booking
                </span>
                <h2 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">
                  Scan.
                  <span className="text-blue-600"> Book.</span>
                  <br />
                  Track.
                </h2>
                <p className="mt-6 max-w-xl leading-8 text-slate-600">
                  See a CareCube QR at a participating healthcare centre? Scan
                  it and continue your appointment journey from your phone.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  {["Scan QR", "Select Doctor", "Choose Slot", "Track Queue"].map(
                    (item, i) => (
                      <div
                        key={item}
                        className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold shadow-sm"
                      >
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                          {i + 1}
                        </span>
                        {item}
                      </div>
                    )
                  )}
                </div>
              </motion.div>

              <div className="relative mx-auto h-[540px] w-full max-w-md">
                <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400/20 blur-3xl" />

                <motion.div
                  initial={{ opacity: 0, y: 40, rotateY: -12 }}
                  whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  whileHover={{ rotateY: 5, rotateX: -2, y: -8 }}
                  className="absolute left-1/2 top-1/2 h-[500px] w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-[42px] border-[8px] border-slate-900 bg-slate-950 p-2 shadow-[0_40px_100px_-30px_rgba(15,23,42,.55)]"
                  style={{ perspective: 1000 }}
                >
                  <div className="relative h-full overflow-hidden rounded-[32px] bg-gradient-to-b from-blue-50 to-white">
                    <div className="mx-auto mt-3 h-5 w-24 rounded-full bg-slate-900" />
                    <div className="p-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-[.16em] text-blue-600">
                            CareCube
                          </p>
                          <p className="mt-1 text-lg font-black">Book visit</p>
                        </div>
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
                          <QrCode size={18} />
                        </div>
                      </div>

                      <div className="mt-7 rounded-3xl bg-slate-950 p-5 text-white">
                        <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-2xl bg-white p-3">
                          <div className="grid h-full w-full grid-cols-7 gap-1">
                            {Array.from({ length: 49 }).map((_, i) => (
                              <span
                                key={i}
                                className={
                                  (i * 13) % 7 < 3 ||
                                  i % 11 === 0 ||
                                  i % 5 === 0
                                    ? "rounded-[2px] bg-slate-950"
                                    : "rounded-[2px] bg-white"
                                }
                              />
                            ))}
                          </div>
                        </div>
                        <p className="mt-4 text-center text-xs font-bold text-slate-400">
                          Scan to continue
                        </p>
                      </div>

                      <div className="mt-5 space-y-3">
                        {[
                          ["Doctor", "Dr. Ananya Sharma"],
                          ["Specialty", "Cardiology"],
                          ["Slot", "Tomorrow • 10:30 AM"],
                        ].map(([label, value]) => (
                          <div
                            key={label}
                            className="rounded-2xl border border-slate-100 bg-white p-3"
                          >
                            <p className="text-[9px] font-black uppercase tracking-[.12em] text-slate-400">
                              {label}
                            </p>
                            <p className="mt-1 text-xs font-black text-slate-800">{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* AI SEARCH */}
        <section className="relative overflow-hidden bg-slate-950 py-24 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(37,99,235,.22),transparent_32%),radial-gradient(circle_at_80%_80%,rgba(6,182,212,.15),transparent_28%)]" />
          <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="grid items-center gap-14 lg:grid-cols-[.85fr_1.15fr]">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-xs font-black uppercase tracking-[.16em] text-blue-300">
                  <Brain size={14} />
                  AI healthcare search
                </span>
                <h2 className="mt-6 text-4xl font-black sm:text-5xl">
                  Healthcare search,
                  <span className="block text-cyan-300">powered by intelligence.</span>
                </h2>
                <p className="mt-6 max-w-xl leading-8 text-slate-400">
                  Describe the provider or service you are looking for and use
                  CareCube to navigate available healthcare options.
                </p>
                <p className="mt-5 text-xs leading-6 text-slate-500">
                  AI features should support healthcare discovery and navigation;
                  they are not a medical diagnosis service.
                </p>
              </div>

              <div className="relative">
                <div className="absolute -inset-10 rounded-[50px] bg-blue-500/15 blur-3xl" />

                <div className="relative rounded-[34px] border border-white/10 bg-white/[.06] p-5 shadow-2xl backdrop-blur-xl sm:p-7">
                  <div className="flex items-center gap-3 border-b border-white/10 pb-5">
                    <div className="cc-pulse flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-lg shadow-blue-500/20">
                      <Sparkles size={22} />
                    </div>
                    <div>
                      <p className="text-sm font-black">CareCube Intelligence</p>
                      <p className="text-xs text-slate-500">Healthcare discovery assistant</p>
                    </div>
                  </div>

                  <div className="mt-6 rounded-3xl bg-white/[.05] p-4">
                    <p className="text-[9px] font-black uppercase tracking-[.15em] text-slate-500">
                      You
                    </p>
                    <p className="mt-2 text-sm font-semibold text-slate-200">
                      “I need a cardiologist near me tomorrow evening.”
                    </p>
                  </div>

                  <div className="ml-8 mt-4 rounded-3xl border border-cyan-400/10 bg-cyan-400/[.04] p-4">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-300" />
                      <p className="text-[9px] font-black uppercase tracking-[.15em] text-cyan-300">
                        CareCube
                      </p>
                    </div>
                    <p className="mt-2 text-sm font-semibold text-slate-300">
                      Here are healthcare providers matching your search.
                    </p>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    {[
                      ["Dr. Ananya", "Cardiologist", "Tomorrow • 6:00 PM"],
                      ["Dr. Rahul", "Cardiologist", "Tomorrow • 6:30 PM"],
                      ["Dr. Priya", "Cardiologist", "Tomorrow • 7:00 PM"],
                    ].map(([name, specialty, slot], i) => (
                      <motion.div
                        key={name}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.12 }}
                        className="rounded-2xl border border-white/10 bg-white/[.04] p-3"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/15 text-blue-300">
                          <Stethoscope size={17} />
                        </div>
                        <p className="mt-3 text-xs font-black">{name}</p>
                        <p className="mt-1 text-[10px] text-slate-500">{specialty}</p>
                        <p className="mt-3 text-[10px] font-bold text-cyan-300">{slot}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* REAL IMAGE GALLERY */}
        <section id="why-carecube" className="scroll-mt-20 bg-white py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="grid items-end gap-6 md:grid-cols-2">
              <div>
                <span className="text-xs font-black uppercase tracking-[.18em] text-blue-600">
                  Real healthcare
                </span>
                <h2 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">
                  Designed around
                  <span className="text-blue-600"> real people.</span>
                </h2>
              </div>
              <p className="max-w-xl leading-8 text-slate-600 md:justify-self-end">
                CareCube brings a human, visual layer to a traditionally
                fragmented appointment experience.
              </p>
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-12 md:grid-rows-2">
              <motion.figure
                initial={{ opacity: 0, scale: .96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="group relative min-h-[300px] overflow-hidden rounded-[30px] md:col-span-7 md:row-span-2"
              >
                <img
                  src={medicalImages.consultation}
                  alt={imageAlt.consultation}
                  className="absolute inset-0 h-full w-full object-cover transition duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                <figcaption className="absolute bottom-0 p-7 text-white">
                  <p className="text-xs font-black uppercase tracking-[.16em] text-blue-200">
                    Consultation
                  </p>
                  <p className="mt-2 text-2xl font-black">Technology that stays human.</p>
                </figcaption>
              </motion.figure>

              {[
                [medicalImages.hospital, imageAlt.hospital, "Modern centres"],
                [medicalImages.tablet, imageAlt.tablet, "Digital care"],
                [medicalImages.patient, imageAlt.patient, "Patient journey"],
                [medicalImages.team, imageAlt.team, "Healthcare teams"],
              ].map(([src, alt, title], i) => (
                <motion.figure
                  key={title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="group relative min-h-[190px] overflow-hidden rounded-[28px] md:col-span-5"
                >
                  <img
                    src={src}
                    alt={alt}
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-transparent" />
                  <figcaption className="absolute bottom-0 p-5 text-sm font-black text-white">
                    {title}
                  </figcaption>
                </motion.figure>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-5 py-8 sm:px-6 lg:px-8">
          <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[42px] bg-slate-950 px-7 py-16 text-white shadow-2xl sm:px-12 lg:px-20 lg:py-24">
            <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-blue-600/25 blur-3xl" />
            <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-cyan-400/15 blur-3xl" />
            <div className="cc-grid absolute inset-0 opacity-20" />

            <div className="relative grid items-center gap-12 lg:grid-cols-[1.2fr_.8fr]">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.06] px-4 py-2 text-xs font-black uppercase tracking-[.16em] text-cyan-300">
                  <Zap size={14} />
                  Faster. Simpler. Connected.
                </span>
                <h2 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                  Your healthcare journey
                  <span className="block text-cyan-300">starts here.</span>
                </h2>
                <p className="mt-6 max-w-xl leading-8 text-slate-400">
                  Find. Book. Track. Visit. CareCube connects the important
                  digital steps around your appointment.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    to="/explore"
                    className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-7 py-4 font-black text-white transition hover:-translate-y-1 hover:bg-blue-500"
                  >
                    Find a Doctor
                    <ArrowRight size={18} className="transition group-hover:translate-x-1" />
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[.05] px-7 py-4 font-black text-white transition hover:-translate-y-1 hover:bg-white/10"
                  >
                    Register Your Centre
                  </Link>
                </div>
              </div>

              <div className="relative mx-auto grid w-full max-w-sm grid-cols-2 gap-3">
                {[
                  [Search, "Find"],
                  [CalendarDays, "Book"],
                  [Activity, "Track"],
                  [CreditCard, "Complete"],
                ].map(([Icon, label], i) => (
                  <motion.div
                    key={label}
                    animate={{ y: [0, i % 2 ? 8 : -8, 0] }}
                    transition={{ duration: 3.5 + i * .3, repeat: Infinity, ease: "easeInOut" }}
                    whileHover={{ scale: 1.04 }}
                    className="rounded-3xl border border-white/10 bg-white/[.06] p-6 backdrop-blur-xl"
                  >
                    <Icon size={25} className="text-cyan-300" />
                    <p className="mt-5 font-black">{label}</p>
                    <p className="mt-1 text-xs text-slate-500">CareCube journey</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* REVIEWS */}
        <section className="relative overflow-hidden bg-slate-50 py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <span className="text-xs font-black uppercase tracking-[.18em] text-blue-600">
                Patient stories
              </span>
              <h2 className="mt-4 text-4xl font-black">Real people. Real experiences.</h2>
              <p className="mt-4 text-slate-500">
                Reviews remain swipeable and compact so the homepage stays easy to scan.
              </p>
            </div>
            <ReviewsSection />
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-white py-24">
          <div className="mx-auto max-w-3xl px-5 sm:px-6">
            <div className="text-center">
              <span className="text-xs font-black uppercase tracking-[.18em] text-blue-600">
                FAQs
              </span>
              <h2 className="mt-5 text-4xl font-black sm:text-5xl">
                Questions, answered.
              </h2>
              <p className="mt-4 text-slate-500">
                A quick guide to the CareCube experience.
              </p>
            </div>

            <div className="mt-12 space-y-3">
              {faqData.map((faq, index) => {
                const isOpen = openFaq === index;

                return (
                  <motion.div
                    key={faq.question}
                    layout
                    className={`overflow-hidden rounded-3xl border transition ${
                      isOpen
                        ? "border-blue-200 bg-blue-50/50 shadow-lg shadow-blue-100/40"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? -1 : index)}
                      className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left sm:px-6"
                    >
                      <span className="font-black text-slate-900">{faq.question}</span>
                      <ChevronDown
                        size={20}
                        className={`shrink-0 text-slate-400 transition ${
                          isOpen ? "rotate-180 text-blue-600" : ""
                        }`}
                      />
                    </button>

                    <motion.div
                      initial={false}
                      animate={{
                        height: isOpen ? "auto" : 0,
                        opacity: isOpen ? 1 : 0,
                      }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-6 text-sm leading-7 text-slate-600 sm:px-6">
                        {faq.answer}
                      </p>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section className="bg-slate-50 px-5 py-24 sm:px-6">
          <div className="mx-auto max-w-5xl text-center">
            <motion.div
              initial={{ opacity: 0, scale: .9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-2xl shadow-blue-600/25"
            >
              <HeartPulse size={29} />
            </motion.div>

            <p className="mt-6 text-xs font-black uppercase tracking-[.18em] text-blue-600">
              Get in touch
            </p>

            <h2 className="mt-4 text-4xl font-black sm:text-5xl">
              Let's make healthcare
              <span className="text-blue-600"> simpler together.</span>
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-7 text-slate-600">
              Have a question, suggestion or want to partner with CareCube?
              We would love to hear from you.
            </p>

            <a
              href="mailto:hello@carecube.com"
              className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-7 py-4 font-black text-white shadow-xl transition hover:-translate-y-1 hover:bg-blue-600"
            >
              Send Message
              <ArrowRight size={18} />
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Home;
