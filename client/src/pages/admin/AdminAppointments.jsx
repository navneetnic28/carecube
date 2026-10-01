import { useEffect, useState } from "react";
import api from "../../services/api";
import AdminSidebar from "../../components/admin/AdminSidebar";
import {
  Menu,
  X,
  CalendarDays,
  RefreshCw,
  Filter,
  Users,
  Stethoscope,
  Building2,
  CreditCard,
} from "lucide-react";

function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    load();
  }, [status]);

  const load = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await api.get("/admin/appointments", {
        params: {
          status: status || undefined,
        },
      });

      setAppointments(response.data.appointments || []);
    } catch (error) {
      console.error("Failed to load appointments:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const formatStatus = (value) => {
    if (!value) return "Unknown";

    return value
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const getStatusClass = (value) => {
    switch (value) {
      case "waiting":
        return "bg-amber-100 text-amber-700";

      case "in_queue":
        return "bg-blue-100 text-blue-700";

      case "consulting":
        return "bg-violet-100 text-violet-700";

      case "completed":
        return "bg-emerald-100 text-emerald-700";

      case "cancelled":
        return "bg-red-100 text-red-700";

      case "no_show":
        return "bg-slate-200 text-slate-700";

      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  const getPaymentClass = (value) => {
    switch (value) {
      case "paid":
        return "bg-emerald-100 text-emerald-700";

      case "pending":
        return "bg-amber-100 text-amber-700";

      case "failed":
        return "bg-red-100 text-red-700";

      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#f6f8fc]">
      {/* =====================================================
          DESKTOP SIDEBAR
          ===================================================== */}

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 lg:block">
        <div className="h-full overflow-y-auto">
          <AdminSidebar />
        </div>
      </aside>

      {/* =====================================================
          MOBILE SIDEBAR DRAWER
          ===================================================== */}

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          {/* Overlay */}
          <button
            type="button"
            aria-label="Close menu"
            onClick={closeMobileMenu}
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
          />

          {/* Drawer */}
          <aside className="absolute inset-y-0 left-0 w-[280px] max-w-[85vw] overflow-y-auto bg-white shadow-2xl">
            {/* Drawer Header */}
            <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                  CareCube
                </p>

                <p className="text-sm font-bold text-slate-900">
                  Admin Panel
                </p>
              </div>

              <button
                type="button"
                onClick={closeMobileMenu}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100"
                aria-label="Close sidebar"
              >
                <X size={22} />
              </button>
            </div>

            {/* Sidebar */}
            <AdminSidebar />
          </aside>
        </div>
      )}

      {/* =====================================================
          MAIN CONTENT
          ===================================================== */}

      <main className="min-h-screen min-w-0 lg:ml-64">
        {/* ===================================================
            MOBILE HEADER
            =================================================== */}

        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur lg:hidden">
          <div className="flex h-16 items-center justify-between px-4">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition hover:bg-slate-200"
                aria-label="Open menu"
              >
                <Menu size={22} />
              </button>

              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-900">
                  Admin Panel
                </p>

                <p className="text-xs text-slate-500">
                  Appointments
                </p>
              </div>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <CalendarDays size={18} />
            </div>
          </div>
        </header>

        {/* ===================================================
            PAGE
            =================================================== */}

        <div className="w-full px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
          {/* PAGE HEADER */}

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 sm:flex">
                  <CalendarDays size={22} />
                </div>

                <div>
                  <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                    All Appointments
                  </h1>

                  <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                    Monitor all patient appointments across CareCube
                  </p>
                </div>
              </div>
            </div>

            {/* Refresh */}

            <button
              type="button"
              onClick={() => load(true)}
              disabled={refreshing}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              <RefreshCw
                size={16}
                className={refreshing ? "animate-spin" : ""}
              />

              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          {/* =================================================
              FILTER CARD
              ================================================= */}

          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                  <Filter size={18} />
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Filter Appointments
                  </p>

                  <p className="text-xs text-slate-500">
                    Select appointment status
                  </p>
                </div>
              </div>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-64"
              >
                <option value="">All statuses</option>
                <option value="waiting">Waiting</option>
                <option value="in_queue">In Queue</option>
                <option value="consulting">Consulting</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="no_show">No-show</option>
              </select>
            </div>
          </section>

          {/* =================================================
              QUICK SUMMARY
              ================================================= */}

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <SummaryCard
              icon={<CalendarDays size={18} />}
              label="Appointments"
              value={appointments.length}
              iconClass="bg-blue-50 text-blue-600"
            />

            <SummaryCard
              icon={<Users size={18} />}
              label="Patients"
              value={
                new Set(
                  appointments
                    .map((a) => a.patientId?._id)
                    .filter(Boolean)
                ).size
              }
              iconClass="bg-violet-50 text-violet-600"
            />

            <SummaryCard
              icon={<Stethoscope size={18} />}
              label="Doctors"
              value={
                new Set(
                  appointments
                    .map((a) => a.doctorId?._id)
                    .filter(Boolean)
                ).size
              }
              iconClass="bg-emerald-50 text-emerald-600"
            />

            <SummaryCard
              icon={<Building2 size={18} />}
              label="Centres"
              value={
                new Set(
                  appointments
                    .map((a) => a.centreId?._id)
                    .filter(Boolean)
                ).size
              }
              iconClass="bg-amber-50 text-amber-600"
            />
          </div>

          {/* =================================================
              APPOINTMENTS
              ================================================= */}

          <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {/* Section Header */}

            <div className="flex flex-col gap-2 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
              <div>
                <h2 className="font-bold text-slate-900">
                  Appointment Records
                </h2>

                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                  {appointments.length} appointment
                  {appointments.length !== 1 ? "s" : ""} found
                </p>
              </div>

              {status && (
                <span className="w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  {formatStatus(status)}
                </span>
              )}
            </div>

            {/* Loading */}

            {loading ? (
              <AppointmentsSkeleton />
            ) : appointments.length === 0 ? (
              /* Empty State */

              <div className="px-5 py-16 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <CalendarDays size={28} />
                </div>

                <h3 className="mt-4 text-base font-bold text-slate-800">
                  No appointments found
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  There are no appointments matching the selected filter.
                </p>
              </div>
            ) : (
              /* =================================================
                 DESKTOP TABLE + MOBILE SCROLL
                 ================================================= */

              <div className="w-full overflow-x-auto">
                <table className="min-w-[1050px] w-full text-left">
                  <thead className="border-b border-slate-100 bg-slate-50">
                    <tr>
                      <th className="whitespace-nowrap px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                        Token
                      </th>

                      <th className="whitespace-nowrap px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                        Patient
                      </th>

                      <th className="whitespace-nowrap px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                        Doctor
                      </th>

                      <th className="whitespace-nowrap px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                        Centre
                      </th>

                      <th className="whitespace-nowrap px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                        Date
                      </th>

                      <th className="whitespace-nowrap px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                        Status
                      </th>

                      <th className="whitespace-nowrap px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                        Payment
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {appointments.map((a) => (
                      <tr
                        key={a._id}
                        className="border-b border-slate-100 transition hover:bg-slate-50/70"
                      >
                        {/* TOKEN */}

                        <td className="px-5 py-4">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-sm font-bold text-blue-700">
                            #{a.tokenNumber}
                          </div>
                        </td>

                        {/* PATIENT */}

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-50 text-xs font-bold text-violet-600">
                              {a.patientId?.name?.charAt(0)?.toUpperCase() ||
                                "P"}
                            </div>

                            <div>
                              <p className="font-semibold text-slate-800">
                                {a.patientId?.name || "Unknown Patient"}
                              </p>

                              {a.patientId?.phone && (
                                <p className="text-xs text-slate-400">
                                  {a.patientId.phone}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* DOCTOR */}

                        <td className="px-5 py-4">
                          <p className="font-medium text-slate-800">
                            {a.doctorId?.name
                              ? `Dr. ${a.doctorId.name}`
                              : "Unknown Doctor"}
                          </p>

                          {a.doctorId?.specialization && (
                            <p className="mt-1 text-xs text-slate-400">
                              {a.doctorId.specialization}
                            </p>
                          )}
                        </td>

                        {/* CENTRE */}

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <Building2
                              size={15}
                              className="text-slate-400"
                            />

                            <span className="font-medium text-slate-700">
                              {a.centreId?.name || "Unknown Centre"}
                            </span>
                          </div>
                        </td>

                        {/* DATE */}

                        <td className="px-5 py-4">
                          <p className="text-sm font-medium text-slate-700">
                            {a.appointmentDate
                              ? new Date(
                                  a.appointmentDate
                                ).toLocaleDateString("en-IN", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })
                              : "—"}
                          </p>
                        </td>

                        {/* STATUS */}

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                              a.status
                            )}`}
                          >
                            {formatStatus(a.status)}
                          </span>
                        </td>

                        {/* PAYMENT */}

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <CreditCard
                              size={15}
                              className="text-slate-400"
                            />

                            <div>
                              <span
                                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getPaymentClass(
                                  a.paymentStatus
                                )}`}
                              >
                                {formatStatus(a.paymentStatus)}
                              </span>

                              {a.amount ? (
                                <p className="mt-1 text-xs font-semibold text-slate-500">
                                  ₹{a.amount}
                                </p>
                              ) : null}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* MOBILE TABLE HINT */}

          {!loading && appointments.length > 0 && (
            <p className="mt-3 text-center text-xs text-slate-400 sm:hidden">
              ← Swipe left/right to view all appointment details →
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

/* =========================================================
   SUMMARY CARD
========================================================= */

function SummaryCard({
  icon,
  label,
  value,
  iconClass,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>

        <span className="text-xl font-bold text-slate-900">
          {value}
        </span>
      </div>

      <p className="mt-3 text-xs font-medium text-slate-500">
        {label}
      </p>
    </div>
  );
}

/* =========================================================
   SKELETON
========================================================= */

function AppointmentsSkeleton() {
  return (
    <div className="animate-pulse p-5">
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((item) => (
          <div
            key={item}
            className="flex gap-4"
          >
            <div className="h-10 w-10 rounded-lg bg-slate-200" />

            <div className="flex-1 space-y-2">
              <div className="h-4 w-40 rounded bg-slate-200" />
              <div className="h-3 w-56 rounded bg-slate-100" />
            </div>

            <div className="hidden h-7 w-20 rounded-full bg-slate-200 sm:block" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminAppointments;