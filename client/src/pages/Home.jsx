import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Search,
  MapPin,
  Clock3,
  ShieldCheck,
  Star,
  Plus,
  ChevronDown,
  CheckCircle2,
  Zap,
  QrCode,
  CalendarDays,
  Activity,
  Brain,
  CreditCard,
  Stethoscope,
  Menu,
  X,
  Sparkles,
  HeartPulse,
  Hospital,
  Pill,
} from "lucide-react";

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
  const [mobileMenu, setMobileMenu] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

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

  const dashboardPath = {
    patient: "/patient/dashboard",
    doctor: "/doctor/dashboard",
    centre_owner: "/centre/dashboard",
    admin: "/admin/dashboard",
  }[user?.role];

  const features = [
    {
      icon: Activity,
      title: "Real-time Availability",
      text: "See which doctors are available before you go.",
    },
    {
      icon: Clock3,
      title: "Live Appointment Track",
      text: "Track your appointment status and live queue in real time.",
    },
    {
      icon: ShieldCheck,
      title: "Verified Reviews",
      text: "Make better healthcare decisions with trusted reviews.",
    },
    {
      icon: MapPin,
      title: "Live Doctor Available",
      text: "Find available doctors and healthcare options near you.",
    },
    {
      icon: Zap,
      title: "Smart Booking",
      text: "Book your appointment quickly without unnecessary calls.",
    },
    {
      icon: CalendarDays,
      title: "Pre Booking",
      text: "Reserve your preferred appointment slot in advance.",
    },
    {
      icon: QrCode,
      title: "QR Booking",
      text: "Scan a QR code and start your booking instantly.",
    },
    {
      icon: Brain,
      title: "AI Search",
      text: "Find the right healthcare option with smart search.",
    },
  ];

  const steps = [
    {
      number: "01",
      icon: Search,
      title: "Find Your Spot",
      text: "Search nearby doctors, medical stores or hospitals and check live availability before you go.",
    },
    {
      number: "02",
      icon: CalendarDays,
      title: "Book Instantly",
      text: "Reserve an appointment in seconds. No phone calls and no uncertainty.",
    },
    {
      number: "03",
      icon: QrCode,
      title: "Walk In & Scan",
      text: "Scan the QR at the clinic or hospital and check your live appointment status.",
    },
    {
      number: "04",
      icon: CreditCard,
      title: "Pay Securely",
      text: "Complete your payment securely with a simple digital experience.",
    },
  ];

  const problems = [
    {
      number: "01",
      title: "Long Waiting",
      text: "Reduce unnecessary waiting at clinics and arrive closer to your turn.",
      icon: Clock3,
    },
    {
      number: "02",
      title: "No Live Information",
      text: "Know doctor availability and appointment status before you travel.",
      icon: Activity,
    },
    {
      number: "03",
      title: "Complicated Booking",
      text: "Make appointments in just a few simple steps.",
      icon: CalendarDays,
    },
  ];

  const faqs = [
    {
      question: "What is Carecube?",
      answer:
        "Carecube is a smart healthcare platform that helps users discover nearby doctors, check availability and book appointments easily.",
    },
    {
      question: "Can I see if a doctor is available?",
      answer:
        "Yes. Carecube is designed to show doctor and appointment availability so patients can make better decisions before visiting.",
    },
    {
      question: "How does QR booking work?",
      answer:
        "Simply scan the QR code available at a participating clinic, hospital or healthcare location and continue your booking from your phone.",
    },
    {
      question: "Can I book an appointment in advance?",
      answer:
        "Yes. Users can select an available slot and pre-book their appointment where advance booking is enabled.",
    },
    {
      question: "Is my information secure?",
      answer:
        "Carecube is designed with security and privacy in mind. Personal information should be handled securely throughout the booking process.",
    },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-slate-900">

      {/* ================= NAVBAR ================= */}
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
          <Logo size="md" />

          {/* Desktop */}
          <nav className="hidden items-center gap-8 lg:flex">
            <a
              href="#features"
              className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
            >
              Features
            </a>

            <a
              href="#how-it-works"
              className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
            >
              How it works
            </a>

            <a
              href="#why-carecube"
              className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
            >
              Why Carecube
            </a>

            <Link
              to="/explore"
              className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
            >
              Explore Doctors
            </Link>
          </nav>

          <div className="hidden items-center gap-3 sm:flex">
            {user ? (
              <>
                <NotificationBell />

                <Link
                  to={dashboardPath}
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
                >
                  Dashboard
                </Link>

                <button
                  onClick={logout}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Logout
                </button>
              </>
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
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile */}
          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="rounded-xl border border-slate-200 p-2.5 lg:hidden"
          >
            {mobileMenu ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {mobileMenu && (
          <div className="border-t border-slate-200 bg-white px-5 py-5 lg:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-3">
              <a
                href="#features"
                onClick={() => setMobileMenu(false)}
                className="rounded-xl px-4 py-3 font-medium hover:bg-slate-50"
              >
                Features
              </a>

              <a
                href="#how-it-works"
                onClick={() => setMobileMenu(false)}
                className="rounded-xl px-4 py-3 font-medium hover:bg-slate-50"
              >
                How it works
              </a>

              <a
                href="#why-carecube"
                onClick={() => setMobileMenu(false)}
                className="rounded-xl px-4 py-3 font-medium hover:bg-slate-50"
              >
                Why Carecube
              </a>

              <Link
                to="/explore"
                onClick={() => setMobileMenu(false)}
                className="rounded-xl px-4 py-3 font-medium hover:bg-slate-50"
              >
                Explore Doctors
              </Link>

              {!user && (
                <Link
                  to="/login"
                  className="mt-2 rounded-xl bg-blue-600 px-4 py-3 text-center font-semibold text-white"
                >
                  Login / Register
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ================= HERO ================= */}
      <main>
        <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white">
          {/* Background decoration */}
          <div className="absolute -left-40 top-20 h-80 w-80 rounded-full bg-blue-200/30 blur-3xl" />
          <div className="absolute -right-40 top-0 h-96 w-96 rounded-full bg-cyan-200/30 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-16 sm:px-6 sm:pt-20 lg:px-8 lg:pb-28 lg:pt-24">
            <div className="mx-auto max-w-4xl text-center">

              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                Live healthcare availability
                <span className="text-slate-400">•</span>
                No more phone calls
              </div>

              <h1 className="text-4xl font-black leading-[1.08] tracking-tight text-slate-950 sm:text-5xl md:text-6xl lg:text-7xl">
                Healthcare appointments,
                <span className="block bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  made beautifully simple.
                </span>
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                Find doctors, check live availability, book appointments,
                track your queue and complete your healthcare journey —
                all from one simple platform.
              </p>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  to="/explore"
                  className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-7 py-4 font-bold text-white shadow-xl shadow-blue-600/25 transition hover:-translate-y-1 hover:bg-blue-700"
                >
                  Find a Doctor
                  <ArrowRight
                    size={19}
                    className="transition group-hover:translate-x-1"
                  />
                </Link>

                {!user && (
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-7 py-4 font-bold text-slate-800 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:text-blue-600"
                  >
                    Register Your Clinic
                  </Link>
                )}
              </div>

              {/* Search */}
              <form
                onSubmit={search}
                className="mx-auto mt-10 flex max-w-2xl flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-200/70 sm:flex-row"
              >
                <div className="flex flex-1 items-center gap-3 px-3">
                  <Search size={21} className="text-slate-400" />

                  <input
                    type="text"
                    placeholder="Search doctor by name..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full bg-transparent py-3 outline-none placeholder:text-slate-400"
                  />
                </div>

                <button
                  type="submit"
                  className="rounded-xl bg-slate-950 px-6 py-3 font-semibold text-white transition hover:bg-blue-600"
                >
                  Search
                </button>
              </form>
            </div>

            {/* Trust indicators */}
            <div className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                ["24/7", "Digital Access"],
                ["Live", "Availability"],
                ["Fast", "Smart Booking"],
                ["Secure", "Patient Journey"],
              ].map(([big, small]) => (
                <div
                  key={small}
                  className="rounded-2xl border border-slate-200 bg-white/80 p-4 text-center shadow-sm backdrop-blur"
                >
                  <p className="text-xl font-black text-blue-600">{big}</p>
                  <p className="mt-1 text-xs font-medium text-slate-500">
                    {small}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= SEARCH RESULTS ================= */}
        {searched && (
          <section className="bg-slate-50 px-5 py-14 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl">
              <div className="mb-7">
                <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
                  Search Results
                </p>
                <h2 className="mt-1 text-2xl font-black">
                  Doctors matching "{query}"
                </h2>
              </div>

              {doctors.length === 0 ? (
                <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center">
                  <Stethoscope className="mx-auto text-slate-300" size={45} />
                  <p className="mt-4 font-semibold text-slate-700">
                    No verified doctors found.
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Try another doctor name or explore all doctors.
                  </p>

                  <Link
                    to="/explore"
                    className="mt-5 inline-flex rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white"
                  >
                    Explore Doctors
                  </Link>
                </div>
              ) : (
                <div className="space-y-5">
                  {doctors.map((doctor) => (
                    <div
                      key={doctor._id}
                      className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl sm:p-6"
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
                            <h3 className="text-lg font-black text-slate-900">
                              Dr. {doctor.name}
                            </h3>

                            <p className="mt-1 font-medium text-blue-600">
                              {doctor.specialization}
                            </p>

                            <p className="mt-1 text-sm text-slate-500">
                              {doctor.qualification}
                            </p>
                          </div>
                        </div>

                        <Link
                          to={`/doctor/${doctor._id}`}
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
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
                              <MapPin
                                size={19}
                                className="mt-0.5 text-blue-600"
                              />

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
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* ================= FEATURES ================= */}
        <section id="features" className="scroll-mt-20 bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

            <div className="mx-auto max-w-2xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-600">
                <Sparkles size={15} />
                WHAT WE OFFER
              </span>

              <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                Everything you need for a
                <span className="text-blue-600"> smarter appointment.</span>
              </h2>

              <p className="mt-5 leading-7 text-slate-600">
                An all-in-one doctor appointment companion designed to make
                healthcare faster, easier and more connected.
              </p>
            </div>

            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => {
                const Icon = feature.icon;

                return (
                  <div
                    key={feature.title}
                    className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-100/40"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                      <Icon size={22} />
                    </div>

                    <div className="mt-6 flex items-start justify-between gap-3">
                      <h3 className="font-bold text-slate-900">
                        {feature.title}
                      </h3>

                      <span className="text-xs font-black text-slate-300">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <p className="mt-3 text-sm leading-6 text-slate-500">
                      {feature.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================= FEATURED DOCTORS ================= */}
        <section className="bg-slate-50 py-20">
          <FeaturedDoctors />
        </section>

        {/* ================= HOW IT WORKS ================= */}
        <section
          id="how-it-works"
          className="scroll-mt-20 bg-slate-950 py-20 text-white sm:py-24"
        >
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

            <div className="max-w-2xl">
              <span className="text-sm font-bold tracking-widest text-blue-400">
                THE JOURNEY
              </span>

              <h2 className="mt-4 text-3xl font-black sm:text-4xl lg:text-5xl">
                How it works.
              </h2>

              <p className="mt-5 leading-7 text-slate-400">
                From discovery to payment — a seamless healthcare experience
                in four simple steps.
              </p>
            </div>

            <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {steps.map((step) => {
                const Icon = step.icon;

                return (
                  <div
                    key={step.number}
                    className="group rounded-3xl border border-white/10 bg-white/[0.04] p-7 transition hover:-translate-y-2 hover:border-blue-400/40 hover:bg-white/[0.07]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-4xl font-black text-white/10">
                        {step.number}
                      </span>

                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                        <Icon size={21} />
                      </div>
                    </div>

                    <h3 className="mt-8 text-xl font-bold">{step.title}</h3>

                    <p className="mt-3 text-sm leading-6 text-slate-400">
                      {step.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================= WHY CARECUBE ================= */}
        <section
          id="why-carecube"
          className="scroll-mt-20 bg-white py-20 sm:py-24"
        >
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

            <div className="grid items-center gap-14 lg:grid-cols-2">

              {/* Left */}
              <div>
                <span className="text-sm font-bold tracking-widest text-blue-600">
                  WHY WE BUILT THIS
                </span>

                <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                  Built from a
                  <span className="text-blue-600"> real problem.</span>
                </h2>

                <p className="mt-6 max-w-xl leading-8 text-slate-600">
                  Finding the right doctor, knowing their availability,
                  waiting in long queues and making appointments shouldn't
                  be complicated.
                </p>

                <p className="mt-4 max-w-xl leading-8 text-slate-600">
                  Carecube brings discovery, booking, live queue tracking
                  and the appointment journey together in one experience.
                </p>

                <div className="mt-8 rounded-3xl bg-blue-600 p-7 text-white shadow-xl shadow-blue-600/20">
                  <div className="flex items-start gap-4">
                    <HeartPulse className="mt-1 shrink-0" size={27} />

                    <div>
                      <p className="text-sm font-semibold text-blue-100">
                        OUR VISION
                      </p>

                      <p className="mt-2 text-2xl font-black">
                        India's next-generation doctor appointment platform.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right */}
              <div className="grid gap-5">
                {problems.map((problem) => {
                  const Icon = problem.icon;

                  return (
                    <div
                      key={problem.number}
                      className="group flex gap-5 rounded-3xl border border-slate-200 bg-slate-50 p-6 transition hover:border-blue-200 hover:bg-blue-50/40"
                    >
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm">
                        <Icon size={23} />
                      </div>

                      <div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-black text-blue-600">
                            {problem.number}
                          </span>

                          <h3 className="font-black">{problem.title}</h3>
                        </div>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                          {problem.text}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ================= CARE JOURNEY CTA ================= */}
        <section className="px-5 py-10 sm:px-6 lg:px-8">
          <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-600 via-blue-700 to-slate-950 px-7 py-14 text-white sm:px-12 lg:px-20 lg:py-20">
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-blue-400/20 blur-3xl" />

            <div className="relative grid items-center gap-10 lg:grid-cols-2">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold">
                  <Zap size={15} />
                  FASTER. SIMPLER. SEAMLESS.
                </span>

                <h2 className="mt-5 text-3xl font-black sm:text-4xl lg:text-5xl">
                  Your healthcare journey,
                  <span className="block text-cyan-300">
                    all in one place.
                  </span>
                </h2>

                <p className="mt-5 max-w-xl leading-7 text-blue-100">
                  Find. Book. Track. Visit. Pay.
                  Carecube connects every important step of your appointment.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  [Search, "Find"],
                  [CalendarDays, "Book"],
                  [Activity, "Track"],
                  [CreditCard, "Pay"],
                ].map(([Icon, label]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur"
                  >
                    <Icon size={24} className="text-cyan-300" />
                    <p className="mt-4 font-bold">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ================= REVIEWS ================= */}
        <section className="bg-slate-50 py-20">
          <ReviewsSection />
        </section>

        {/* ================= FAQ ================= */}
        <section className="bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-3xl px-5 sm:px-6">

            <div className="text-center">
              <span className="text-sm font-bold tracking-widest text-blue-600">
                FAQs
              </span>

              <h2 className="mt-4 text-3xl font-black sm:text-4xl">
                Frequently asked questions.
              </h2>

              <p className="mt-4 text-slate-500">
                Everything you need to know about Carecube.
              </p>
            </div>

            <div className="mt-10 space-y-3">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;

                return (
                  <div
                    key={faq.question}
                    className={`overflow-hidden rounded-2xl border transition ${
                      isOpen
                        ? "border-blue-200 bg-blue-50/40"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <button
                      onClick={() =>
                        setOpenFaq(isOpen ? -1 : index)
                      }
                      className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left sm:px-6"
                    >
                      <span className="font-bold text-slate-900">
                        {faq.question}
                      </span>

                      <ChevronDown
                        size={20}
                        className={`shrink-0 text-slate-400 transition ${
                          isOpen ? "rotate-180 text-blue-600" : ""
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 sm:px-6">
                        <p className="text-sm leading-7 text-slate-600">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================= CONTACT CTA ================= */}
        <section className="bg-slate-50 px-5 py-20 sm:px-6">
          <div className="mx-auto max-w-5xl text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-600/20">
              <HeartPulse size={29} />
            </div>

            <p className="mt-6 text-sm font-bold tracking-widest text-blue-600">
              GET IN TOUCH
            </p>

            <h2 className="mt-4 text-3xl font-black sm:text-5xl">
              Let's make healthcare
              <span className="text-blue-600"> simpler together.</span>
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-7 text-slate-600">
              Have a question, suggestion or want to partner with Carecube?
              We'd love to hear from you.
            </p>

            <a
              href="mailto:hello@carecube.com"
              className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-7 py-4 font-bold text-white shadow-xl transition hover:-translate-y-1 hover:bg-blue-600"
            >
              Send Message
              <ArrowRight size={18} />
            </a>
          </div>
        </section>
      </main>

      {/* ================= FOOTER ================= */}
      <Footer />
    </div>
  );
}

export default Home;