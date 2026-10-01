import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
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
  Star,
  Video,
  Navigation,
  Phone,
  Award,
  Building2,
  UserRound,
  CircleCheck,
  Brain,
  Bone,
  Baby,
  Siren,
} from "lucide-react";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

import ReviewsSection from "../components/ReviewsSection";
import FeaturedDoctors from "../components/FeaturedDoctors";
import NotificationBell from "../components/NotificationBell";
import Footer from "../components/Footer";
import Logo from "../components/Logo";

/* =========================================================
   DATA
========================================================= */

const heroImages = [
  {
    image:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1200&q=85",
    title: "Trusted Doctors",
    subtitle: "Care from experienced professionals",
  },
  {
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=85",
    title: "Modern Healthcare",
    subtitle: "Connected care for every journey",
  },
  {
    image:
      "https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=1200&q=85",
    title: "Better Patient Care",
    subtitle: "Simple, organized and accessible",
  },
  {
    image:
      "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=1200&q=85",
    title: "Connected Hospitals",
    subtitle: "Healthcare centres at your fingertips",
  },
];

const departmentImages = [
  {
    title: "Cardiology",
    text: "Heart and cardiovascular care",
    image:
      "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?auto=format&fit=crop&w=800&q=80",
    icon: HeartPulse,
  },
  {
    title: "General Medicine",
    text: "Everyday medical consultation",
    image:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=800&q=80",
    icon: Stethoscope,
  },
  {
    title: "Orthopedics",
    text: "Bone, joint and mobility care",
    image:
      "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=800&q=80",
    icon: Bone,
  },
  {
    title: "Pediatrics",
    text: "Healthcare for children",
    image:
      "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=800&q=80",
    icon: Baby,
  },
];

const hospitalImages = [
  {
    image:
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=85",
    title: "Modern Healthcare Centres",
    text: "Find trusted healthcare facilities near you.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1516841273335-e39b37888115?auto=format&fit=crop&w=1200&q=85",
    title: "Connected Care",
    text: "Doctors, chambers and patients in one ecosystem.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=85",
    title: "Organized Healthcare",
    text: "Make every appointment journey simpler.",
  },
];

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
  {
    question: "Can I use CareCube from my phone?",
    answer:
      "Yes. The CareCube interface is responsive and designed to work across smartphones, tablets and desktops.",
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
  {
    icon: Video,
    title: "Digital Experience",
    text: "Access your healthcare journey through a modern interface.",
  },
  {
    icon: Navigation,
    title: "Find Nearby Care",
    text: "Discover doctors and healthcare centres based on your needs.",
  },
];

/* =========================================================
   ANIMATION VARIANTS
========================================================= */

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 35,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const scaleIn = {
  hidden: {
    opacity: 0,
    scale: 0.88,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};

/* =========================================================
   SMALL COMPONENTS
========================================================= */

function SectionHeading({
  eyebrow,
  title,
  description,
  center = false,
}) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className={
        center
          ? "mx-auto max-w-3xl text-center"
          : "max-w-3xl"
      }
    >
      <div className="inline-flex items-center gap-2 rounded-full border border-[#D7E5F8] bg-[#F4F8FF] px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-[#2563EB]">
        <Sparkles size={12} />
        {eyebrow}
      </div>

      <h2 className="mt-5 font-serif text-4xl font-black leading-[1.05] tracking-tight text-[#102A56] sm:text-5xl lg:text-6xl">
        {title}
      </h2>

      {description && (
        <p className="mt-5 text-[15px] leading-8 text-[#71869A] sm:text-base">
          {description}
        </p>
      )}
    </motion.div>
  );
}

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
        rotate: [0, 0.5, 0],
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
    <motion.div
      whileHover={{
        y: -4,
      }}
      className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/70 p-3 backdrop-blur-md"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#EEF4FF] text-[#2563EB] shadow-sm">
        <Icon size={19} />
      </div>

      <div>
        <p className="text-sm font-black text-[#183E76]">
          {title}
        </p>

        <p className="mt-0.5 text-[11px] text-[#8094A5]">
          {text}
        </p>
      </div>
    </motion.div>
  );
}

function StatCard({ number, label, icon: Icon }) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{
        y: -7,
        scale: 1.02,
      }}
      className="rounded-3xl border border-[#DFE9F4] bg-white p-5 shadow-[0_15px_50px_-25px_rgba(30,70,130,.3)]"
    >
      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EEF4FF] text-[#2563EB]">
          <Icon size={20} />
        </div>

        <Activity
          size={18}
          className="text-[#B8C9DC]"
        />
      </div>

      <p className="mt-5 text-3xl font-black text-[#102A56]">
        {number}
      </p>

      <p className="mt-1 text-xs font-semibold text-[#8195A6]">
        {label}
      </p>
    </motion.div>
  );
}

/* =========================================================
   HOME
========================================================= */

function Home() {
  const { user, logout } = useAuth();

  const [query, setQuery] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [searched, setSearched] = useState(false);

  const [mobileMenu, setMobileMenu] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const [activeToken, setActiveToken] = useState(18);

  const [heroImage, setHeroImage] = useState(0);
  const [hospitalImage, setHospitalImage] = useState(0);

  const dashboardPath = {
    patient: "/patient/dashboard",
    doctor: "/doctor/dashboard",
    centre_owner: "/centre/dashboard",
    admin: "/admin/dashboard",
  }[user?.role];

  /* ======================================================
     HERO IMAGE SLIDER
  ====================================================== */

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroImage((current) =>
        current === heroImages.length - 1
          ? 0
          : current + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  /* ======================================================
     HOSPITAL IMAGE SLIDER
  ====================================================== */

  useEffect(() => {
    const timer = setInterval(() => {
      setHospitalImage((current) =>
        current === hospitalImages.length - 1
          ? 0
          : current + 1
      );
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  /* ======================================================
     TOKEN
  ====================================================== */

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveToken((current) =>
        current >= 24 ? 18 : current + 1
      );
    }, 2200);

    return () => clearInterval(timer);
  }, []);

  /* ======================================================
     DOCTOR SEARCH
  ====================================================== */

  const search = async (e) => {
    e.preventDefault();

    if (!query.trim()) {
      setDoctors([]);
      setSearched(false);
      return;
    }

    try {
      const response = await api.get(
        "/doctors/search",
        {
          params: {
            query: query.trim(),
          },
        }
      );

      setDoctors(response.data.doctors || []);
      setSearched(true);
    } catch (error) {
      console.error(
        "Doctor search failed:",
        error
      );

      setDoctors([]);
      setSearched(true);
    }
  };

  const closeMobile = () => {
    setMobileMenu(false);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-[#102A56]">
      {/* =====================================================
          DESIGN SYSTEM
      ===================================================== */}

      <style>{`
        html {
          scroll-behavior: smooth;
        }

        body {
          overflow-x: hidden;
        }

        .carecube-serif {
          font-family: Georgia, "Times New Roman", serif;
        }

        .hero-grid {
          background-image:
            linear-gradient(rgba(37,99,235,.045) 1px, transparent 1px),
            linear-gradient(90deg, rgba(37,99,235,.045) 1px, transparent 1px);
          background-size: 44px 44px;
        }

        .gradient-text {
          background: linear-gradient(
            90deg,
            #2563eb 0%,
            #7c3aed 50%,
            #0ea5a4 100%
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .glass {
          background: rgba(255,255,255,.72);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
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

        @keyframes pulseGlow {
          0%,100% {
            transform: scale(.95);
            opacity: .45;
          }
          50% {
            transform: scale(1.05);
            opacity: .85;
          }
        }

        @keyframes orbit {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes float {
          0%,100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-12px);
          }
        }

        @keyframes heartbeat {
          0%,100% {
            transform: scale(1);
          }
          20% {
            transform: scale(1.12);
          }
          40% {
            transform: scale(1);
          }
          60% {
            transform: scale(1.08);
          }
        }

        .pulse-glow {
          animation: pulseGlow 4s ease-in-out infinite;
        }

        .orbit {
          animation: orbit 25s linear infinite;
        }

        .float-animation {
          animation: float 5s ease-in-out infinite;
        }

        .heartbeat {
          animation: heartbeat 2s ease-in-out infinite;
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

      <header className="sticky top-0 z-[100] border-b border-[#E2EAF3] bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[78px] max-w-[1500px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <Link
            to="/"
            onClick={closeMobile}
            className="shrink-0"
          >
            <Logo size="md" />
          </Link>

          {/* DESKTOP NAV */}

          <nav className="hidden items-center gap-1 xl:flex">
            {[
              ["#home", "Home"],
              ["#about", "About"],
              ["#departments", "Departments"],
              ["#services", "Services"],
              ["#how-it-works", "How It Works"],
              ["#contact", "Contact"],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="rounded-xl px-4 py-3 text-sm font-bold text-[#526B82] transition hover:bg-[#EEF4FF] hover:text-[#2563EB]"
              >
                {label}
              </a>
            ))}

            <Link
              to="/explore"
              className="rounded-xl px-4 py-3 text-sm font-bold text-[#526B82] transition hover:bg-[#EEF4FF] hover:text-[#2563EB]"
            >
              Doctors
            </Link>
          </nav>

          {/* DESKTOP ACTION */}

          <div className="hidden items-center gap-3 xl:flex">
            {user ? (
              <>
                <NotificationBell />

                <Link
                  to={dashboardPath}
                  className="rounded-2xl bg-[#102F68] px-5 py-3 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#2563EB]"
                >
                  Dashboard
                </Link>

                <button
                  onClick={logout}
                  className="rounded-2xl border border-[#D9E3EE] bg-white px-5 py-3 text-sm font-black text-[#536D82] transition hover:border-[#2563EB] hover:text-[#2563EB]"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="group flex items-center gap-2 rounded-2xl bg-[#102F68] px-6 py-3 text-sm font-black text-white shadow-xl transition hover:-translate-y-0.5 hover:bg-[#2563EB]"
              >
                Login
                <ArrowRight
                  size={16}
                  className="transition group-hover:translate-x-1"
                />
              </Link>
            )}
          </div>

          {/* MOBILE */}

          <div className="flex items-center gap-2 xl:hidden">
            {user && <NotificationBell />}

            {!user && (
              <Link
                to="/login"
                className="rounded-xl bg-[#102F68] px-4 py-2.5 text-sm font-black text-white"
              >
                Login
              </Link>
            )}

            <button
              type="button"
              aria-label="Open menu"
              onClick={() =>
                setMobileMenu((value) => !value)
              }
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#D9E3EE] bg-white text-[#102F68]"
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
              className="overflow-hidden border-t border-[#E2EAF3] bg-white xl:hidden"
            >
              <div className="mx-auto max-w-[1500px] px-5 py-5 sm:px-8">
                <div className="grid gap-1">
                  {[
                    ["#home", "Home"],
                    ["#about", "About"],
                    ["#departments", "Departments"],
                    ["#services", "Services"],
                    ["#how-it-works", "How It Works"],
                    ["#contact", "Contact"],
                  ].map(([href, label]) => (
                    <a
                      key={href}
                      href={href}
                      onClick={closeMobile}
                      className="rounded-xl px-4 py-3.5 font-bold text-[#526B82] hover:bg-[#EEF4FF] hover:text-[#2563EB]"
                    >
                      {label}
                    </a>
                  ))}

                  <Link
                    to="/explore"
                    onClick={closeMobile}
                    className="rounded-xl px-4 py-3.5 font-bold text-[#526B82] hover:bg-[#EEF4FF] hover:text-[#2563EB]"
                  >
                    Doctors
                  </Link>

                  {!user ? (
                    <Link
                      to="/login"
                      onClick={closeMobile}
                      className="mt-2 rounded-xl bg-[#102F68] px-4 py-3.5 text-center font-black text-white"
                    >
                      Login
                    </Link>
                  ) : (
                    <>
                      <Link
                        to={dashboardPath}
                        onClick={closeMobile}
                        className="mt-2 rounded-xl bg-[#2563EB] px-4 py-3.5 text-center font-black text-white"
                      >
                        Dashboard
                      </Link>

                      <button
                        onClick={() => {
                          closeMobile();
                          logout();
                        }}
                        className="rounded-xl border border-[#D9E3EE] px-4 py-3.5 font-bold text-[#526B82]"
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

      <main>
        {/* =====================================================
            HERO
        ===================================================== */}

        <section
          id="home"
          className="relative isolate overflow-hidden bg-[#F1F6FF]"
        >
          <div className="hero-grid pointer-events-none absolute inset-0" />

          <div className="pointer-events-none absolute -right-40 -top-40 h-[550px] w-[550px] rounded-full bg-[#CFE0FF] opacity-70 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-40 -left-40 h-[550px] w-[550px] rounded-full bg-[#E1D7FF] opacity-60 blur-3xl" />

          <div className="relative mx-auto max-w-[1500px] px-5 pb-20 pt-12 sm:px-8 sm:pb-24 sm:pt-16 lg:px-12 lg:pt-20">
            <div className="grid items-center gap-16 lg:grid-cols-[.95fr_1.05fr]">
              {/* LEFT */}

              <div className="relative z-10">
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#C8DAF5] bg-white/70 px-5 py-2.5 text-xs font-black text-[#2563EB] shadow-sm backdrop-blur"
                >
                  <span className="flex h-2 w-2 animate-pulse rounded-full bg-[#10B981]" />
                  Smart Healthcare
                  <span className="text-[#A7BBD1]">
                    •
                  </span>
                  Simple Care
                </motion.div>

                <motion.h1
                  initial={{
                    opacity: 0,
                    y: 30,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.8,
                    delay: 0.1,
                  }}
                  className="carecube-serif text-[48px] font-black leading-[.96] tracking-[-0.05em] text-[#102A56] sm:text-[65px] lg:text-[76px] xl:text-[88px]"
                >
                  Healthcare
                  <span className="block gradient-text">
                    that cares.
                  </span>
                </motion.h1>

                <motion.p
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.7,
                    delay: 0.25,
                  }}
                  className="mt-7 max-w-[650px] text-base leading-8 text-[#6D8498] sm:text-lg"
                >
                  Discover trusted doctors, book appointments,
                  track live queues and manage your healthcare
                  journey through one connected platform.
                </motion.p>

                {/* SEARCH */}

                <motion.form
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.7,
                    delay: 0.35,
                  }}
                  onSubmit={search}
                  className="mt-8 max-w-[670px] rounded-[22px] border border-white bg-white p-2 shadow-[0_25px_70px_-25px_rgba(30,70,140,.28)]"
                >
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <div className="flex min-h-[58px] flex-1 items-center gap-3 px-4">
                      <Search
                        size={21}
                        className="shrink-0 text-[#2563EB]"
                      />

                      <input
                        value={query}
                        onChange={(e) =>
                          setQuery(e.target.value)
                        }
                        placeholder="Search doctor, specialty..."
                        className="w-full bg-transparent text-sm font-semibold text-[#173D70] outline-none placeholder:text-[#9BAFBE]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="flex min-h-[58px] items-center justify-center gap-2 rounded-2xl bg-[#2563EB] px-7 text-sm font-black text-white shadow-lg shadow-[#2563EB]/25 transition hover:-translate-y-0.5 hover:bg-[#1D4ED8]"
                    >
                      Search
                      <ArrowRight size={17} />
                    </button>
                  </div>
                </motion.form>

                {/* CTA */}

                <motion.div
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.7,
                    delay: 0.45,
                  }}
                  className="mt-7 flex flex-col gap-3 sm:flex-row"
                >
                  <Link
                    to="/explore"
                    className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-[#102F68] px-7 py-4 text-sm font-black text-white shadow-xl shadow-[#102F68]/20 transition hover:-translate-y-1 hover:bg-[#2563EB]"
                  >
                    <CalendarDays size={17} />
                    Book Appointment
                    <ArrowRight
                      size={17}
                      className="transition group-hover:translate-x-1"
                    />
                  </Link>

                  <a
                    href="#how-it-works"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#C7D8EE] bg-white/70 px-7 py-4 text-sm font-black text-[#244F86] transition hover:-translate-y-1 hover:border-[#2563EB] hover:text-[#2563EB]"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#EEF4FF] text-[#2563EB]">
                      ▶
                    </span>
                    How It Works
                  </a>
                </motion.div>

                {/* FEATURES */}

                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="mt-8 grid gap-3 sm:grid-cols-3"
                >
                  <FeaturePill
                    icon={Check}
                    title="Easy Booking"
                    text="Simple process"
                  />

                  <FeaturePill
                    icon={Zap}
                    title="Smart Queue"
                    text="Live updates"
                  />

                  <FeaturePill
                    icon={ShieldCheck}
                    title="Secure"
                    text="Privacy focused"
                  />
                </motion.div>
              </div>

              {/* RIGHT VISUAL */}

              <div className="relative mx-auto h-[530px] w-full max-w-[650px] sm:h-[620px]">
                {/* glow */}

                <div className="pulse-glow absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#AFCBFF] blur-3xl sm:h-[500px] sm:w-[500px]" />

                {/* orbit */}

                <div className="orbit absolute left-1/2 top-1/2 h-[470px] w-[470px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[#9DBAF0] sm:h-[570px] sm:w-[570px]">
                  <div className="absolute left-[8%] top-[8%] h-4 w-4 rounded-full bg-[#2563EB] shadow-lg shadow-[#2563EB]/40" />

                  <div className="absolute bottom-[15%] right-[5%] h-3 w-3 rounded-full bg-[#8B5CF6]" />
                </div>

                {/* PHOTO CARD */}

                <motion.div
                  initial={{
                    opacity: 0,
                    scale: 0.85,
                    y: 30,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 1,
                    type: "spring",
                    stiffness: 65,
                  }}
                  className="absolute left-1/2 top-1/2 h-[390px] w-[300px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[42px] border-[8px] border-white bg-white shadow-[0_40px_100px_-25px_rgba(20,70,140,.38)] sm:h-[470px] sm:w-[360px]"
                >
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={heroImages[heroImage].image}
                      src={heroImages[heroImage].image}
                      alt={heroImages[heroImage].title}
                      initial={{
                        opacity: 0,
                        scale: 1.08,
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                      }}
                      exit={{
                        opacity: 0,
                        scale: 1.03,
                      }}
                      transition={{
                        duration: 0.8,
                      }}
                      className="h-full w-full object-cover"
                    />
                  </AnimatePresence>

                  <div className="absolute inset-0 bg-gradient-to-t from-[#061A38]/90 via-transparent to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="mb-3 flex items-center gap-2">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-[#34D399]" />

                      <span className="text-[10px] font-black uppercase tracking-[.18em] text-white/70">
                        CareCube Network
                      </span>
                    </div>

                    <h3 className="text-2xl font-black">
                      {heroImages[heroImage].title}
                    </h3>

                    <p className="mt-1 text-xs text-white/70">
                      {heroImages[heroImage].subtitle}
                    </p>

                    <div className="mt-5 flex gap-1.5">
                      {heroImages.map((_, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() =>
                            setHeroImage(index)
                          }
                          className={`h-1.5 rounded-full transition-all ${
                            heroImage === index
                              ? "w-8 bg-white"
                              : "w-2 bg-white/40"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/90 text-[#2563EB] shadow-xl backdrop-blur">
                    <Heart
                      size={20}
                      fill="currentColor"
                      className="heartbeat"
                    />
                  </div>
                </motion.div>

                {/* CONFIRMED */}

                <FloatingCard
                  delay={0.2}
                  className="right-0 top-12 z-30"
                >
                  <div className="glass flex w-[215px] items-center gap-3 rounded-2xl border border-white p-4 shadow-2xl">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#DCFCE7] text-[#16A34A]">
                      <CircleCheck size={22} />
                    </div>

                    <div>
                      <p className="text-[11px] font-black text-[#173D70]">
                        Appointment Confirmed
                      </p>

                      <p className="mt-1 text-[10px] text-[#8AA0B0]">
                        Doctor is ready
                      </p>
                    </div>
                  </div>
                </FloatingCard>

                {/* DOCTOR CARD */}

                <FloatingCard
                  delay={0.8}
                  duration={4.8}
                  className="bottom-24 left-0 z-30"
                >
                  <div className="glass w-[210px] rounded-3xl border border-white p-4 shadow-2xl">
                    <div className="flex items-center gap-3">
                      <img
                        src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=200&q=80"
                        alt="Doctor"
                        className="h-12 w-12 rounded-2xl object-cover"
                      />

                      <div>
                        <p className="text-xs font-black text-[#173D70]">
                          Dr. Ananya Sharma
                        </p>

                        <p className="mt-1 text-[10px] text-[#8196A7]">
                          Cardiologist
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-1 text-[10px] font-bold text-[#F59E0B]">
                      <Star
                        size={12}
                        fill="currentColor"
                      />
                      4.9
                      <span className="ml-1 text-[#91A2B1]">
                        Trusted doctor
                      </span>
                    </div>
                  </div>
                </FloatingCard>

                {/* LIVE */}

                <FloatingCard
                  delay={1}
                  duration={5}
                  className="bottom-3 right-0 z-30"
                >
                  <div className="glass rounded-2xl border border-white p-4 shadow-2xl">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#10B981]" />

                      <span className="text-[10px] font-black text-[#244F86]">
                        LIVE AVAILABILITY
                      </span>
                    </div>

                    <p className="mt-2 text-sm font-black text-[#102A56]">
                      12 doctors available
                    </p>
                  </div>
                </FloatingCard>

                {/* PLUS */}

                <motion.div
                  animate={{
                    y: [0, -8, 0],
                    rotate: [0, 5, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute bottom-[105px] left-[28%] z-30 hidden h-12 w-12 items-center justify-center rounded-2xl bg-[#7C3AED] text-white shadow-xl shadow-[#7C3AED]/30 sm:flex"
                >
                  <span className="text-2xl">
                    +
                  </span>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            SEARCH RESULTS
        ===================================================== */}

        {searched && (
          <section className="border-b border-[#E2EAF3] bg-[#F7FAFF] px-5 py-16 sm:px-8 lg:px-12">
            <div className="mx-auto max-w-6xl">
              <span className="text-xs font-black uppercase tracking-[.18em] text-[#2563EB]">
                Search Results
              </span>

              <h2 className="mt-3 font-serif text-3xl font-black text-[#102A56]">
                Doctors matching "{query}"
              </h2>

              <div className="mt-8">
                {doctors.length === 0 ? (
                  <div className="rounded-[32px] border border-[#DCE6F2] bg-white p-12 text-center shadow-sm">
                    <Stethoscope
                      size={48}
                      className="mx-auto text-[#A9BDD5]"
                    />

                    <h3 className="mt-4 font-black text-[#244F86]">
                      No verified doctors found
                    </h3>

                    <p className="mt-2 text-sm text-[#8297A6]">
                      Try another search or explore all doctors.
                    </p>

                    <Link
                      to="/explore"
                      className="mt-6 inline-flex rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-black text-white"
                    >
                      Explore Doctors
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {doctors.map((doctor, index) => (
                      <motion.div
                        key={doctor._id}
                        initial={{
                          opacity: 0,
                          y: 20,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        transition={{
                          delay: index * 0.08,
                        }}
                        className="rounded-[30px] border border-[#DCE6F2] bg-white p-5 shadow-sm"
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
                              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EEF4FF] text-xl font-black text-[#2563EB]">
                                {doctor.name?.[0]}
                              </div>
                            )}

                            <div>
                              <h3 className="font-black text-[#102A56]">
                                Dr. {doctor.name}
                              </h3>

                              <p className="mt-1 text-sm font-bold text-[#2563EB]">
                                {doctor.specialization}
                              </p>

                              <p className="mt-1 text-xs text-[#8196A5]">
                                {doctor.qualification}
                              </p>
                            </div>
                          </div>

                          <Link
                            to={`/doctor/${doctor._id}`}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#102F68] px-5 py-3 text-sm font-black text-white"
                          >
                            View Profile
                            <ArrowRight size={16} />
                          </Link>
                        </div>

                        {(doctor.chambers || [])
                          .length > 0 && (
                          <div className="mt-5 space-y-2">
                            {doctor.chambers.map(
                              (centre) => (
                                <div
                                  key={centre._id}
                                  className="rounded-2xl bg-[#F5F8FC] p-4"
                                >
                                  <div className="flex gap-3">
                                    <MapPin
                                      size={18}
                                      className="mt-0.5 text-[#2563EB]"
                                    />

                                    <div>
                                      <p className="text-sm font-black text-[#244F86]">
                                        {centre.name}
                                      </p>

                                      <p className="mt-1 text-xs text-[#8196A5]">
                                        {centre.address}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* =====================================================
            STATS
        ===================================================== */}

        <section className="relative z-10 -mt-1 bg-white py-10">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.2,
            }}
            className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-5 sm:px-8 lg:grid-cols-4 lg:px-12"
          >
            <StatCard
              number="500+"
              label="Doctors"
              icon={UserRound}
            />

            <StatCard
              number="100+"
              label="Healthcare Centres"
              icon={Building2}
            />

            <StatCard
              number="10K+"
              label="Appointments"
              icon={CalendarDays}
            />

            <StatCard
              number="24/7"
              label="Digital Access"
              icon={Clock3}
            />
          </motion.div>
        </section>

        {/* =====================================================
            ABOUT
        ===================================================== */}

        <section
          id="about"
          className="scroll-mt-24 bg-white py-24"
        >
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
            <div className="grid items-center gap-16 lg:grid-cols-2">
              <div>
                <SectionHeading
                  eyebrow="About CareCube"
                  title="Your complete healthcare journey, connected."
                  description="From finding the right doctor to walking out of the chamber, CareCube brings the important parts of the appointment journey together in one connected experience."
                />

                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{
                    once: true,
                  }}
                  className="mt-9 grid gap-4 sm:grid-cols-2"
                >
                  {[
                    {
                      icon: Search,
                      title: "Find the right care",
                      text: "Discover doctors and healthcare centres based on your needs.",
                    },
                    {
                      icon: CalendarDays,
                      title: "Book with confidence",
                      text: "See available appointment options before you visit.",
                    },
                    {
                      icon: Activity,
                      title: "Follow your queue",
                      text: "Understand where your appointment stands.",
                    },
                    {
                      icon: ShieldCheck,
                      title: "Designed for privacy",
                      text: "Healthcare journeys designed with security in mind.",
                    },
                  ].map((item) => {
                    const Icon = item.icon;

                    return (
                      <motion.div
                        key={item.title}
                        variants={fadeUp}
                        whileHover={{
                          y: -5,
                        }}
                        className="rounded-3xl border border-[#E0E9F3] bg-[#F8FAFD] p-5 transition hover:bg-white hover:shadow-xl"
                      >
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#2563EB] shadow-sm">
                          <Icon size={20} />
                        </div>

                        <h3 className="mt-5 font-black text-[#102A56]">
                          {item.title}
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-[#7C91A1]">
                          {item.text}
                        </p>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>

              {/* PHOTO MOSAIC */}

              <motion.div
                initial={{
                  opacity: 0,
                  x: 50,
                }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.8,
                }}
                className="relative min-h-[550px]"
              >
                <div className="absolute left-0 top-0 h-[340px] w-[70%] overflow-hidden rounded-[38px] shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=85"
                    alt="Doctor consultation"
                    className="h-full w-full object-cover transition duration-700 hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#071D40]/70 to-transparent" />

                  <div className="absolute bottom-5 left-5 right-5">
                    <p className="text-xs font-black uppercase tracking-[.15em] text-white/70">
                      CareCube
                    </p>

                    <p className="mt-1 text-xl font-black text-white">
                      Better care starts with better access.
                    </p>
                  </div>
                </div>

                <div className="absolute bottom-0 right-0 h-[300px] w-[62%] overflow-hidden rounded-[38px] border-8 border-white shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=1000&q=85"
                    alt="Hospital"
                    className="h-full w-full object-cover transition duration-700 hover:scale-105"
                  />
                </div>

                <motion.div
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                  }}
                  className="absolute bottom-[190px] left-[12%] rounded-2xl border border-white bg-white/95 p-4 shadow-2xl backdrop-blur"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#DCFCE7] text-[#16A34A]">
                      <Check size={21} />
                    </div>

                    <div>
                      <p className="text-xs font-black text-[#173D70]">
                        Connected Care
                      </p>

                      <p className="mt-1 text-[10px] text-[#8A9DAC]">
                        Doctors + Centres + Patients
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* =====================================================
            DEPARTMENTS
        ===================================================== */}

        <section
          id="departments"
          className="scroll-mt-24 bg-[#F5F8FC] py-24"
        >
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
            <SectionHeading
              eyebrow="Departments"
              title="Care for every important need."
              description="Explore healthcare specialties and find the right doctor for your appointment."
              center
            />

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
                amount: 0.1,
              }}
              className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
            >
              {departmentImages.map(
                (department) => {
                  const Icon = department.icon;

                  return (
                    <motion.div
                      key={department.title}
                      variants={scaleIn}
                      whileHover={{
                        y: -8,
                      }}
                      className="group overflow-hidden rounded-[30px] border border-[#DDE7F1] bg-white shadow-sm transition hover:shadow-2xl"
                    >
                      <div className="relative h-52 overflow-hidden">
                        <img
                          src={department.image}
                          alt={department.title}
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-[#071E40]/70 via-transparent to-transparent" />

                        <div className="absolute bottom-4 left-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/90 text-[#2563EB] shadow-lg backdrop-blur">
                          <Icon size={22} />
                        </div>
                      </div>

                      <div className="p-6">
                        <h3 className="font-black text-[#102A56]">
                          {department.title}
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-[#7D92A2]">
                          {department.text}
                        </p>

                        <Link
                          to="/explore"
                          className="mt-5 inline-flex items-center gap-1 text-xs font-black text-[#2563EB]"
                        >
                          Find Doctors
                          <ArrowRight size={14} />
                        </Link>
                      </div>
                    </motion.div>
                  );
                }
              )}
            </motion.div>
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
                title="Everything around your appointment."
                description="CareCube brings together the digital steps around your healthcare visit into one simple experience."
              />

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{
                  once: true,
                }}
                className="grid gap-4 sm:grid-cols-2"
              >
                {services.map((service) => {
                  const Icon = service.icon;

                  return (
                    <motion.div
                      key={service.title}
                      variants={fadeUp}
                      whileHover={{
                        y: -6,
                        scale: 1.01,
                      }}
                      className="group rounded-3xl border border-[#E0E9F3] bg-white p-6 shadow-sm transition hover:border-[#BFD4F3] hover:shadow-xl"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF4FF] text-[#2563EB] transition group-hover:bg-[#2563EB] group-hover:text-white">
                        <Icon size={21} />
                      </div>

                      <h3 className="mt-5 font-black text-[#102A56]">
                        {service.title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-[#7D92A2]">
                        {service.text}
                      </p>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </div>
        </section>

        {/* =====================================================
            HEALTHCARE CENTRES PHOTO SECTION
        ===================================================== */}

        <section className="overflow-hidden bg-[#F5F8FC] py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
            <div className="grid items-center gap-14 lg:grid-cols-2">
              <div>
                <SectionHeading
                  eyebrow="Healthcare Network"
                  title="A connected ecosystem of care."
                  description="CareCube is designed to connect patients with doctors, chambers, clinics and healthcare centres through one digital journey."
                />

                <div className="mt-8 space-y-3">
                  {[
                    "Discover nearby healthcare options",
                    "Check doctor availability",
                    "Book appointments",
                    "Follow queue progress",
                  ].map((item, index) => (
                    <motion.div
                      key={item}
                      initial={{
                        opacity: 0,
                        x: -20,
                      }}
                      whileInView={{
                        opacity: 1,
                        x: 0,
                      }}
                      viewport={{
                        once: true,
                      }}
                      transition={{
                        delay: index * 0.08,
                      }}
                      className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#DCFCE7] text-[#16A34A]">
                        <Check size={17} />
                      </div>

                      <span className="text-sm font-bold text-[#355777]">
                        {item}
                      </span>
                    </motion.div>
                  ))}
                </div>

                <Link
                  to="/explore"
                  className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-[#102F68] px-6 py-4 text-sm font-black text-white shadow-lg transition hover:-translate-y-1 hover:bg-[#2563EB]"
                >
                  Explore Healthcare
                  <ArrowRight size={17} />
                </Link>
              </div>

              {/* IMAGE SLIDER */}

              <motion.div
                initial={{
                  opacity: 0,
                  x: 40,
                }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.8,
                }}
                className="relative"
              >
                <div className="relative h-[500px] overflow-hidden rounded-[40px] shadow-2xl">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={
                        hospitalImages[hospitalImage]
                          .image
                      }
                      src={
                        hospitalImages[hospitalImage]
                          .image
                      }
                      alt={
                        hospitalImages[hospitalImage]
                          .title
                      }
                      initial={{
                        opacity: 0,
                        scale: 1.08,
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                      }}
                      exit={{
                        opacity: 0,
                        scale: 1.02,
                      }}
                      transition={{
                        duration: 0.8,
                      }}
                      className="h-full w-full object-cover"
                    />
                  </AnimatePresence>

                  <div className="absolute inset-0 bg-gradient-to-t from-[#061C3B] via-transparent to-transparent" />

                  <div className="absolute bottom-7 left-7 right-7 text-white">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-2 text-[10px] font-black uppercase tracking-[.16em] backdrop-blur">
                      <Hospital size={13} />
                      Healthcare Centre
                    </div>

                    <h3 className="text-2xl font-black sm:text-3xl">
                      {
                        hospitalImages[hospitalImage]
                          .title
                      }
                    </h3>

                    <p className="mt-2 max-w-md text-sm leading-6 text-white/70">
                      {
                        hospitalImages[hospitalImage]
                          .text
                      }
                    </p>

                    <div className="mt-5 flex items-center justify-between">
                      <div className="flex gap-1.5">
                        {hospitalImages.map(
                          (_, index) => (
                            <button
                              key={index}
                              onClick={() =>
                                setHospitalImage(
                                  index
                                )
                              }
                              className={`h-1.5 rounded-full transition-all ${
                                hospitalImage ===
                                index
                                  ? "w-8 bg-white"
                                  : "w-2 bg-white/40"
                              }`}
                            />
                          )
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setHospitalImage(
                              hospitalImage === 0
                                ? hospitalImages.length -
                                  1
                                : hospitalImage - 1
                            )
                          }
                          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur transition hover:bg-white/20"
                        >
                          <ChevronLeft size={18} />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setHospitalImage(
                              hospitalImage ===
                                hospitalImages.length -
                                  1
                                ? 0
                                : hospitalImage + 1
                            )
                          }
                          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur transition hover:bg-white/20"
                        >
                          <ChevronRight size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating location */}

                <motion.div
                  animate={{
                    y: [0, -8, 0],
                  }}
                  transition={{
                    duration: 3.5,
                    repeat: Infinity,
                  }}
                  className="absolute -left-5 top-10 hidden rounded-2xl border border-white bg-white p-4 shadow-2xl sm:block"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF4FF] text-[#2563EB]">
                      <MapPin size={18} />
                    </div>

                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wide text-[#9AAAB7]">
                        Nearby
                      </p>

                      <p className="mt-1 text-xs font-black text-[#244F86]">
                        Care centres
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* =====================================================
            FEATURED DOCTORS
        ===================================================== */}

        <section className="bg-white py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
            <div className="mb-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <SectionHeading
                eyebrow="Our Doctors"
                title="Meet trusted doctors."
                description="Discover selected doctors available through the CareCube network."
              />

              <Link
                to="/explore"
                className="inline-flex shrink-0 items-center gap-2 rounded-2xl border border-[#D0DEEC] bg-white px-5 py-3 text-sm font-black text-[#244F86] transition hover:border-[#2563EB] hover:text-[#2563EB]"
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
          className="scroll-mt-24 overflow-hidden bg-[#071E40] py-24 text-white"
        >
          <div className="pointer-events-none absolute" />

          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
            <div className="grid items-center gap-14 lg:grid-cols-2">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-black uppercase tracking-[.2em] text-[#9ABEFF]">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-[#34D399]" />
                  Live Appointment Tracking
                </span>

                <h2 className="mt-6 font-serif text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
                  Don't wait
                  <span className="block text-[#8EB7FF]">
                    without knowing.
                  </span>
                </h2>

                <p className="mt-6 max-w-xl leading-8 text-[#A9BCD2]">
                  CareCube helps you follow the appointment
                  journey so you have a clearer idea of what
                  is happening at the chamber.
                </p>

                <div className="mt-8 grid grid-cols-2 gap-3">
                  {[
                    [
                      "Now Consulting",
                      "Dr. Rahul Kumar",
                    ],
                    [
                      "Your Token",
                      `#${activeToken}`,
                    ],
                    ["Ahead", "5 patients"],
                    ["Estimated", "18 minutes"],
                  ].map(([label, value]) => (
                    <motion.div
                      key={label}
                      whileHover={{
                        y: -4,
                      }}
                      className="rounded-2xl border border-white/10 bg-white/[.06] p-4"
                    >
                      <p className="text-[9px] font-black uppercase tracking-[.15em] text-[#7894B0]">
                        {label}
                      </p>

                      <p className="mt-2 text-sm font-black text-white">
                        {value}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* QUEUE CARD */}

              <motion.div
                initial={{
                  opacity: 0,
                  x: 50,
                }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.8,
                }}
                className="relative"
              >
                <div className="absolute -inset-10 rounded-full bg-[#2563EB]/25 blur-3xl" />

                <div className="relative rounded-[34px] border border-white/10 bg-white/[.07] p-5 shadow-2xl backdrop-blur-xl sm:p-7">
                  <div className="flex items-center justify-between border-b border-white/10 pb-5">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[.18em] text-[#8EB7FF]">
                        Chamber Command Centre
                      </p>

                      <p className="mt-1 text-lg font-black">
                        Cardiology OPD
                      </p>
                    </div>

                    <span className="flex items-center gap-2 rounded-full bg-[#2563EB]/20 px-3 py-2 text-xs font-black text-[#8EB7FF]">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-[#72A5FF]" />
                      LIVE
                    </span>
                  </div>

                  <div className="mt-6 rounded-3xl bg-[#0C2C5B] p-5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-[#718AA5]">
                        CURRENTLY CONSULTING
                      </span>

                      <span className="text-xs font-black text-[#8EB7FF]">
                        TOKEN #{activeToken}
                      </span>
                    </div>

                    <div className="mt-5 flex items-center gap-4">
                      <img
                        src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=200&q=80"
                        alt="Doctor"
                        className="h-14 w-14 rounded-2xl object-cover"
                      />

                      <div>
                        <p className="font-black">
                          Dr. Rahul Kumar
                        </p>

                        <p className="text-sm text-[#7891AA]">
                          Cardiologist
                        </p>
                      </div>
                    </div>

                    <div className="mt-7">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-black text-[#718AA5]">
                          QUEUE PROGRESS
                        </span>

                        <span className="font-black text-[#8EB7FF]">
                          72%
                        </span>
                      </div>

                      <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/10">
                        <motion.div
                          animate={{
                            width: [
                              "50%",
                              "72%",
                              "61%",
                              "72%",
                            ],
                          }}
                          transition={{
                            duration: 6,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          className="h-full rounded-full bg-gradient-to-r from-[#2563EB] to-[#8B5CF6]"
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
                              activeToken === token
                                ? 1.1
                                : 1,
                            y:
                              activeToken === token
                                ? -4
                                : 0,
                          }}
                          className={`flex h-10 min-w-10 items-center justify-center rounded-xl border text-xs font-black ${
                            activeToken === token
                              ? "border-[#8EB7FF]/40 bg-[#2563EB]/20 text-[#8EB7FF]"
                              : "border-white/10 bg-white/[.03] text-[#657E90]"
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
                        className="flex items-center gap-2 rounded-xl bg-white/[.04] px-3 py-2 text-xs font-bold text-[#8197A7]"
                      >
                        <Check
                          size={14}
                          className="text-[#8EB7FF]"
                        />
                        {status}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
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
                <SectionHeading
                  eyebrow="QR Booking"
                  title="Scan. Book. Track."
                  description="See a CareCube QR code at a participating healthcare centre? Scan it and continue your appointment journey from your phone."
                />

                <div className="mt-8 flex flex-wrap gap-2">
                  {[
                    "Scan QR",
                    "Select Doctor",
                    "Choose Slot",
                    "Track Queue",
                  ].map((item, index) => (
                    <div
                      key={item}
                      className="flex items-center gap-2 rounded-full border border-[#DCE6F2] bg-[#F9FBFF] px-4 py-2.5 text-xs font-black text-[#516B82]"
                    >
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#E7F0FF] text-[10px] text-[#2563EB]">
                        {index + 1}
                      </span>

                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* PHONE */}

              <div className="relative mx-auto h-[520px] w-full max-w-[350px]">
                <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#DCEAFF] blur-3xl" />

                <motion.div
                  initial={{
                    opacity: 0,
                    y: 50,
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
                  className="absolute left-1/2 top-1/2 h-[490px] w-[255px] -translate-x-1/2 -translate-y-1/2 rounded-[42px] border-[7px] border-[#102F68] bg-[#102F68] p-2 shadow-[0_40px_100px_-30px_rgba(20,70,130,.45)]"
                >
                  <div className="relative h-full overflow-hidden rounded-[32px] bg-[#F5F8FC]">
                    <div className="mx-auto mt-3 h-5 w-24 rounded-full bg-[#102F68]" />

                    <div className="p-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-[.15em] text-[#2563EB]">
                            CareCube
                          </p>

                          <p className="mt-1 text-lg font-black text-[#102A56]">
                            Book visit
                          </p>
                        </div>

                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2563EB] text-white">
                          <QrCode size={18} />
                        </div>
                      </div>

                      <div className="mt-6 rounded-3xl bg-[#102F68] p-5">
                        <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-2xl bg-white p-3">
                          <div className="grid h-full w-full grid-cols-7 gap-1">
                            {Array.from({
                              length: 49,
                            }).map(
                              (_, index) => (
                                <span
                                  key={index}
                                  className={
                                    (index * 13) %
                                      7 <
                                      3 ||
                                    index % 11 ===
                                      0 ||
                                    index % 5 ===
                                      0
                                      ? "rounded-[2px] bg-[#102F68]"
                                      : "rounded-[2px] bg-white"
                                  }
                                />
                              )
                            )}
                          </div>
                        </div>

                        <p className="mt-4 text-center text-xs font-bold text-[#91A8B7]">
                          Scan to continue
                        </p>
                      </div>

                      <div className="mt-5 space-y-2">
                        {[
                          [
                            "Doctor",
                            "Dr. Ananya Sharma",
                          ],
                          [
                            "Specialty",
                            "Cardiology",
                          ],
                          [
                            "Slot",
                            "Tomorrow • 10:30 AM",
                          ],
                        ].map(([label, value]) => (
                          <div
                            key={label}
                            className="rounded-2xl border border-[#E1EAF5] bg-white p-3"
                          >
                            <p className="text-[8px] font-black uppercase tracking-[.12em] text-[#9AADB8]">
                              {label}
                            </p>

                            <p className="mt-1 text-xs font-black text-[#244F86]">
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

        <section className="bg-[#F5F8FC] py-24">
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
            WHY CARECUBE
        ===================================================== */}

        <section className="bg-white py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
            <div className="grid items-center gap-14 lg:grid-cols-2">
              <motion.div
                initial={{
                  opacity: 0,
                  x: -40,
                }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                }}
                viewport={{
                  once: true,
                }}
                className="relative"
              >
                <div className="relative overflow-hidden rounded-[40px]">
                  <img
                    src="https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=1200&q=85"
                    alt="Healthcare professional"
                    className="h-[500px] w-full object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#061D3E]/80 via-transparent to-transparent" />

                  <div className="absolute bottom-7 left-7">
                    <p className="text-xs font-black uppercase tracking-[.2em] text-white/60">
                      Designed around people
                    </p>

                    <p className="mt-2 max-w-md text-3xl font-black text-white">
                      Healthcare should feel simple.
                    </p>
                  </div>
                </div>

                <motion.div
                  animate={{
                    y: [0, -9, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                  }}
                  className="absolute -bottom-5 -right-4 rounded-3xl border border-white bg-white p-5 shadow-2xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FEF3C7] text-[#D97706]">
                      <Award size={23} />
                    </div>

                    <div>
                      <p className="text-xs font-black text-[#244F86]">
                        Better Experience
                      </p>

                      <p className="mt-1 text-[10px] text-[#8B9DAC]">
                        Simple • Connected • Digital
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              <div>
                <SectionHeading
                  eyebrow="Why CareCube"
                  title="Built around the patient journey."
                  description="The goal is simple: make it easier to discover care, make appointments and understand what happens next."
                />

                <div className="mt-8 space-y-4">
                  {[
                    {
                      icon: UserRound,
                      title: "Patient-first experience",
                      text: "Simple interfaces designed around the actual healthcare journey.",
                    },
                    {
                      icon: Hospital,
                      title: "Connected healthcare network",
                      text: "Bring doctors, centres and patients into one ecosystem.",
                    },
                    {
                      icon: Activity,
                      title: "Real-time information",
                      text: "Queue and appointment information can help reduce uncertainty.",
                    },
                    {
                      icon: ShieldCheck,
                      title: "Privacy-conscious design",
                      text: "Healthcare information deserves a thoughtful digital experience.",
                    },
                  ].map((item, index) => {
                    const Icon = item.icon;

                    return (
                      <motion.div
                        key={item.title}
                        initial={{
                          opacity: 0,
                          y: 15,
                        }}
                        whileInView={{
                          opacity: 1,
                          y: 0,
                        }}
                        viewport={{
                          once: true,
                        }}
                        transition={{
                          delay: index * 0.08,
                        }}
                        whileHover={{
                          x: 5,
                        }}
                        className="flex gap-4 rounded-3xl border border-[#E1EAF4] bg-[#FAFCFF] p-5"
                      >
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#EEF4FF] text-[#2563EB]">
                          <Icon size={21} />
                        </div>

                        <div>
                          <h3 className="font-black text-[#102A56]">
                            {item.title}
                          </h3>

                          <p className="mt-1 text-sm leading-6 text-[#7D92A2]">
                            {item.text}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            FAQ
        ===================================================== */}

        <section className="bg-[#F5F8FC] py-24">
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
                        ? "border-[#BCD2F1] bg-[#F1F6FF]"
                        : "border-[#E1EAF5] bg-white"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setOpenFaq(
                          isOpen ? -1 : index
                        )
                      }
                      className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left sm:px-6"
                    >
                      <span className="font-black text-[#102A56]">
                        {faq.question}
                      </span>

                      <ChevronDown
                        size={20}
                        className={`shrink-0 transition ${
                          isOpen
                            ? "rotate-180 text-[#2563EB]"
                            : "text-[#8BA0AD]"
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
                          <p className="px-5 pb-6 text-sm leading-7 text-[#6F8798] sm:px-6">
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
            EMERGENCY / CONTACT CTA
        ===================================================== */}

        <section
          id="contact"
          className="scroll-mt-24 bg-white px-5 py-20 sm:px-8 lg:px-12"
        >
          <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[42px] bg-[#102F68] px-7 py-16 text-center shadow-2xl sm:px-12 lg:px-20">
            <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-[#2563EB]/30 blur-3xl" />

            <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-[#7C3AED]/20 blur-3xl" />

            <motion.div
              animate={{
                scale: [1, 1.03, 1],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
              }}
              className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5"
            />

            <div className="relative mx-auto max-w-3xl">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#2563EB] text-white shadow-xl shadow-[#2563EB]/30">
                <HeartPulse size={29} />
              </div>

              <p className="mt-6 text-xs font-black uppercase tracking-[.2em] text-[#8EB7FF]">
                Get in touch
              </p>

              <h2 className="mt-4 font-serif text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
                Let's make healthcare
                <span className="block text-[#8EB7FF]">
                  simpler together.
                </span>
              </h2>

              <p className="mx-auto mt-5 max-w-2xl leading-7 text-[#A9BFCC]">
                Have a question, suggestion or want to partner
                with CareCube? We would love to hear from you.
              </p>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  to="/explore"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#2563EB] px-7 py-4 font-black text-white transition hover:-translate-y-1 hover:bg-[#1D4ED8]"
                >
                  Find a Doctor
                  <ArrowRight size={18} />
                </Link>

                <a
                  href="mailto:hello@carecube.com"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[.07] px-7 py-4 font-black text-white transition hover:-translate-y-1 hover:bg-white/10"
                >
                  <Phone size={17} />
                  Contact CareCube
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            EMERGENCY NOTE
        ===================================================== */}

        <section className="bg-[#F8FAFD] px-5 pb-12 sm:px-8 lg:px-12">
          <div className="mx-auto flex max-w-7xl items-center gap-4 rounded-3xl border border-[#F3D8D8] bg-[#FFF8F8] p-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#FEE2E2] text-[#DC2626]">
              <Siren size={20} />
            </div>

            <div>
              <p className="text-sm font-black text-[#8F3030]">
                Emergency?
              </p>

              <p className="mt-1 text-xs leading-5 text-[#A56C6C]">
                CareCube is not an emergency service. For
                emergencies, contact your local emergency service
                or visit the nearest emergency department.
              </p>
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

export default Home;