import { useEffect, useState } from "react";
import api from "../../services/api";
import CentreSidebar from "../../components/centre/CentreSidebar";
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

  useEffect(() => {
    loadDashboard();
  }, []);

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
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const completionRate =
    data.appointments > 0
      ? Math.round((data.completed / data.appointments) * 100)
      : 0;

  const pendingAppointments = Math.max(
    0,
    data.appointments - data.completed
  );

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#f6f8fc]">
        <CentreSidebar />

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          <DashboardSkeleton />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f8fc]">
      <div className="flex min-h-screen">
        <CentreSidebar />

        <main className="min-w-0 flex-1">
          {/* Header */}
          <header className="border-b border-slate-200 bg-white">
            <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 sm:flex">
                    <Activity size={22} />
                  </div>

                  <div className="min-w-0">
                    <h1 className="truncate text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                      Centre Dashboard
                    </h1>

                    <p className="mt-0.5 hidden text-sm text-slate-500 sm:block">
                      Manage your centre operations and appointments
                    </p>

                    <p className="mt-0.5 text-xs text-slate-500 sm:hidden">
                      Centre overview
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => loadDashboard(true)}
                    disabled={refreshing}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                    title="Refresh dashboard"
                  >
                    <RefreshCw
                      size={17}
                      className={refreshing ? "animate-spin" : ""}
                    />
                  </button>

                  <div className="rounded-xl border border-slate-200 bg-white">
                    <NotificationBell />
                  </div>
                </div>
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-7xl space-y-6 px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
            {/* Welcome Banner */}
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-5 text-white shadow-xl shadow-blue-100 sm:p-7">
              {/* Decorative circles */}
              <div className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-white/10" />
              <div className="pointer-events-none absolute -bottom-20 right-20 h-40 w-40 rounded-full bg-white/5" />

              <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="max-w-2xl">
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold backdrop-blur">
                    <Sparkles size={14} />
                    Centre Overview
                  </div>

                  <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    Welcome back 👋
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-blue-100 sm:text-base">
                    Here's what's happening at your centre today.
                    Keep track of doctors, appointments and patient
                    flow from one place.
                  </p>
                </div>

                <div className="hidden h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white/10 backdrop-blur sm:flex">
                  <Stethoscope size={38} />
                </div>
              </div>
            </section>

            {/* Stats */}
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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

            {/* Main content */}
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
              {/* Appointment Overview */}
              <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 p-5 sm:p-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                        <CalendarDays size={18} />
                      </div>

                      <h2 className="font-bold text-slate-900">
                        Today's Overview
                      </h2>
                    </div>

                    <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                      Current appointment activity
                    </p>
                  </div>

                  <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                    Today
                  </span>
                </div>

                <div className="p-5 sm:p-6">
                  {/* Progress */}
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                    <div className="relative flex h-32 w-32 shrink-0 items-center justify-center self-center sm:self-auto">
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

                    <div className="flex-1">
                      <div className="grid gap-3 sm:grid-cols-2">
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

                  {/* Progress bar */}
                  <div className="mt-7">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-xs font-semibold text-slate-600">
                        Appointment completion
                      </p>

                      <p className="text-xs font-bold text-slate-700">
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

              {/* Centre Status */}
              <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 p-5">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                      <Activity size={18} />
                    </div>

                    <div>
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
                      className="mt-0.5 text-blue-600"
                    />

                    <div>
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

            {/* Quick Actions */}
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 p-5 sm:p-6">
                <h2 className="font-bold text-slate-900">
                  Quick Overview
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Important centre metrics at a glance
                </p>
              </div>

              <div className="grid divide-y divide-slate-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
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
    </div>
  );
}

/* ---------------------------------------------
   Components
--------------------------------------------- */

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
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {value}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {subtitle}
          </p>
        </div>

        <div
          className={`relative flex h-11 w-11 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}
        >
          {pulse && (
            <span className="absolute inset-0 animate-ping rounded-xl bg-amber-200 opacity-30" />
          )}

          <span className="relative">{icon}</span>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-1 text-xs font-medium text-slate-400">
        <ArrowUpRight size={13} />
        Live dashboard data
      </div>
    </div>
  );
}

function MiniStat({ label, value, icon }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-slate-500 shadow-sm">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs text-slate-400">{label}</p>

        <p className="text-lg font-bold text-slate-800">
          {value}
        </p>
      </div>
    </div>
  );
}

function StatusRow({
  label,
  value,
  status,
  warning = false,
  text,
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <span
          className={`h-2.5 w-2.5 rounded-full ${
            warning
              ? "bg-amber-500"
              : status
              ? "bg-emerald-500"
              : "bg-slate-300"
          }`}
        />

        <div>
          <p className="text-sm font-medium text-slate-700">
            {label}
          </p>

          <p className="text-xs text-slate-400">{text}</p>
        </div>
      </div>

      <span className="text-sm font-bold text-slate-800">
        {value}
      </span>
    </div>
  );
}

function QuickMetric({
  icon,
  title,
  value,
  description,
}) {
  return (
    <div className="flex items-center gap-4 p-5 sm:p-6">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        {icon}
      </div>

      <div>
        <p className="text-xs font-medium text-slate-400">
          {title}
        </p>

        <p className="mt-0.5 text-xl font-bold text-slate-900">
          {value}
        </p>

        <p className="text-xs text-slate-500">{description}</p>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="flex justify-between">
        <div>
          <div className="h-8 w-64 rounded-lg bg-slate-200" />
          <div className="mt-3 h-4 w-80 rounded bg-slate-200" />
        </div>

        <div className="h-10 w-20 rounded-xl bg-slate-200" />
      </div>

      <div className="h-40 rounded-2xl bg-slate-200" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-36 rounded-2xl bg-white"
          />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-80 rounded-2xl bg-white" />
        <div className="h-80 rounded-2xl bg-white" />
      </div>
    </div>
  );
}

export default CentreDashboard;