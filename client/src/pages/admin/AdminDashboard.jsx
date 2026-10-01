import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import AdminSidebar from "../../components/admin/AdminSidebar";
import {
  Users,
  Stethoscope,
  Building2,
  CalendarDays,
  UserCheck,
  Hospital,
  Clock3,
  FileWarning,
  UserRoundCheck,
  Building,
  Activity,
  TrendingUp,
  ArrowUpRight,
  RefreshCw,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

const DEFAULT_STATS = {
  users: 0,
  doctors: 0,
  centres: 0,
  appointments: 0,
  pendingDoctors: 0,
  pendingCentres: 0,
  activeDoctors: 0,
  activeCentres: 0,
  todaysAppointments: 0,
  openReports: 0,
};

function StatCard({
  title,
  value,
  description,
  icon,
  iconBg,
  iconColor,
  badge,
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {value}
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            {description}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}
        >
          {icon}
        </div>
      </div>

      {badge && (
        <div className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
          <ArrowUpRight size={12} />
          {badge}
        </div>
      )}

      <div className="pointer-events-none absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-slate-50 opacity-0 transition group-hover:opacity-100" />
    </div>
  );
}

function AdminDashboard() {
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async (refresh = false) => {
    try {
      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await api.get("/admin/dashboard");

      setStats({
        ...DEFAULT_STATS,
        ...response.data,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const doctorApprovalRate = useMemo(() => {
    if (!stats.doctors) return 0;

    return Math.round(
      (stats.activeDoctors / stats.doctors) * 100
    );
  }, [stats.doctors, stats.activeDoctors]);

  const centreApprovalRate = useMemo(() => {
    if (!stats.centres) return 0;

    return Math.round(
      (stats.activeCentres / stats.centres) * 100
    );
  }, [stats.centres, stats.activeCentres]);

  const totalPending = stats.pendingDoctors + stats.pendingCentres;

  const appointmentCompletionEstimate =
    stats.appointments > 0
      ? Math.min(
          100,
          Math.round(
            (stats.todaysAppointments / stats.appointments) * 100
          )
        )
      : 0;

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#f6f8fc]">
        <AdminSidebar />

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          <AdminDashboardSkeleton />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f8fc]">
      <div className="flex min-h-screen">
        <AdminSidebar />

        <main className="min-w-0 flex-1">
          {/* HEADER */}
          <header className="border-b border-slate-200 bg-white">
            <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 sm:flex">
                    <ShieldCheck size={22} />
                  </div>

                  <div className="min-w-0">
                    <h1 className="truncate text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                      Admin Dashboard
                    </h1>

                    <p className="mt-0.5 hidden text-sm text-slate-500 sm:block">
                      Monitor and manage the CareCube platform
                    </p>

                    <p className="mt-0.5 text-xs text-slate-500 sm:hidden">
                      Platform overview
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => loadStats(true)}
                  disabled={refreshing}
                  className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:opacity-50 sm:px-4"
                >
                  <RefreshCw
                    size={16}
                    className={refreshing ? "animate-spin" : ""}
                  />

                  <span className="hidden sm:inline">
                    Refresh
                  </span>
                </button>
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-7xl space-y-6 px-4 py-5 pb-10 sm:px-6 sm:py-7 lg:px-8">
            {/* WELCOME BANNER */}
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-5 text-white shadow-xl shadow-blue-100 sm:p-7">
              <div className="pointer-events-none absolute -right-12 -top-20 h-56 w-56 rounded-full bg-white/10" />

              <div className="pointer-events-none absolute -bottom-24 right-32 h-48 w-48 rounded-full bg-white/5" />

              <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="max-w-2xl">
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold backdrop-blur">
                    <Sparkles size={14} />
                    Platform Control Centre
                  </div>

                  <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    Welcome, Admin 👋
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-blue-100 sm:text-base">
                    Monitor users, doctors, centres and appointments
                    across the CareCube healthcare platform.
                  </p>
                </div>

                <div className="hidden h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white/10 backdrop-blur sm:flex">
                  <Activity size={38} />
                </div>
              </div>
            </section>

            {/* TOP STATS */}
            <section>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-slate-900">
                    Platform Overview
                  </h2>

                  <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                    Overall CareCube platform metrics
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                  title="Total Users"
                  value={stats.users}
                  description="Registered users"
                  icon={<Users size={21} />}
                  iconBg="bg-blue-50"
                  iconColor="text-blue-600"
                  badge="Platform users"
                />

                <StatCard
                  title="Doctors"
                  value={stats.doctors}
                  description="Registered doctors"
                  icon={<Stethoscope size={21} />}
                  iconBg="bg-violet-50"
                  iconColor="text-violet-600"
                  badge="Medical professionals"
                />

                <StatCard
                  title="Centres"
                  value={stats.centres}
                  description="Registered centres"
                  icon={<Building2 size={21} />}
                  iconBg="bg-indigo-50"
                  iconColor="text-indigo-600"
                  badge="Healthcare centres"
                />

                <StatCard
                  title="Appointments"
                  value={stats.appointments}
                  description="All-time appointments"
                  icon={<CalendarDays size={21} />}
                  iconBg="bg-emerald-50"
                  iconColor="text-emerald-600"
                  badge="Total bookings"
                />
              </div>
            </section>

            {/* MAIN GRID */}
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
              {/* ACTIVE PLATFORM */}
              <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 p-5 sm:p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <Activity size={19} />
                    </div>

                    <div>
                      <h2 className="font-bold text-slate-900">
                        Platform Activity
                      </h2>

                      <p className="text-xs text-slate-500">
                        Active doctors and centres
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 p-5 sm:p-6">
                  <ProgressRow
                    title="Active Doctors"
                    current={stats.activeDoctors}
                    total={stats.doctors}
                    percentage={doctorApprovalRate}
                    icon={<UserCheck size={18} />}
                    color="blue"
                  />

                  <ProgressRow
                    title="Active Centres"
                    current={stats.activeCentres}
                    total={stats.centres}
                    percentage={centreApprovalRate}
                    icon={<Hospital size={18} />}
                    color="violet"
                  />

                  <ProgressRow
                    title="Today's Appointments"
                    current={stats.todaysAppointments}
                    total={stats.appointments}
                    percentage={appointmentCompletionEstimate}
                    icon={<CalendarDays size={18} />}
                    color="emerald"
                  />
                </div>
              </section>

              {/* PENDING ACTIONS */}
              <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                        <Clock3 size={19} />
                      </div>

                      <div>
                        <h2 className="font-bold text-slate-900">
                          Pending Actions
                        </h2>

                        <p className="text-xs text-slate-500">
                          Items requiring attention
                        </p>
                      </div>
                    </div>

                    {totalPending > 0 && (
                      <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-700">
                        {totalPending}
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-3 p-5">
                  <PendingCard
                    title="Pending Doctors"
                    value={stats.pendingDoctors}
                    icon={<UserRoundCheck size={18} />}
                    description="Doctor approvals"
                  />

                  <PendingCard
                    title="Pending Centres"
                    value={stats.pendingCentres}
                    icon={<Building size={18} />}
                    description="Centre approvals"
                  />

                  <PendingCard
                    title="Open Reports"
                    value={stats.openReports}
                    icon={<FileWarningIcon />}
                    description="Reports to review"
                    danger={stats.openReports > 0}
                  />
                </div>
              </section>
            </div>

            {/* SECONDARY STATS */}
            <section>
              <div className="mb-4">
                <h2 className="font-bold text-slate-900">
                  Management Overview
                </h2>

                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                  Current platform management status
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <SmallMetric
                  icon={<UserCheck size={20} />}
                  title="Active Doctors"
                  value={stats.activeDoctors}
                  description={`${doctorApprovalRate}% of total doctors`}
                />

                <SmallMetric
                  icon={<Building2 size={20} />}
                  title="Active Centres"
                  value={stats.activeCentres}
                  description={`${centreApprovalRate}% of total centres`}
                />

                <SmallMetric
                  icon={<CalendarDays size={20} />}
                  title="Today's Appointments"
                  value={stats.todaysAppointments}
                  description="Scheduled for today"
                />

                <SmallMetric
                  icon={<FileWarningIcon />}
                  title="Open Reports"
                  value={stats.openReports}
                  description={
                    stats.openReports > 0
                      ? "Needs attention"
                      : "No open reports"
                  }
                  warning={stats.openReports > 0}
                />
              </div>
            </section>

            {/* SYSTEM HEALTH */}
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <ShieldCheck size={19} />
                  </div>

                  <div>
                    <h2 className="font-bold text-slate-900">
                      Platform Health
                    </h2>

                    <p className="text-xs text-slate-500">
                      High-level operational indicators
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid divide-y divide-slate-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                <HealthItem
                  title="User Network"
                  value={stats.users}
                  status="Operational"
                  icon={<Users size={19} />}
                />

                <HealthItem
                  title="Doctor Network"
                  value={stats.activeDoctors}
                  status={
                    stats.activeDoctors > 0
                      ? "Operational"
                      : "Needs setup"
                  }
                  icon={<Stethoscope size={19} />}
                />

                <HealthItem
                  title="Centre Network"
                  value={stats.activeCentres}
                  status={
                    stats.activeCentres > 0
                      ? "Operational"
                      : "Needs setup"
                  }
                  icon={<Building2 size={19} />}
                />
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

/* ------------------------------------------------
   Components
------------------------------------------------ */

function ProgressRow({
  title,
  current,
  total,
  percentage,
  icon,
  color,
}) {
  const colorClasses = {
    blue: {
      icon: "bg-blue-50 text-blue-600",
      bar: "bg-blue-600",
      text: "text-blue-600",
    },
    violet: {
      icon: "bg-violet-50 text-violet-600",
      bar: "bg-violet-600",
      text: "text-violet-600",
    },
    emerald: {
      icon: "bg-emerald-50 text-emerald-600",
      bar: "bg-emerald-600",
      text: "text-emerald-600",
    },
  };

  const colors = colorClasses[color];

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-lg ${colors.icon}`}
          >
            {icon}
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-800">
              {title}
            </p>

            <p className="text-xs text-slate-400">
              {current} of {total}
            </p>
          </div>
        </div>

        <p className={`text-sm font-bold ${colors.text}`}>
          {percentage}%
        </p>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full transition-all duration-700 ${colors.bar}`}
          style={{
            width: `${Math.min(percentage, 100)}%`,
          }}
        />
      </div>
    </div>
  );
}

function PendingCard({
  title,
  value,
  icon,
  description,
  danger = false,
}) {
  return (
    <div
      className={`flex items-center justify-between rounded-xl border p-4 transition ${
        danger
          ? "border-red-100 bg-red-50/50"
          : "border-slate-100 bg-slate-50/70"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${
            danger
              ? "bg-red-100 text-red-600"
              : "bg-white text-slate-600"
          }`}
        >
          {icon}
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-800">
            {title}
          </p>

          <p className="text-xs text-slate-400">
            {description}
          </p>
        </div>
      </div>

      <span
        className={`text-xl font-bold ${
          danger ? "text-red-600" : "text-slate-900"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function SmallMetric({
  icon,
  title,
  value,
  description,
  warning = false,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {value}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            warning
              ? "bg-red-50 text-red-600"
              : "bg-blue-50 text-blue-600"
          }`}
        >
          {icon}
        </div>
      </div>

      <p
        className={`mt-3 text-xs ${
          warning ? "text-red-500" : "text-slate-400"
        }`}
      >
        {description}
      </p>
    </div>
  );
}

function HealthItem({ title, value, status, icon }) {
  return (
    <div className="flex items-center gap-4 p-5 sm:p-6">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-400">
          {title}
        </p>

        <div className="mt-1 flex flex-wrap items-center gap-2">
          <span className="text-xl font-bold text-slate-900">
            {value}
          </span>

          <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700">
            <CheckCircle2 size={11} />
            {status}
          </span>
        </div>
      </div>
    </div>
  );
}

function FileWarningIcon() {
  return <FileWarning size={19} />;
}

function AdminDashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-64 rounded-lg bg-slate-200" />
          <div className="mt-3 h-4 w-80 rounded bg-slate-200" />
        </div>

        <div className="h-10 w-24 rounded-xl bg-slate-200" />
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
        <div className="h-72 rounded-2xl bg-white" />
        <div className="h-72 rounded-2xl bg-white" />
      </div>
    </div>
  );
}

export default AdminDashboard;