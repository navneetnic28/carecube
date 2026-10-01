import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Heart,
  HeartPulse,
  Hospital,
  MapPin,
  Menu,
  QrCode,
  Search,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Users,
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

/* -------------------------------------------------------
   DATA
------------------------------------------------------- */

const faqData = [
  {
    question: "What is CareCube?",
    answer:
      "CareCube is a healthcare platform that helps patients discover doctors and healthcare centres, book appointments and follow their appointment journey.",
  },
  {
    question: "Can I search for a doctor?",
    answer:
      "Yes. You can search doctors by name, specialization or healthcare service using the search box or Explore Doctors.",
  },
  {
    question: "Can I book an appointment in advance?",
    answer:
      "Yes. Where advance booking is enabled, you can select an available appointment slot and reserve your visit.",
  },
  {
    question: "Can I track my appointment?",
    answer:
      "CareCube is designed to provide appointment and queue information so you can better understand when your turn is approaching.",
  },
];

const departments = [
  {
    icon: HeartPulse,
    title: "Cardiology",
    text: "Heart and cardiovascular care",
  },
  {
    icon: Stethoscope,
    title: "General Medicine",
    text: "Everyday medical consultation",
  },
  {
    icon: Activity,
    title: "Orthopedics",
    text: "Bone, joint and mobility care",
  },
  {
    icon: Users,
    title: "Pediatrics",
    text: "Healthcare for children",
  },
];

const services = [
  {
    icon: CalendarDays,
    title: "Easy Appointment",
    text: "Book your appointment without unnecessary calls or waiting.",
  },
  {
    icon: Clock3,
    title: "Live Queue",
    text: "Know the status of your appointment and queue.",
  },
  {
    icon: QrCode,
    title: "QR Booking",
    text: "Scan and continue your booking journey from your phone.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Experience",
    text: "Your healthcare journey is designed with privacy in mind.",
  },
];

/* -------------------------------------------------------
   SMALL COMPONENTS
------------------------------------------------------- */

function FloatingCard({
  children,
  className = "",
  delay = 0,
  duration = 4,
}) {
  return (
    <motion.div
      animate={{
        y: [0, -10, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={`absolute ${className}`}
    >
      {children}
    </motion.div>
  );
}

function FeaturePill({ icon: Icon, title, text }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm">
        <Icon size={19} className="text-[#10a79b]" />
      </div>

      <div>
        <p className="text-sm font-bold text-[#183b5b]">{title}</p>
        <p className="mt-0.5 text-[11px] text-[#7790a4]">{text}</p>
      </div>
    </div>
  );
}

function SectionHeading({ eyebrow, title, description, center = false }) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#10a79b]">
        {eyebrow}
      </span>

      <h2 className="mt-4 font-serif text-4xl font-bold leading-tight tracking-tight text-[#173b5c] sm:text-5xl">
        {title}
      </h2>

      {description && (
        <p className="mt-5 text-[15px] leading-7 text-[#6f879b]">
          {description}
        </p>
      )}
    </div>
  );
}

/* -------------------------------------------------------
   HOME
------------------------------------------------------- */

function Home() {
  const { user, logout } = useAuth();

  const [query, setQuery] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [searched, setSearched] = useState(false);

  const [mobileMenu, setMobileMenu] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const [activeToken, setActiveToken] = useState(18);

  const dashboardPath = {
    patient: "/patient/dashboard",
    doctor: "/doctor/dashboard",
    centre_owner: "/centre/dashboard",
    admin: "/admin/dashboard",
  }[user?.role];

  /* ---------------------------------------------
     LIVE TOKEN ANIMATION
  --------------------------------------------- */

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveToken((current) =>
        current >= 24 ? 18 : current + 1
      );
    }, 2200);

    return () => clearInterval(timer);
  }, []);

  /* ---------------------------------------------
     DOCTOR SEARCH
  --------------------------------------------- */

  const search = async (e) => {
    e.preventDefault();

    if (!query.trim()) {
      setDoctors([]);
      setSearched(false);
      return;
    }

    try {
      const response = await api.get("/doctors/search", {
        params: {
          query: query.trim(),
        },
      });

      setDoctors(response.data.doctors || []);
      setSearched(true);
    } catch (error) {
      console.error("Doctor search failed:", error);
      setDoctors([]);
      setSearched(true);
    }
  };

  const closeMobile = () => {
    setMobileMenu(false);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-[#173b5c]">
      {/* =====================================================
          CUSTOM DESIGN SYSTEM
      ===================================================== */}

      <style>{`
        html {
          scroll-behavior: smooth;
        }

        .carecube-serif {
          font-family: Georgia, "Times New Roman", serif;
        }

        .hero-grid {
          background-image:
            linear-gradient(rgba(16,167,155,.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(16,167,155,.035) 1px, transparent 1px);
          background-size: 45px 45px;
        }

        .hero-orbit {
          animation: orbit 22s linear infinite;
        }

        .hero-orbit-reverse {
          animation: orbitReverse 28s linear infinite;
        }

        .float-slow {
          animation: floatSlow 5s ease-in-out infinite;
        }

        .float-medium {
          animation: floatMedium 4s ease-in-out infinite;
        }

        .pulse-soft {
          animation: pulseSoft 3s ease-in-out infinite;
        }

        .heartbeat {
          animation: heartbeat 2s ease-in-out infinite;
        }

        @keyframes orbit {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        @keyframes orbitReverse {
          from {
            transform: rotate(360deg);
          }

          to {
            transform: rotate(0deg);
          }
        }

        @keyframes floatSlow {
          0%, 100% {
            transform: translateY(0px);
          }

          50% {
            transform: translateY(-12px);
          }
        }

        @keyframes floatMedium {
          0%, 100% {
            transform: translateY(0px);
          }

          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes pulseSoft {
          0%, 100% {
            transform: scale(.96);
            opacity: .55;
          }

          50% {
            transform: scale(1.05);
            opacity: .9;
          }
        }

        @keyframes heartbeat {
          0%, 100% {
            transform: scale(1);
          }

          15% {
            transform: scale(1.08);
          }

          30% {
            transform: scale(1);
          }

          45% {
            transform: scale(1.06);
          }

          60% {
            transform: scale(1);
          }
        }

        .medical-cross::before,
        .medical-cross::after {
          content: "";
          position: absolute;
          background: currentColor;
          border-radius: 5px;
        }

        .medical-cross::before {
          width: 46%;
          height: 16%;
          left: 27%;
          top: 42%;
        }

        .medical-cross::after {
          width: 16%;
          height: 46%;
          left: 42%;
          top: 27%;
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
            transition-duration: .01ms !important;
          }
        }
      `}</style>

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <header className="sticky top-0 z-[100] border-b border-[#e7eeee] bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[82px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
          {/* LOGO */}

          <Link
            to="/"
            onClick={closeMobile}
            className="shrink-0"
          >
            <Logo size="md" />
          </Link>

          {/* DESKTOP NAV */}

          <nav className="hidden items-center gap-1 xl:flex">
            <a
              href="#home"
              className="rounded-xl px-4 py-3 text-sm font-bold text-[#10a79b] transition hover:bg-[#effaf8]"
            >
              Home
            </a>

            <a
              href="#about"
              className="rounded-xl px-4 py-3 text-sm font-semibold text-[#516b82] transition hover:bg-[#effaf8] hover:text-[#10a79b]"
            >
              About Us
            </a>

            <a
              href="#departments"
              className="rounded-xl px-4 py-3 text-sm font-semibold text-[#516b82] transition hover:bg-[#effaf8] hover:text-[#10a79b]"
            >
              Departments
            </a>

            <Link
              to="/explore"
              className="rounded-xl px-4 py-3 text-sm font-semibold text-[#516b82] transition hover:bg-[#effaf8] hover:text-[#10a79b]"
            >
              Doctors
            </Link>

            <a
              href="#services"
              className="rounded-xl px-4 py-3 text-sm font-semibold text-[#516b82] transition hover:bg-[#effaf8] hover:text-[#10a79b]"
            >
              Services
            </a>

            <a
              href="#contact"
              className="rounded-xl px-4 py-3 text-sm font-semibold text-[#516b82] transition hover:bg-[#effaf8] hover:text-[#10a79b]"
            >
              Contact
            </a>
          </nav>

          {/* DESKTOP ACTION */}

          <div className="hidden items-center gap-3 xl:flex">
            {user ? (
              <>
                <NotificationBell />

                <Link
                  to={dashboardPath}
                  className="rounded-2xl bg-[#123b5a] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#123b5a]/15 transition hover:-translate-y-0.5 hover:bg-[#0e6f74]"
                >
                  Dashboard
                </Link>

                <button
                  onClick={logout}
                  className="rounded-2xl border border-[#dce7eb] bg-white px-5 py-3 text-sm font-bold text-[#4e687d] transition hover:border-[#10a79b] hover:text-[#10a79b]"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-2xl bg-[#123b5a] px-6 py-3 text-sm font-bold text-white shadow-xl shadow-[#123b5a]/15 transition hover:-translate-y-0.5 hover:bg-[#0e6f74]"
                >
                  🔐 Login
                </Link>
              </>
            )}
          </div>

          {/* MOBILE ACTION */}

          <div className="flex items-center gap-2 xl:hidden">
            {user && <NotificationBell />}

            {!user && (
              <Link
                to="/login"
                className="rounded-xl bg-[#123b5a] px-4 py-2.5 text-sm font-bold text-white"
              >
                Login
              </Link>
            )}

            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={mobileMenu}
              onClick={() => setMobileMenu((value) => !value)}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#dce7eb] bg-white text-[#123b5a]"
            >
              {mobileMenu ? (
                <X size={22} />
              ) : (
                <Menu size={22} />
              )}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}

        <AnimatePresence>
          {mobileMenu && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-[#e7eeee] bg-white xl:hidden"
            >
              <div className="mx-auto max-w-[1440px] px-5 py-5 sm:px-8">
                <div className="grid gap-1">
                  {[
                    ["#home", "Home"],
                    ["#about", "About Us"],
                    ["#departments", "Departments"],
                    ["#services", "Services"],
                    ["#contact", "Contact"],
                  ].map(([href, label]) => (
                    <a
                      key={href}
                      href={href}
                      onClick={closeMobile}
                      className="rounded-xl px-4 py-3.5 font-bold text-[#516b82] hover:bg-[#effaf8] hover:text-[#10a79b]"
                    >
                      {label}
                    </a>
                  ))}

                  <Link
                    to="/explore"
                    onClick={closeMobile}
                    className="rounded-xl px-4 py-3.5 font-bold text-[#516b82] hover:bg-[#effaf8] hover:text-[#10a79b]"
                  >
                    Doctors
                  </Link>

                  {!user ? (
                    <Link
                      to="/login"
                      onClick={closeMobile}
                      className="mt-2 flex items-center justify-center rounded-xl bg-[#123b5a] px-4 py-3.5 font-bold text-white"
                    >
                      🔐 Login
                    </Link>
                  ) : (
                    <>
                      <Link
                        to={dashboardPath}
                        onClick={closeMobile}
                        className="mt-2 rounded-xl bg-[#10a79b] px-4 py-3.5 text-center font-bold text-white"
                      >
                        Dashboard
                      </Link>

                      <button
                        onClick={() => {
                          closeMobile();
                          logout();
                        }}
                        className="rounded-xl border border-[#dce7eb] px-4 py-3.5 font-bold text-[#516b82]"
                      >
                        Logout
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* =====================================================
          HERO
      ===================================================== */}

      <main>
        <section
          id="home"
          className="relative isolate overflow-hidden bg-[#ecfbfa]"
        >
          {/* BACKGROUND */}

          <div className="hero-grid pointer-events-none absolute inset-0 opacity-60" />

          <div className="pointer-events-none absolute -right-40 -top-32 h-[520px] w-[520px] rounded-full bg-[#b9eee9]/70 blur-3xl" />

          <div className="pointer-events-none absolute -left-48 bottom-[-220px] h-[500px] w-[500px] rounded-full bg-[#c9f4f0]/60 blur-3xl" />

          <div className="pointer-events-none absolute right-[20%] top-[20%] h-[360px] w-[360px] rounded-full border border-[#9edfd9]/40" />

          <div className="relative mx-auto max-w-[1440px] px-5 pb-16 pt-12 sm:px-8 sm:pb-20 sm:pt-16 lg:px-12 lg:pb-20 lg:pt-20">
            <div className="grid items-center gap-14 lg:grid-cols-[1.02fr_.98fr]">
              {/* LEFT */}

              <div className="relative z-10 text-center lg:text-left">
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#b6ebe5] bg-[#dcf7f4] px-5 py-2.5 text-xs font-extrabold text-[#109e94]"
                >
                  <Sparkles size={14} />
                  Smart Healthcare
                  <span className="text-[#79c8c1]">•</span>
                  Simple Care
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.08 }}
                  className="carecube-serif text-[48px] font-bold leading-[0.98] tracking-[-0.04em] text-[#102f4c] sm:text-[64px] lg:text-[76px] xl:text-[82px]"
                >
                  Healthcare that
                  <span className="block text-[#13a497]">
                    cares for you.
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.65, delay: 0.18 }}
                  className="mx-auto mt-7 max-w-[650px] text-base leading-8 text-[#66839b] sm:text-lg lg:mx-0"
                >
                  CareCube connects patients, doctors and hospitals through
                  a smarter healthcare experience designed to make medical
                  care simple, organized and accessible.
                </motion.p>

                {/* CTA */}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.65, delay: 0.28 }}
                  className="mt-9 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start"
                >
                  <Link
                    to="/explore"
                    className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-[#10a79b] px-7 py-4 text-sm font-extrabold text-white shadow-[0_18px_40px_-16px_rgba(16,167,155,.65)] transition hover:-translate-y-1 hover:bg-[#0e9489]"
                  >
                    <CalendarDays size={17} />
                    Book An Appointment
                    <ArrowRight
                      size={17}
                      className="transition group-hover:translate-x-1"
                    />
                  </Link>

                  <a
                    href="#how-it-works"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#bcdde0] bg-white/80 px-7 py-4 text-sm font-extrabold text-[#244f69] shadow-sm transition hover:-translate-y-1 hover:border-[#10a79b] hover:text-[#10a79b]"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#e9f8f7] text-[#10a79b]">
                      ▶
                    </span>
                    How It Works
                  </a>
                </motion.div>

                {/* HERO FEATURES */}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.4 }}
                  className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3 lg:max-w-[700px]"
                >
                  <FeaturePill
                    icon={Check}
                    title="Easy Booking"
                    text="Simple appointment process"
                  />

                  <FeaturePill
                    icon={Zap}
                    title="Smart Queue"
                    text="Track your appointment"
                  />

                  <FeaturePill
                    icon={ShieldCheck}
                    title="Secure"
                    text="Your information stays protected"
                  />
                </motion.div>
              </div>

              {/* RIGHT VISUAL */}

              <div className="relative mx-auto h-[480px] w-full max-w-[620px] sm:h-[570px]">
                {/* LARGE CIRCLES */}

                <div className="absolute left-1/2 top-1/2 h-[390px] w-[390px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#a4ded9]/50 sm:h-[490px] sm:w-[490px]" />

                <div className="absolute left-1/2 top-1/2 h-[310px] w-[310px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#a4ded9]/40 sm:h-[400px] sm:w-[400px]" />

                <div className="pulse-soft absolute left-1/2 top-1/2 h-[250px] w-[250px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#9de2dc]/40 blur-3xl sm:h-[340px] sm:w-[340px]" />

                {/* ORBIT */}

                <div className="hero-orbit absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[#8bd6d0]/50 sm:h-[510px] sm:w-[510px]">
                  <div className="absolute left-[8%] top-[10%] h-4 w-4 rounded-full bg-[#10a79b] shadow-lg shadow-[#10a79b]/40" />
                </div>

                {/* MAIN MEDICAL CARD */}

                <motion.div
                  initial={{ opacity: 0, scale: 0.88, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{
                    duration: 0.9,
                    delay: 0.15,
                    type: "spring",
                    stiffness: 70,
                  }}
                  className="absolute left-1/2 top-1/2 flex h-[285px] w-[245px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[42px] border border-white/90 bg-white/90 shadow-[0_40px_100px_-30px_rgba(22,105,105,.35)] backdrop-blur-xl sm:h-[345px] sm:w-[300px]"
                >
                  {/* inner glow */}

                  <div className="absolute inset-6 rounded-[34px] bg-gradient-to-br from-[#ecfbfa] to-[#f9ffff]" />

                  {/* MEDICAL ICON */}

                  <div className="relative flex h-32 w-32 items-center justify-center rounded-[34px] bg-[#e0f7f4] shadow-inner sm:h-40 sm:w-40">
                    <div className="medical-cross relative h-20 w-20 text-[#10a79b] sm:h-24 sm:w-24" />

                    <div className="absolute -right-2 bottom-1 flex h-9 w-9 items-center justify-center rounded-xl bg-[#10a79b] text-white shadow-lg">
                      <PlusIcon />
                    </div>
                  </div>

                  {/* HEART */}

                  <Heart
                    size={24}
                    fill="#f06f76"
                    className="heartbeat absolute right-10 top-10 text-[#f06f76]"
                  />
                </motion.div>

                {/* CONFIRMED CARD */}

                <FloatingCard
                  delay={0.2}
                  duration={4.2}
                  className="right-0 top-16 z-20 sm:right-1"
                >
                  <div className="flex w-[205px] items-center gap-3 rounded-2xl border border-white/80 bg-white/95 p-4 shadow-[0_20px_50px_-20px_rgba(20,80,100,.3)] backdrop-blur-xl">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#e7f7f4] text-[#10a79b]">
                      <Check size={21} />
                    </div>

                    <div>
                      <p className="text-[11px] font-extrabold text-[#244f69]">
                        Appointment Confirmed
                      </p>

                      <p className="mt-1 text-[10px] text-[#8aa0b0]">
                        Your doctor is ready
                      </p>
                    </div>
                  </div>
                </FloatingCard>

                {/* CONNECTED CARE */}

                <FloatingCard
                  delay={0.8}
                  duration={4.7}
                  className="bottom-24 left-0 z-20"
                >
                  <div className="flex w-[190px] items-center gap-3 rounded-2xl border border-white/80 bg-white/95 p-4 shadow-[0_20px_50px_-20px_rgba(20,80,100,.3)] backdrop-blur-xl">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf8f7] text-[#10a79b]">
                      <Hospital size={18} />
                    </div>

                    <div>
                      <p className="text-[11px] font-extrabold text-[#244f69]">
                        Connected Care
                      </p>

                      <p className="mt-1 text-[10px] text-[#8aa0b0]">
                        Hospitals & doctors
                      </p>
                    </div>
                  </div>
                </FloatingCard>

                {/* PLUS BUTTON */}

                <motion.div
                  animate={{
                    y: [0, -7, 0],
                    rotate: [0, 4, 0],
                  }}
                  transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute bottom-[80px] left-[30%] z-20 hidden h-12 w-12 items-center justify-center rounded-2xl bg-[#10a79b] text-white shadow-xl shadow-[#10a79b]/30 sm:flex"
                >
                  <span className="text-2xl font-light">+</span>
                </motion.div>

                {/* LIVE STATUS */}

                <FloatingCard
                  delay={1}
                  duration={5}
                  className="bottom-6 right-0 z-20"
                >
                  <div className="rounded-2xl border border-white/80 bg-white/95 p-4 shadow-xl backdrop-blur-xl">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#10a79b]" />
                      <span className="text-[10px] font-extrabold text-[#244f69]">
                        LIVE AVAILABILITY
                      </span>
                    </div>

                    <p className="mt-2 text-sm font-black text-[#173b5c]">
                      12 doctors available
                    </p>
                  </div>
                </FloatingCard>

                {/* DECORATIVE DOTS */}

                <div className="absolute left-8 top-24 h-3 w-3 rounded-full bg-[#10a79b]/60" />
                <div className="absolute bottom-28 right-20 h-2.5 w-2.5 rounded-full bg-[#f07b83]/70" />
                <div className="absolute right-10 top-40 h-2 w-2 rounded-full bg-[#6c8de7]/60" />
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            SEARCH RESULTS
        ===================================================== */}

        {searched && (
          <section className="border-b border-[#e9eeee] bg-[#f8fbfb] px-5 py-16 sm:px-8 lg:px-12">
            <div className="mx-auto max-w-6xl">
              <div className="mb-8">
                <span className="text-xs font-extrabold uppercase tracking-[.18em] text-[#10a79b]">
                  Search Results
                </span>

                <h2 className="mt-3 font-serif text-3xl font-bold text-[#173b5c]">
                  Doctors matching "{query}"
                </h2>
              </div>

              {doctors.length === 0 ? (
                <div className="rounded-3xl border border-[#e1ebed] bg-white p-12 text-center shadow-sm">
                  <Stethoscope
                    size={48}
                    className="mx-auto text-[#a9c0c9]"
                  />

                  <h3 className="mt-4 font-bold text-[#244f69]">
                    No verified doctors found
                  </h3>

                  <p className="mt-2 text-sm text-[#8297a6]">
                    Try another search or explore all doctors.
                  </p>

                  <Link
                    to="/explore"
                    className="mt-6 inline-flex rounded-xl bg-[#10a79b] px-5 py-3 text-sm font-bold text-white"
                  >
                    Explore Doctors
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {doctors.map((doctor) => (
                    <motion.div
                      key={doctor._id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-3xl border border-[#e2ebed] bg-white p-5 shadow-sm"
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
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e5f7f4] text-xl font-black text-[#10a79b]">
                              {doctor.name?.[0]}
                            </div>
                          )}

                          <div>
                            <h3 className="font-bold text-[#173b5c]">
                              Dr. {doctor.name}
                            </h3>

                            <p className="mt-1 text-sm font-bold text-[#10a79b]">
                              {doctor.specialization}
                            </p>

                            <p className="mt-1 text-xs text-[#8196a5]">
                              {doctor.qualification}
                            </p>
                          </div>
                        </div>

                        <Link
                          to={`/doctor/${doctor._id}`}
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#123b5a] px-5 py-3 text-sm font-bold text-white"
                        >
                          View Profile
                          <ArrowRight size={16} />
                        </Link>
                      </div>

                      {(doctor.chambers || []).length > 0 && (
                        <div className="mt-5 space-y-2">
                          {doctor.chambers.map((centre) => (
                            <div
                              key={centre._id}
                              className="rounded-2xl bg-[#f6faf9] p-4"
                            >
                              <div className="flex gap-3">
                                <MapPin
                                  size={18}
                                  className="mt-0.5 text-[#10a79b]"
                                />

                                <div>
                                  <p className="text-sm font-bold text-[#244f69]">
                                    {centre.name}
                                  </p>

                                  <p className="mt-1 text-xs text-[#8196a5]">
                                    {centre.address}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* =====================================================
            ABOUT
        ===================================================== */}

        <section
          id="about"
          className="scroll-mt-24 bg-white py-24"
        >
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
            <div className="grid items-center gap-14 lg:grid-cols-2">
              <div>
                <SectionHeading
                  eyebrow="About CareCube"
                  title="Healthcare should feel simple."
                  description="From finding the right doctor to walking out of the chamber, CareCube brings the important parts of the appointment journey together in one connected experience."
                />

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl border border-[#e4eeee] bg-[#f7fbfa] p-5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#10a79b] shadow-sm">
                      <Search size={20} />
                    </div>

                    <h3 className="mt-5 font-bold text-[#173b5c]">
                      Find the right care
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-[#7c92a1]">
                      Discover doctors and healthcare centres based on your
                      needs.
                    </p>
                  </div>

                  <div className="rounded-3xl border border-[#e4eeee] bg-[#f7fbfa] p-5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#10a79b] shadow-sm">
                      <CalendarDays size={20} />
                    </div>

                    <h3 className="mt-5 font-bold text-[#173b5c]">
                      Book with confidence
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-[#7c92a1]">
                      See available appointment options before you visit.
                    </p>
                  </div>
                </div>
              </div>

              {/* ABOUT VISUAL */}

              <div className="relative mx-auto w-full max-w-[500px]">
                <div className="absolute -inset-5 rounded-[40px] bg-[#dff7f4] blur-2xl" />

                <div className="relative overflow-hidden rounded-[38px] border border-white bg-[#eaf9f7] p-6 shadow-[0_30px_80px_-30px_rgba(20,100,100,.25)]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-[.16em] text-[#10a79b]">
                        CareCube
                      </p>

                      <p className="mt-1 text-xl font-black text-[#173b5c]">
                        Your care journey
                      </p>
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#10a79b] shadow-sm">
                      <HeartPulse size={21} />
                    </div>
                  </div>

                  <div className="mt-7 rounded-3xl bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-extrabold uppercase tracking-[.14em] text-[#9aadb8]">
                          Appointment
                        </p>

                        <p className="mt-2 font-black text-[#173b5c]">
                          Cardiology Consultation
                        </p>
                      </div>

                      <span className="rounded-full bg-[#e5f8f4] px-3 py-1.5 text-[10px] font-extrabold text-[#10a79b]">
                        CONFIRMED
                      </span>
                    </div>

                    <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#edf3f3]">
                      <motion.div
                        animate={{
                          width: ["35%", "78%", "55%", "82%"],
                        }}
                        transition={{
                          duration: 6,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="h-full rounded-full bg-[#10a79b]"
                      />
                    </div>

                    <div className="mt-5 grid grid-cols-3 gap-2">
                      <div className="rounded-2xl bg-[#f7fbfa] p-3">
                        <p className="text-[9px] text-[#9aadb8]">
                          DOCTOR
                        </p>
                        <p className="mt-1 text-xs font-bold text-[#244f69]">
                          Dr. Rahul
                        </p>
                      </div>

                      <div className="rounded-2xl bg-[#f7fbfa] p-3">
                        <p className="text-[9px] text-[#9aadb8]">
                          TOKEN
                        </p>
                        <p className="mt-1 text-xs font-bold text-[#244f69]">
                          #{activeToken}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-[#f7fbfa] p-3">
                        <p className="text-[9px] text-[#9aadb8]">
                          STATUS
                        </p>
                        <p className="mt-1 text-xs font-bold text-[#10a79b]">
                          Live
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-white/80 p-4">
                      <Check className="text-[#10a79b]" size={18} />
                      <p className="mt-3 text-xs font-bold text-[#244f69]">
                        Easy Booking
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white/80 p-4">
                      <Clock3 className="text-[#10a79b]" size={18} />
                      <p className="mt-3 text-xs font-bold text-[#244f69]">
                        Live Queue
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            DEPARTMENTS
        ===================================================== */}

        <section
          id="departments"
          className="scroll-mt-24 bg-[#f7fbfa] py-24"
        >
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
            <SectionHeading
              eyebrow="Departments"
              title="Care for every important need."
              description="Explore healthcare specialties and find the right doctor for your appointment."
              center
            />

            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {departments.map((department, index) => {
                const Icon = department.icon;

                return (
                  <motion.div
                    key={department.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 }}
                    whileHover={{ y: -7 }}
                    className="group rounded-[28px] border border-[#e1eceb] bg-white p-6 shadow-sm transition hover:border-[#bde5e0] hover:shadow-xl hover:shadow-[#10a79b]/10"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e8f8f6] text-[#10a79b] transition group-hover:bg-[#10a79b] group-hover:text-white">
                      <Icon size={25} />
                    </div>

                    <h3 className="mt-6 font-bold text-[#173b5c]">
                      {department.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-[#7d93a2]">
                      {department.text}
                    </p>

                    <Link
                      to="/explore"
                      className="mt-5 inline-flex items-center gap-1 text-xs font-extrabold text-[#10a79b]"
                    >
                      Find Doctors
                      <ArrowRight size={14} />
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* =====================================================
            SERVICES
        ===================================================== */}

        <section
          id="services"
          className="scroll-mt-24 bg-white py-24"
        >
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
            <div className="grid gap-14 lg:grid-cols-[.75fr_1.25fr]">
              <SectionHeading
                eyebrow="Our Services"
                title="A better appointment experience."
                description="CareCube brings together the digital steps around your healthcare visit."
              />

              <div className="grid gap-4 sm:grid-cols-2">
                {services.map((service, index) => {
                  const Icon = service.icon;

                  return (
                    <motion.div
                      key={service.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.08 }}
                      className="rounded-3xl border border-[#e4eeee] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#bfe6e1] hover:shadow-lg"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e8f8f6] text-[#10a79b]">
                        <Icon size={21} />
                      </div>

                      <h3 className="mt-5 font-bold text-[#173b5c]">
                        {service.title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-[#7d93a2]">
                        {service.text}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            FEATURED DOCTORS
        ===================================================== */}

        <section className="bg-[#f7fbfa] py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
            <div className="mb-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <SectionHeading
                eyebrow="Our Doctors"
                title="Meet trusted doctors."
                description="Discover selected doctors available through the CareCube network."
              />

              <Link
                to="/explore"
                className="inline-flex shrink-0 items-center gap-2 rounded-2xl border border-[#cfe3e4] bg-white px-5 py-3 text-sm font-bold text-[#244f69] transition hover:border-[#10a79b] hover:text-[#10a79b]"
              >
                Explore All Doctors
                <ArrowRight size={16} />
              </Link>
            </div>

            <FeaturedDoctors />
          </div>
        </section>

        {/* =====================================================
            LIVE QUEUE
        ===================================================== */}

        <section
          id="how-it-works"
          className="scroll-mt-24 overflow-hidden bg-[#123b5a] py-24 text-white"
        >
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
            <div className="grid items-center gap-14 lg:grid-cols-2">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-[.2em] text-[#72d8ce]">
                  Live Appointment Tracking
                </span>

                <h2 className="mt-5 font-serif text-4xl font-bold leading-tight sm:text-5xl">
                  Don't wait without knowing.
                </h2>

                <p className="mt-6 max-w-xl leading-8 text-[#a8bdca]">
                  CareCube helps you follow the appointment journey so you
                  have a clearer idea of what is happening at the chamber.
                </p>

                <div className="mt-8 grid grid-cols-2 gap-3">
                  {[
                    ["Now Consulting", "Dr. Rahul Kumar"],
                    ["Your Token", `#${activeToken}`],
                    ["Ahead", "5 patients"],
                    ["Estimated", "18 minutes"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-2xl border border-white/10 bg-white/[.06] p-4"
                    >
                      <p className="text-[9px] font-extrabold uppercase tracking-[.15em] text-[#6f8b9d]">
                        {label}
                      </p>

                      <p className="mt-2 text-sm font-bold text-white">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* QUEUE CARD */}

              <div className="relative">
                <div className="absolute -inset-10 rounded-full bg-[#10a79b]/20 blur-3xl" />

                <div className="relative rounded-[32px] border border-white/10 bg-white/[.07] p-5 shadow-2xl backdrop-blur-xl sm:p-7">
                  <div className="flex items-center justify-between border-b border-white/10 pb-5">
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-[.18em] text-[#72d8ce]">
                        Chamber Command Centre
                      </p>

                      <p className="mt-1 text-lg font-black">
                        Cardiology OPD
                      </p>
                    </div>

                    <span className="flex items-center gap-2 rounded-full bg-[#10a79b]/15 px-3 py-2 text-xs font-bold text-[#72d8ce]">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-[#5ce1d5]" />
                      LIVE
                    </span>
                  </div>

                  <div className="mt-6 rounded-3xl bg-[#09283f] p-5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#688398]">
                        CURRENTLY CONSULTING
                      </span>

                      <span className="text-xs font-black text-[#72d8ce]">
                        TOKEN #{activeToken}
                      </span>
                    </div>

                    <div className="mt-5 flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#10a79b]/15 text-[#72d8ce]">
                        <Stethoscope size={25} />
                      </div>

                      <div>
                        <p className="font-black">
                          Dr. Rahul Kumar
                        </p>

                        <p className="text-sm text-[#708a9d]">
                          Cardiologist
                        </p>
                      </div>
                    </div>

                    <div className="mt-7">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#6c8496]">
                          QUEUE PROGRESS
                        </span>

                        <span className="font-black text-[#72d8ce]">
                          72%
                        </span>
                      </div>

                      <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/10">
                        <motion.div
                          animate={{
                            width: ["50%", "72%", "61%", "72%"],
                          }}
                          transition={{
                            duration: 6,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          className="h-full rounded-full bg-[#10a79b]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-2 overflow-hidden">
                    {[18, 19, 20, 21, 22, 23, 24].map(
                      (token) => (
                        <motion.div
                          key={token}
                          animate={{
                            scale:
                              activeToken === token ? 1.1 : 1,
                            y:
                              activeToken === token ? -4 : 0,
                          }}
                          className={`flex h-10 min-w-10 items-center justify-center rounded-xl border text-xs font-black ${
                            activeToken === token
                              ? "border-[#72d8ce]/40 bg-[#10a79b]/20 text-[#72d8ce]"
                              : "border-white/10 bg-white/[.03] text-[#657e90]"
                          }`}
                        >
                          #{token}
                        </motion.div>
                      )
                    )}
                  </div>

                  <div className="mt-6 grid gap-2 sm:grid-cols-3">
                    {[
                      "Doctor consulting",
                      "Queue moving",
                      "Appointment confirmed",
                    ].map((status) => (
                      <div
                        key={status}
                        className="flex items-center gap-2 rounded-xl bg-white/[.04] px-3 py-2 text-xs font-bold text-[#8197a7]"
                      >
                        <Check
                          size={14}
                          className="text-[#72d8ce]"
                        />

                        {status}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            QR BOOKING
        ===================================================== */}

        <section className="bg-white py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
            <div className="grid items-center gap-16 lg:grid-cols-2">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-[.2em] text-[#10a79b]">
                  QR Booking
                </span>

                <h2 className="mt-5 font-serif text-4xl font-bold leading-tight text-[#173b5c] sm:text-5xl">
                  Scan.
                  <span className="text-[#10a79b]"> Book.</span>
                  <br />
                  Track.
                </h2>

                <p className="mt-6 max-w-xl leading-8 text-[#71889a]">
                  See a CareCube QR code at a participating healthcare
                  centre? Scan it and continue your appointment journey
                  from your phone.
                </p>

                <div className="mt-8 flex flex-wrap gap-2">
                  {[
                    "Scan QR",
                    "Select Doctor",
                    "Choose Slot",
                    "Track Queue",
                  ].map((item, index) => (
                    <div
                      key={item}
                      className="flex items-center gap-2 rounded-full border border-[#e0ebeb] bg-[#f9fcfb] px-4 py-2.5 text-xs font-bold text-[#516b82]"
                    >
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#e6f8f5] text-[10px] text-[#10a79b]">
                        {index + 1}
                      </span>

                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* PHONE */}

              <div className="relative mx-auto h-[500px] w-full max-w-[350px]">
                <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#dff7f4] blur-3xl" />

                <motion.div
                  initial={{
                    opacity: 0,
                    y: 40,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    duration: 0.8,
                  }}
                  className="absolute left-1/2 top-1/2 h-[480px] w-[250px] -translate-x-1/2 -translate-y-1/2 rounded-[40px] border-[7px] border-[#173b5c] bg-[#173b5c] p-2 shadow-[0_40px_100px_-30px_rgba(20,70,90,.45)]"
                >
                  <div className="relative h-full overflow-hidden rounded-[31px] bg-[#f7fbfa]">
                    <div className="mx-auto mt-3 h-5 w-24 rounded-full bg-[#173b5c]" />

                    <div className="p-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[9px] font-extrabold uppercase tracking-[.15em] text-[#10a79b]">
                            CareCube
                          </p>

                          <p className="mt-1 text-lg font-black text-[#173b5c]">
                            Book visit
                          </p>
                        </div>

                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#10a79b] text-white">
                          <QrCode size={18} />
                        </div>
                      </div>

                      {/* QR */}

                      <div className="mt-6 rounded-3xl bg-[#173b5c] p-5">
                        <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-2xl bg-white p-3">
                          <div className="grid h-full w-full grid-cols-7 gap-1">
                            {Array.from({
                              length: 49,
                            }).map((_, index) => (
                              <span
                                key={index}
                                className={
                                  (index * 13) % 7 < 3 ||
                                  index % 11 === 0 ||
                                  index % 5 === 0
                                    ? "rounded-[2px] bg-[#173b5c]"
                                    : "rounded-[2px] bg-white"
                                }
                              />
                            ))}
                          </div>
                        </div>

                        <p className="mt-4 text-center text-xs font-bold text-[#91a8b7]">
                          Scan to continue
                        </p>
                      </div>

                      <div className="mt-5 space-y-2">
                        {[
                          ["Doctor", "Dr. Ananya Sharma"],
                          ["Specialty", "Cardiology"],
                          ["Slot", "Tomorrow • 10:30 AM"],
                        ].map(([label, value]) => (
                          <div
                            key={label}
                            className="rounded-2xl border border-[#e4eeee] bg-white p-3"
                          >
                            <p className="text-[8px] font-extrabold uppercase tracking-[.12em] text-[#9aadb8]">
                              {label}
                            </p>

                            <p className="mt-1 text-xs font-black text-[#244f69]">
                              {value}
                            </p>
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

        {/* =====================================================
            REVIEWS
        ===================================================== */}

        <section className="bg-[#f7fbfa] py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
            <SectionHeading
              eyebrow="Patient Stories"
              title="Real people. Real experiences."
              description="See what patients say about their healthcare journey."
              center
            />

            <div className="mt-12">
              <ReviewsSection />
            </div>
          </div>
        </section>

        {/* =====================================================
            FAQ
        ===================================================== */}

        <section className="bg-white py-24">
          <div className="mx-auto max-w-3xl px-5 sm:px-8">
            <SectionHeading
              eyebrow="FAQs"
              title="Questions, answered."
              description="A quick guide to the CareCube experience."
              center
            />

            <div className="mt-12 space-y-3">
              {faqData.map((faq, index) => {
                const isOpen = openFaq === index;

                return (
                  <div
                    key={faq.question}
                    className={`overflow-hidden rounded-3xl border transition ${
                      isOpen
                        ? "border-[#bfe6e1] bg-[#f1fbf9]"
                        : "border-[#e3ecee] bg-white"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setOpenFaq(isOpen ? -1 : index)
                      }
                      className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left sm:px-6"
                    >
                      <span className="font-bold text-[#173b5c]">
                        {faq.question}
                      </span>

                      <ChevronDown
                        size={20}
                        className={`shrink-0 transition ${
                          isOpen
                            ? "rotate-180 text-[#10a79b]"
                            : "text-[#8ba0ad]"
                        }`}
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{
                            height: 0,
                            opacity: 0,
                          }}
                          animate={{
                            height: "auto",
                            opacity: 1,
                          }}
                          exit={{
                            height: 0,
                            opacity: 0,
                          }}
                        >
                          <p className="px-5 pb-6 text-sm leading-7 text-[#6f8798] sm:px-6">
                            {faq.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* =====================================================
            CONTACT / CTA
        ===================================================== */}

        <section
          id="contact"
          className="scroll-mt-24 bg-[#f7fbfa] px-5 py-20 sm:px-8 lg:px-12"
        >
          <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[40px] bg-[#123b5a] px-7 py-16 text-center shadow-2xl sm:px-12 lg:px-20">
            <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[#10a79b]/20 blur-3xl" />

            <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-[#58d6cd]/10 blur-3xl" />

            <div className="relative mx-auto max-w-3xl">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#10a79b] text-white shadow-xl shadow-[#10a79b]/20">
                <HeartPulse size={29} />
              </div>

              <p className="mt-6 text-xs font-extrabold uppercase tracking-[.2em] text-[#72d8ce]">
                Get in touch
              </p>

              <h2 className="mt-4 font-serif text-4xl font-bold leading-tight text-white sm:text-5xl">
                Let's make healthcare
                <span className="block text-[#72d8ce]">
                  simpler together.
                </span>
              </h2>

              <p className="mx-auto mt-5 max-w-2xl leading-7 text-[#a9bfcc]">
                Have a question, suggestion or want to partner with
                CareCube? We would love to hear from you.
              </p>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  to="/explore"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#10a79b] px-7 py-4 font-bold text-white transition hover:-translate-y-1 hover:bg-[#0e9489]"
                >
                  Find a Doctor
                  <ArrowRight size={18} />
                </Link>

                <a
                  href="mailto:hello@carecube.com"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[.06] px-7 py-4 font-bold text-white transition hover:-translate-y-1 hover:bg-white/10"
                >
                  Contact CareCube
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <Footer />
    </div>
  );
}

/* -------------------------------------------------------
   PLUS ICON
------------------------------------------------------- */

function PlusIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

export default Home;