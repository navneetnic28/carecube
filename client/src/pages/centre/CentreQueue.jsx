import { useEffect, useState } from "react";
import { Menu, X, RefreshCw, Users, Clock3, CreditCard } from "lucide-react";
import api from "../../services/api";
import CentreSidebar from "../../components/centre/CentreSidebar";

function paymentBadge(status) {
  const map = {
    paid: "bg-green-100 text-green-700",
    cash: "bg-blue-100 text-blue-700",
    pending: "bg-yellow-100 text-yellow-700",
    unpaid: "bg-gray-100 text-gray-600",
    refunded: "bg-red-100 text-red-700",
  };

  return map[status] || map.pending;
}

function statusBadge(status) {
  const map = {
    waiting: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
    canceled: "bg-red-100 text-red-700",
    pending: "bg-gray-100 text-gray-600",
  };

  return map[status] || "bg-gray-100 text-gray-600";
}

function CentreQueue() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Mobile sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    load();

    const interval = setInterval(() => {
      load(true);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Prevent body scrolling when mobile drawer is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  const load = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await api.get("/centre/queue");

      setAppointments(response.data?.appointments || []);
    } catch (error) {
      console.error("Queue loading error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const markPaid = async (id) => {
    try {
      await api.patch(`/centre/appointments/${id}/payment`, {
        paymentStatus: "paid",
      });

      await load(true);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Unable to update payment"
      );
    }
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#f6f8fc]">
      {/* =====================================================
          DESKTOP SIDEBAR
          Only visible on lg+
      ====================================================== */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 lg:block">
        <CentreSidebar />
      </aside>

      {/* =====================================================
          MOBILE OVERLAY
      ====================================================== */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          {/* =================================================
              MOBILE DRAWER
          ================================================= */}
          <div
            className="h-full w-[280px] max-w-[85vw] bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4">
              <div>
                <p className="text-sm font-bold text-slate-900">
                  Centre Menu
                </p>

                <p className="text-xs text-slate-500">
                  Navigation
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close menu"
                className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100"
              >
                <X size={22} />
              </button>
            </div>

            {/* Sidebar */}
            <div className="h-[calc(100vh-64px)] overflow-y-auto">
              <CentreSidebar />
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          MAIN CONTENT
          Desktop sidebar = 64 width
      ====================================================== */}
      <main className="min-w-0 lg:ml-64">
        {/* ===================================================
            HEADER
        ==================================================== */}
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto w-full max-w-[1600px] px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
            <div className="flex min-w-0 items-center justify-between gap-3">
              {/* LEFT */}
              <div className="flex min-w-0 items-center gap-3">
                {/* MOBILE MENU */}
                <button
                  type="button"
                  onClick={() => setSidebarOpen(true)}
                  aria-label="Open menu"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-95 lg:hidden"
                >
                  <Menu size={21} />
                </button>

                {/* TITLE ICON */}
                <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 sm:flex">
                  <Users size={21} />
                </div>

                {/* TITLE */}
                <div className="min-w-0">
                  <h1 className="truncate text-lg font-bold tracking-tight text-slate-900 sm:text-xl lg:text-2xl">
                    Today's Queue
                  </h1>

                  <p className="mt-0.5 hidden text-sm text-slate-500 sm:block">
                    Manage today's patient queue and payments
                  </p>

                  <p className="mt-0.5 text-xs text-slate-500 sm:hidden">
                    Patient queue
                  </p>
                </div>
              </div>

              {/* RIGHT ACTIONS */}
              <div className="flex shrink-0 items-center gap-2">
                {/* Appointment Count */}
                <div className="hidden items-center gap-2 rounded-xl bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 sm:flex">
                  <Users size={16} />

                  <span>
                    {appointments.length}
                  </span>

                  <span className="hidden md:inline">
                    Patients
                  </span>
                </div>

                {/* Refresh */}
                <button
                  type="button"
                  onClick={() => load(true)}
                  disabled={refreshing}
                  aria-label="Refresh queue"
                  title="Refresh queue"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <RefreshCw
                    size={17}
                    className={
                      refreshing ? "animate-spin" : ""
                    }
                  />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* ===================================================
            PAGE CONTENT
        ==================================================== */}
        <div className="mx-auto w-full max-w-[1600px] px-4 py-5 pb-10 sm:px-6 sm:py-6 lg:px-8">
          {/* =================================================
              TOP SUMMARY
          ================================================== */}
          <section className="mb-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Total */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Total Patients
                  </p>

                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    {appointments.length}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Users size={21} />
                </div>
              </div>
            </div>

            {/* Waiting */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Waiting
                  </p>

                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    {
                      appointments.filter(
                        (a) =>
                          a.status === "waiting" ||
                          a.status === "pending"
                      ).length
                    }
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <Clock3 size={21} />
                </div>
              </div>
            </div>

            {/* Paid */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Paid
                  </p>

                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    {
                      appointments.filter(
                        (a) => a.paymentStatus === "paid"
                      ).length
                    }
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <CreditCard size={21} />
                </div>
              </div>
            </div>
          </section>

          {/* =================================================
              QUEUE CONTAINER
          ================================================== */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {/* Section Header */}
            <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
              <div>
                <h2 className="text-base font-bold text-slate-900 sm:text-lg">
                  Patient Queue
                </h2>

                <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                  Live queue updates automatically every 10 seconds
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                  ● Live
                </span>
              </div>
            </div>

            {/* =================================================
                LOADING
            ================================================== */}
            {loading ? (
              <QueueSkeleton />
            ) : appointments.length === 0 ? (
              /* =================================================
                  EMPTY STATE
              ================================================== */
              <div className="flex min-h-[300px] flex-col items-center justify-center px-5 py-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <Users size={28} />
                </div>

                <h3 className="mt-4 text-base font-bold text-slate-800">
                  No appointments today
                </h3>

                <p className="mt-1 max-w-sm text-sm text-slate-500">
                  There are currently no patients in today's queue.
                </p>
              </div>
            ) : (
              <>
                {/* =================================================
                    DESKTOP TABLE
                    Hidden below lg
                ================================================== */}
                <div className="hidden overflow-x-auto lg:block">
                  <table className="w-full min-w-[900px] text-left">
                    <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      <tr>
                        <th className="px-5 py-4">
                          Token
                        </th>

                        <th className="px-5 py-4">
                          Doctor
                        </th>

                        <th className="px-5 py-4">
                          Patient
                        </th>

                        <th className="px-5 py-4">
                          Source
                        </th>

                        <th className="px-5 py-4">
                          Status
                        </th>

                        <th className="px-5 py-4">
                          Payment
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {appointments.map((appt) => (
                        <tr
                          key={appt._id}
                          className="border-t border-slate-100 transition hover:bg-slate-50"
                        >
                          {/* TOKEN */}
                          <td className="whitespace-nowrap px-5 py-4">
                            <span className="inline-flex rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-bold text-slate-800">
                              #{appt.tokenNumber}
                            </span>
                          </td>

                          {/* DOCTOR */}
                          <td className="px-5 py-4">
                            <div className="min-w-[150px]">
                              <p className="font-semibold text-slate-800">
                                Dr.{" "}
                                {appt.doctorId?.name ||
                                  "Unknown"}
                              </p>

                              {appt.doctorId?.specialization && (
                                <p className="mt-0.5 text-xs text-slate-500">
                                  {
                                    appt.doctorId
                                      .specialization
                                  }
                                </p>
                              )}
                            </div>
                          </td>

                          {/* PATIENT */}
                          <td className="px-5 py-4">
                            <div className="min-w-[180px]">
                              <p className="font-medium text-slate-800">
                                {appt.patientDetails?.name ||
                                  appt.patientId?.name ||
                                  "Unknown patient"}
                              </p>

                              <p className="mt-0.5 text-xs text-slate-500">
                                {appt.patientDetails?.age
                                  ? `${appt.patientDetails.age} years`
                                  : ""}

                                {appt.patientDetails?.gender
                                  ? ` · ${appt.patientDetails.gender}`
                                  : ""}
                              </p>
                            </div>
                          </td>

                          {/* SOURCE */}
                          <td className="px-5 py-4">
                            <span className="text-sm capitalize text-slate-600">
                              {appt.source?.replace(
                                "_",
                                " "
                              ) || "—"}
                            </span>
                          </td>

                          {/* STATUS */}
                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusBadge(
                                appt.status
                              )}`}
                            >
                              {appt.status || "pending"}
                            </span>
                          </td>

                          {/* PAYMENT */}
                          <td className="px-5 py-4">
                            <div className="flex min-w-[190px] items-center gap-2">
                              <span
                                className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${paymentBadge(
                                  appt.paymentStatus
                                )}`}
                              >
                                {appt.paymentStatus ||
                                  "pending"}

                                {appt.amount
                                  ? ` · ₹${appt.amount}`
                                  : ""}
                              </span>

                              {appt.paymentStatus !==
                                "paid" && (
                                <button
                                  onClick={() =>
                                    markPaid(appt._id)
                                  }
                                  className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-green-700 active:scale-95"
                                >
                                  Mark Paid
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* =================================================
                    MOBILE / TABLET CARDS
                    Visible below lg
                ================================================== */}
                <div className="space-y-3 p-3 sm:p-4 lg:hidden">
                  {appointments.map((appt) => (
                    <div
                      key={appt._id}
                      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                    >
                      {/* TOP */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-sm font-bold text-blue-700">
                            #{appt.tokenNumber}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate font-bold text-slate-900">
                              {appt.patientDetails?.name ||
                                appt.patientId?.name ||
                                "Unknown patient"}
                            </p>

                            <p className="mt-0.5 text-xs text-slate-500">
                              {appt.patientDetails?.age
                                ? `${appt.patientDetails.age} years`
                                : ""}

                              {appt.patientDetails?.gender
                                ? ` · ${appt.patientDetails.gender}`
                                : ""}
                            </p>
                          </div>
                        </div>

                        {/* STATUS */}
                        <span
                          className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${statusBadge(
                            appt.status
                          )}`}
                        >
                          {appt.status || "pending"}
                        </span>
                      </div>

                      {/* DETAILS */}
                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        {/* DOCTOR */}
                        <div className="rounded-xl bg-slate-50 p-3">
                          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                            Doctor
                          </p>

                          <p className="mt-1 truncate text-sm font-semibold text-slate-800">
                            Dr.{" "}
                            {appt.doctorId?.name ||
                              "Unknown"}
                          </p>

                          {appt.doctorId?.specialization && (
                            <p className="mt-0.5 truncate text-xs text-slate-500">
                              {
                                appt.doctorId
                                  .specialization
                              }
                            </p>
                          )}
                        </div>

                        {/* SOURCE */}
                        <div className="rounded-xl bg-slate-50 p-3">
                          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                            Source
                          </p>

                          <p className="mt-1 text-sm font-semibold capitalize text-slate-800">
                            {appt.source?.replace(
                              "_",
                              " "
                            ) || "—"}
                          </p>
                        </div>
                      </div>

                      {/* PAYMENT */}
                      <div className="mt-3 flex flex-col gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                            Payment
                          </p>

                          <div className="mt-1">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${paymentBadge(
                                appt.paymentStatus
                              )}`}
                            >
                              {appt.paymentStatus ||
                                "pending"}

                              {appt.amount
                                ? ` · ₹${appt.amount}`
                                : ""}
                            </span>
                          </div>
                        </div>

                        {appt.paymentStatus !==
                          "paid" && (
                          <button
                            onClick={() =>
                              markPaid(appt._id)
                            }
                            className="w-full rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 active:scale-[0.98] sm:w-auto"
                          >
                            Mark Paid
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

/* ==========================================================
   LOADING SKELETON
========================================================== */

function QueueSkeleton() {
  return (
    <div className="animate-pulse">
      {/* DESKTOP */}
      <div className="hidden lg:block">
        <div className="grid grid-cols-6 gap-4 bg-slate-50 px-5 py-4">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="h-4 rounded bg-slate-200"
            />
          ))}
        </div>

        <div className="space-y-4 p-5">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="grid grid-cols-6 gap-4"
            >
              {[1, 2, 3, 4, 5, 6].map((cell) => (
                <div
                  key={cell}
                  className="h-10 rounded bg-slate-100"
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* MOBILE */}
      <div className="space-y-3 p-4 lg:hidden">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-48 rounded-2xl bg-slate-100"
          />
        ))}
      </div>
    </div>
  );
}

export default CentreQueue;