import { useEffect, useState } from "react";
import api from "../../services/api";
import CentreSidebar from "../../components/centre/CentreSidebar";
import Logo from "../../components/Logo";

import NotificationBell from "../../components/NotificationBell";

import {
  Stethoscope,
  CalendarDays,
  Clock3,
  CheckCircle2,
  TrendingUp,
  Users,
  ArrowUpRight,
  Activity,
  Sparkles,
  RefreshCw,
  Menu,
  X,
} from "lucide-react";

function CentreDashboard() {
  const [data, setData] = useState({
    doctors: 0,
    appointments: 0,
    waiting: 0,
    completed: 0,
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /* =====================================================
     LOAD DASHBOARD
  ===================================================== */

  useEffect(() => {
    loadDashboard();
  }, []);

  /* =====================================================
     CLOSE MOBILE MENU ON DESKTOP
  ===================================================== */

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  /* =====================================================
     LOAD DASHBOARD
  ===================================================== */

  const loadDashboard = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await api.get("/centre/dashboard");

      setData({
        doctors: response.data?.doctors || 0,
        appointments: response.data?.appointments || 0,
        waiting: response.data?.waiting || 0,
        completed: response.data?.completed || 0,
      });
    } catch (error) {
      console.error("Centre dashboard error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /* =====================================================
     CALCULATIONS
  ===================================================== */

  const completionRate =
    data.appointments > 0
      ? Math.round(
          (data.completed / data.appointments) * 100
        )
      : 0;

  const pendingAppointments = Math.max(
    0,
    data.appointments - data.completed
  );

  /* =====================================================
     MOBILE MENU TOGGLE
  ===================================================== */

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="min-h-screen w-full overflow-x-hidden bg-[#f6f8fc]">

        {/* =================================================
            DESKTOP SIDEBAR
        ================================================= */}

        <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 lg:block">
          <div className="h-full w-full overflow-y-auto">
            <CentreSidebar />
          </div>
        </aside>

        {/* =================================================
            MOBILE TOP BAR
        ================================================= */}

        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white lg:hidden">
          <div className="flex h-16 items-center justify-between px-4">

            <button
              type="button"
              onClick={toggleMobileMenu}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>

            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
                <Stethoscope size={19} />
              </div>

              <span className="text-sm font-bold text-slate-900">
                CareCube
              </span>
            </div>

            <div className="h-10 w-10" />
          </div>
        </header>

        {/* =================================================
            MOBILE SIDEBAR
        ================================================= */}

        {mobileMenuOpen && (
          <MobileMenu
            onClose={closeMobileMenu}
          />
        )}

        {/* =================================================
            MAIN
        ================================================= */}

        <main className="min-h-screen min-w-0 lg:ml-64">
          <div className="mx-auto w-full max-w-[1600px] px-4 py-5 sm:px-6 lg:px-8">
            <DashboardSkeleton />
          </div>
        </main>
      </div>
    );
  }

  /* =====================================================
     MAIN DASHBOARD
  ===================================================== */

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#f6f8fc]">

      {/* =================================================
          DESKTOP SIDEBAR

          Hidden < 1024px
          Fixed >= 1024px
      ================================================= */}

      <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 lg:block">
        <div className="h-full w-full overflow-y-auto">
          <CentreSidebar />
        </div>
      </aside>

      {/* =================================================
          MOBILE OVERLAY + SIDEBAR
      ================================================= */}

      {mobileMenuOpen && (
        <MobileMenu
          onClose={closeMobileMenu}
        />
      )}

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="min-h-screen min-w-0 lg:ml-64">

        {/* =================================================
            MOBILE HEADER
        ================================================= */}

        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur lg:hidden">
          <div className="flex h-16 items-center justify-between px-4">

            {/* MENU BUTTON */}

            <button
              type="button"
              onClick={toggleMobileMenu}
              aria-label={
                mobileMenuOpen
                  ? "Close menu"
                  : "Open menu"
              }
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-95"
            >
              {mobileMenuOpen ? (
                <X size={22} />
              ) : (
                <Menu size={22} />
              )}
            </button>

            {/* LOGO */}

            <div className="flex items-center gap-2">

                  


              <div>
                   <Logo size="md" />

                

              
              </div>

            </div>

            {/* NOTIFICATION */}

            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm">
              <NotificationBell />
            </div>

          </div>
        </header>

        {/* =================================================
            DESKTOP HEADER
        ================================================= */}

        <header className="sticky top-0 z-30 hidden border-b border-slate-200 bg-white/95 backdrop-blur lg:block">

          <div className="mx-auto w-full max-w-[1600px] px-4 py-5 sm:px-6 lg:px-8">

            <div className="flex min-w-0 items-center justify-between gap-4">

              {/* TITLE */}

              <div className="flex min-w-0 items-center gap-3">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Activity size={22} />
                </div>

                <div className="min-w-0">

                  <h1 className="truncate text-xl font-bold tracking-tight text-slate-900 xl:text-2xl">
                    Centre Dashboard
                  </h1>

                  <p className="mt-0.5 text-sm text-slate-500">
                    Manage your centre operations and appointments
                  </p>

                </div>
              </div>

              {/* ACTIONS */}

              <div className="flex shrink-0 items-center gap-2">

                <button
                  type="button"
                  onClick={() => loadDashboard(true)}
                  disabled={refreshing}
                  aria-label="Refresh dashboard"
                  title="Refresh dashboard"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 active:scale-95 disabled:opacity-50"
                >
                  <RefreshCw
                    size={17}
                    className={
                      refreshing
                        ? "animate-spin"
                        : ""
                    }
                  />
                </button>

                <div className="flex h-10 items-center rounded-xl border border-slate-200 bg-white shadow-sm">
                  <NotificationBell />
                </div>

              </div>

            </div>
          </div>
        </header>

        {/* =================================================
            PAGE CONTENT
        ================================================= */}

        <div className="mx-auto w-full max-w-[1600px] space-y-5 px-4 py-5 pb-10 sm:space-y-6 sm:px-6 sm:py-7 lg:px-8">

          {/* =================================================
              WELCOME BANNER
          ================================================= */}

          <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-5 text-white shadow-xl shadow-blue-100 sm:p-7 lg:p-8">

            <div className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-white/10" />

            <div className="pointer-events-none absolute -bottom-20 right-10 h-40 w-40 rounded-full bg-white/5 sm:right-20" />

            <div className="pointer-events-none absolute bottom-0 left-1/2 h-24 w-24 -translate-x-1/2 rounded-full bg-white/5 blur-2xl" />

            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

              <div className="min-w-0 max-w-2xl">

                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold backdrop-blur">
                  <Sparkles size={14} />
                  <span>Centre Overview</span>
                </div>

                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                  Welcome back 👋
                </h2>

                <p className="mt-2 max-w-xl text-sm leading-6 text-blue-100 sm:text-base">
                  Here's what's happening at your centre today.
                  Keep track of doctors, appointments and patient
                  flow from one place.
                </p>

              </div>

              <div className="hidden h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white/10 backdrop-blur sm:flex lg:h-24 lg:w-24">
                <Stethoscope
                  size={38}
                  className="lg:h-11 lg:w-11"
                />
              </div>

            </div>
          </section>

          {/* =================================================
              STATS
          ================================================= */}

          <section className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <DashboardCard
              title="Doctors"
              value={data.doctors}
              subtitle="Active doctors"
              icon={<Stethoscope size={21} />}
              iconBg="bg-blue-50"
              iconColor="text-blue-600"
            />

            <DashboardCard
              title="Today's Appointments"
              value={data.appointments}
              subtitle="Total appointments"
              icon={<CalendarDays size={21} />}
              iconBg="bg-violet-50"
              iconColor="text-violet-600"
            />

            <DashboardCard
              title="Waiting"
              value={data.waiting}
              subtitle="Patients waiting"
              icon={<Clock3 size={21} />}
              iconBg="bg-amber-50"
              iconColor="text-amber-600"
              pulse={data.waiting > 0}
            />

            <DashboardCard
              title="Completed"
              value={data.completed}
              subtitle="Completed today"
              icon={<CheckCircle2 size={21} />}
              iconBg="bg-emerald-50"
              iconColor="text-emerald-600"
            />

          </section>

          {/* =================================================
              MAIN GRID
          ================================================= */}

          <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px]">

            {/* =================================================
                APPOINTMENT OVERVIEW
            ================================================= */}

            <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

              <div className="flex items-center justify-between gap-3 border-b border-slate-100 p-4 sm:p-6">

                <div className="min-w-0">

                  <div className="flex min-w-0 items-center gap-2">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      <CalendarDays size={18} />
                    </div>

                    <h2 className="truncate font-bold text-slate-900">
                      Today's Overview
                    </h2>

                  </div>

                  <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                    Current appointment activity
                  </p>

                </div>

                <span className="shrink-0 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                  Today
                </span>

              </div>

              <div className="p-4 sm:p-6">

                <div className="flex flex-col gap-6 md:flex-row md:items-center">

                  {/* CIRCLE */}

                  <div className="relative mx-auto flex h-32 w-32 shrink-0 items-center justify-center md:mx-0">

                    <svg
                      className="h-32 w-32 -rotate-90"
                      viewBox="0 0 120 120"
                    >

                      <circle
                        cx="60"
                        cy="60"
                        r="48"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="10"
                        className="text-slate-100"
                      />

                      <circle
                        cx="60"
                        cy="60"
                        r="48"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="10"
                        strokeLinecap="round"
                        className="text-blue-600 transition-all duration-700"
                        strokeDasharray={`${completionRate * 3.015} 301.5`}
                      />

                    </svg>

                    <div className="absolute text-center">

                      <p className="text-2xl font-bold text-slate-900">
                        {completionRate}%
                      </p>

                      <p className="text-[10px] font-medium text-slate-400">
                        Completed
                      </p>

                    </div>

                  </div>

                  {/* MINI STATS */}

                  <div className="min-w-0 flex-1">

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                      <MiniStat
                        label="Total"
                        value={data.appointments}
                        icon={<CalendarDays size={16} />}
                      />

                      <MiniStat
                        label="Completed"
                        value={data.completed}
                        icon={<CheckCircle2 size={16} />}
                      />

                      <MiniStat
                        label="Waiting"
                        value={data.waiting}
                        icon={<Clock3 size={16} />}
                      />

                      <MiniStat
                        label="Pending"
                        value={pendingAppointments}
                        icon={<Activity size={16} />}
                      />

                    </div>

                  </div>

                </div>

                {/* PROGRESS */}

                <div className="mt-7">

                  <div className="mb-2 flex items-center justify-between gap-3">

                    <p className="truncate text-xs font-semibold text-slate-600">
                      Appointment completion
                    </p>

                    <p className="shrink-0 text-xs font-bold text-slate-700">
                      {data.completed}/{data.appointments}
                    </p>

                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                    <div
                      className="h-full rounded-full bg-blue-600 transition-all duration-700"
                      style={{
                        width: `${Math.min(
                          completionRate,
                          100
                        )}%`,
                      }}
                    />

                  </div>

                </div>

              </div>

            </section>

            {/* =================================================
                CENTRE STATUS
            ================================================= */}

            <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

              <div className="border-b border-slate-100 p-5">

                <div className="flex items-center gap-2">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <Activity size={18} />
                  </div>

                  <div className="min-w-0">

                    <h2 className="font-bold text-slate-900">
                      Centre Status
                    </h2>

                    <p className="text-xs text-slate-500">
                      Live operational overview
                    </p>

                  </div>

                </div>

              </div>

              <div className="space-y-4 p-5">

                <StatusRow
                  label="Doctors"
                  value={data.doctors}
                  status={data.doctors > 0}
                  text={
                    data.doctors > 0
                      ? "Active"
                      : "No doctors"
                  }
                />

                <StatusRow
                  label="Appointments"
                  value={data.appointments}
                  status={data.appointments > 0}
                  text={
                    data.appointments > 0
                      ? "Scheduled"
                      : "No appointments"
                  }
                />

                <StatusRow
                  label="Patient queue"
                  value={data.waiting}
                  status={data.waiting > 0}
                  warning={data.waiting > 0}
                  text={
                    data.waiting > 0
                      ? "Patients waiting"
                      : "Queue clear"
                  }
                />

                <StatusRow
                  label="Completed"
                  value={data.completed}
                  status={data.completed > 0}
                  text={
                    data.completed > 0
                      ? "Progressing"
                      : "Not started"
                  }
                />

              </div>

              <div className="mx-5 mb-5 rounded-xl bg-slate-50 p-4">

                <div className="flex items-start gap-3">

                  <TrendingUp
                    size={18}
                    className="mt-0.5 shrink-0 text-blue-600"
                  />

                  <div className="min-w-0">

                    <p className="text-sm font-semibold text-slate-800">
                      Daily performance
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {data.completed > 0
                        ? `${data.completed} appointments have been completed today.`
                        : "No appointments have been completed yet today."}
                    </p>

                  </div>

                </div>

              </div>

            </section>

          </div>

          {/* =================================================
              QUICK OVERVIEW
          ================================================= */}

          <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-100 p-5 sm:p-6">

              <h2 className="font-bold text-slate-900">
                Quick Overview
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Important centre metrics at a glance
              </p>

            </div>

            <div className="grid grid-cols-1 divide-y divide-slate-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">

              <QuickMetric
                icon={<Users size={20} />}
                title="Medical Team"
                value={data.doctors}
                description="Doctors associated"
              />

              <QuickMetric
                icon={<CalendarDays size={20} />}
                title="Appointments"
                value={data.appointments}
                description="Today's bookings"
              />

              <QuickMetric
                icon={<CheckCircle2 size={20} />}
                title="Success"
                value={`${completionRate}%`}
                description="Completion rate"
              />

            </div>

          </section>

        </div>
      </main>
    </div>
  );
}

/* =====================================================
   MOBILE MENU
===================================================== */

function MobileMenu({ onClose }) {
  return (
    <>
      {/* OVERLAY */}

      <div
        className="fixed inset-0 z-[60] bg-slate-950/50 backdrop-blur-sm lg:hidden"
        onClick={onClose}
      />

      {/* DRAWER */}

      <aside className="fixed inset-y-0 left-0 z-[70] w-[280px] max-w-[85vw] overflow-y-auto bg-white shadow-2xl lg:hidden">

        {/* MOBILE DRAWER HEADER */}

        <div className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4">

          <div className="flex items-center gap-2">

           

            

          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            aria-label="Close menu"
          >
            <X size={21} />
          </button>

        </div>

        {/* ACTUAL SIDEBAR */}

        <div className="min-h-[calc(100vh-4rem)]">
          <CentreSidebar />
        </div>

      </aside>
    </>
  );
}

/* =====================================================
   DASHBOARD CARD
===================================================== */

function DashboardCard({
  title,
  value,
  subtitle,
  icon,
  iconBg,
  iconColor,
  pulse = false,
}) {
  return (
    <div className="group min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">

      <div className="flex items-start justify-between gap-4">

        <div className="min-w-0">

          <p className="truncate text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {value}
          </p>

          <p className="mt-1 truncate text-xs text-slate-400">
            {subtitle}
          </p>

        </div>

        <div
          className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}
        >

          {pulse && (
            <span className="absolute inset-0 animate-ping rounded-xl bg-amber-200 opacity-30" />
          )}

          <span className="relative">
            {icon}
          </span>

        </div>

      </div>

      <div className="mt-5 flex items-center gap-1 text-xs font-medium text-slate-400">

        <ArrowUpRight size={13} />

        <span>
          Live dashboard data
        </span>

      </div>

    </div>
  );
}

/* =====================================================
   MINI STAT
===================================================== */

function MiniStat({
  label,
  value,
  icon,
}) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">

      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-slate-500 shadow-sm">
        {icon}
      </div>

      <div className="min-w-0">

        <p className="text-xs text-slate-400">
          {label}
        </p>

        <p className="text-lg font-bold text-slate-800">
          {value}
        </p>

      </div>

    </div>
  );
}

/* =====================================================
   STATUS ROW
===================================================== */

function StatusRow({
  label,
  value,
  status,
  warning = false,
  text,
}) {
  return (
    <div className="flex items-center justify-between gap-3">

      <div className="flex min-w-0 items-center gap-3">

        <span
          className={`h-2.5 w-2.5 shrink-0 rounded-full ${
            warning
              ? "bg-amber-500"
              : status
              ? "bg-emerald-500"
              : "bg-slate-300"
          }`}
        />

        <div className="min-w-0">

          <p className="truncate text-sm font-medium text-slate-700">
            {label}
          </p>

          <p className="truncate text-xs text-slate-400">
            {text}
          </p>

        </div>

      </div>

      <span className="shrink-0 text-sm font-bold text-slate-800">
        {value}
      </span>

    </div>
  );
}

/* =====================================================
   QUICK METRIC
===================================================== */

function QuickMetric({
  icon,
  title,
  value,
  description,
}) {
  return (
    <div className="flex min-w-0 items-center gap-4 p-5 sm:p-6">

      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        {icon}
      </div>

      <div className="min-w-0">

        <p className="text-xs font-medium text-slate-400">
          {title}
        </p>

        <p className="mt-0.5 text-xl font-bold text-slate-900">
          {value}
        </p>

        <p className="truncate text-xs text-slate-500">
          {description}
        </p>

      </div>

    </div>
  );
}

/* =====================================================
   LOADING SKELETON
===================================================== */

function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-6">

      {/* HEADER */}

      <div className="flex items-center justify-between gap-4">

        <div className="min-w-0">

          <div className="h-8 w-52 max-w-full rounded-lg bg-slate-200 sm:w-64" />

          <div className="mt-3 h-4 w-64 max-w-full rounded bg-slate-200 sm:w-80" />

        </div>

        <div className="h-10 w-20 shrink-0 rounded-xl bg-slate-200" />

      </div>

      {/* BANNER */}

      <div className="h-40 rounded-2xl bg-slate-200 sm:h-44 lg:h-48" />

      {/* STATS */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-36 rounded-2xl bg-white"
          />
        ))}

      </div>

      {/* CONTENT */}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px]">

        <div className="h-80 rounded-2xl bg-white" />

        <div className="h-80 rounded-2xl bg-white" />

      </div>

      {/* QUICK */}

      <div className="h-32 rounded-2xl bg-white" />

    </div>
  );
}

export default CentreDashboard;