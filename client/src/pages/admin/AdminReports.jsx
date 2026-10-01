import { useEffect, useState } from "react";
import api from "../../services/api";
import AdminSidebar from "../../components/admin/AdminSidebar";
import {
  Menu,
  X,
  FileWarning,
  RefreshCw,
  Filter,
  CheckCircle2,
  Clock3,
} from "lucide-react";

function AdminReports() {
  const [reports, setReports] = useState([]);
  const [status, setStatus] = useState("open");
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

      const response = await api.get("/admin/reports", {
        params: {
          status: status || undefined,
        },
      });

      setReports(response.data.reports || []);
    } catch (error) {
      console.error("Unable to load reports:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const resolve = async (id) => {
    const note = window.prompt("Resolution note (optional):") || "";

    try {
      await api.patch(`/admin/reports/${id}/resolve`, {
        resolutionNote: note,
      });

      await load();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Unable to resolve report"
      );
    }
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const formatText = (value) => {
    if (!value) return "—";

    return value
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
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

          {/* Background Overlay */}

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

            {/* Sidebar Navigation */}

            <AdminSidebar />

          </aside>
        </div>
      )}

      {/* =====================================================
          MAIN CONTENT
          ===================================================== */}

      <main className="min-h-screen min-w-0 lg:ml-64">

        {/* ===================================================
            MOBILE TOP BAR
            =================================================== */}

        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur lg:hidden">

          <div className="flex h-16 items-center justify-between px-4">

            <div className="flex min-w-0 items-center gap-3">

              {/* MENU BUTTON */}

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
                  Report Management
                </p>
              </div>

            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <FileWarning size={18} />
            </div>

          </div>
        </header>

        {/* ===================================================
            PAGE CONTENT
            =================================================== */}

        <div className="w-full px-4 py-5 sm:px-6 sm:py-7 lg:px-8">

          {/* PAGE HEADER */}

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="min-w-0">

              <div className="flex items-center gap-3">

                <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 sm:flex">
                  <FileWarning size={22} />
                </div>

                <div>

                  <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                    Reported Issues
                  </h1>

                  <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                    Review and manage reported platform issues
                  </p>

                </div>

              </div>

            </div>

            {/* REFRESH */}

            <button
              type="button"
              onClick={() => load(true)}
              disabled={refreshing}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              <RefreshCw
                size={16}
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />

              {refreshing
                ? "Refreshing..."
                : "Refresh"}
            </button>

          </div>

          {/* =================================================
              FILTER
              ================================================= */}

          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                  <Filter size={18} />
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Report Filter
                  </p>

                  <p className="text-xs text-slate-500">
                    Filter reports by current status
                  </p>
                </div>

              </div>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-56"
              >
                <option value="open">
                  Open
                </option>

                <option value="resolved">
                  Resolved
                </option>

                <option value="">
                  All
                </option>
              </select>

            </div>

          </section>

          {/* =================================================
              SUMMARY CARDS
              ================================================= */}

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">

            <SummaryCard
              icon={<FileWarning size={18} />}
              label="Total Reports"
              value={reports.length}
              className="bg-blue-50 text-blue-600"
            />

            <SummaryCard
              icon={<Clock3 size={18} />}
              label="Open Reports"
              value={
                reports.filter(
                  (r) => r.status === "open"
                ).length
              }
              className="bg-amber-50 text-amber-600"
            />

            <SummaryCard
              icon={<CheckCircle2 size={18} />}
              label="Resolved"
              value={
                reports.filter(
                  (r) => r.status === "resolved"
                ).length
              }
              className="bg-emerald-50 text-emerald-600"
            />

          </div>

          {/* =================================================
              REPORTS SECTION
              ================================================= */}

          <section className="mt-6">

            <div className="mb-4 flex items-center justify-between">

              <div>
                <h2 className="font-bold text-slate-900">
                  Reports
                </h2>

                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                  {reports.length} report
                  {reports.length !== 1
                    ? "s"
                    : ""}{" "}
                  found
                </p>
              </div>

              {status && (
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    status === "open"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {formatText(status)}
                </span>
              )}

            </div>

            {/* =================================================
                LOADING
                ================================================= */}

            {loading ? (
              <ReportsSkeleton />
            ) : reports.length === 0 ? (

              /* EMPTY */

              <div className="rounded-2xl border border-slate-200 bg-white px-5 py-16 text-center shadow-sm">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <FileWarning size={28} />
                </div>

                <h3 className="mt-4 text-base font-bold text-slate-800">
                  No reports found
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  There are no reports matching the selected filter.
                </p>

              </div>

            ) : (

              /* =================================================
                 REPORT CARDS
                 ================================================= */

              <div className="space-y-4">

                {reports.map((r) => (

                  <div
                    key={r._id}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:shadow-md"
                  >

                    {/* CARD HEADER */}

                    <div className="border-b border-slate-100 p-4 sm:p-5">

                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                        <div className="min-w-0">

                          <div className="flex items-start gap-3">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                              <FileWarning size={18} />
                            </div>

                            <div className="min-w-0">

                              <h3 className="break-words font-bold text-slate-900">
                                {r.subject}
                              </h3>

                              <p className="mt-2 break-words text-sm leading-6 text-slate-600">
                                {r.message}
                              </p>

                            </div>

                          </div>

                        </div>

                        {/* STATUS */}

                        <span
                          className={`w-fit shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${
                            r.status === "open"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {formatText(r.status)}
                        </span>

                      </div>

                    </div>

                    {/* CARD BODY */}

                    <div className="p-4 sm:p-5">

                      {/* META */}

                      <div className="grid gap-3 sm:grid-cols-3">

                        <InfoItem
                          label="Filed By"
                          value={formatText(
                            r.reporterRole
                          )}
                        />

                        <InfoItem
                          label="Target Type"
                          value={formatText(
                            r.targetType
                          )}
                        />

                        <InfoItem
                          label="Created"
                          value={
                            r.createdAt
                              ? new Date(
                                  r.createdAt
                                ).toLocaleString(
                                  "en-IN"
                                )
                              : "—"
                          }
                        />

                      </div>

                      {/* RESOLUTION */}

                      {r.status === "resolved" &&
                        r.resolutionNote && (
                          <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 p-4">

                            <div className="flex items-start gap-3">

                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                                <CheckCircle2
                                  size={17}
                                />
                              </div>

                              <div className="min-w-0">

                                <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">
                                  Resolution
                                </p>

                                <p className="mt-1 break-words text-sm leading-6 text-emerald-800">
                                  {r.resolutionNote}
                                </p>

                              </div>

                            </div>

                          </div>
                        )}

                      {/* ACTION */}

                      {r.status === "open" && (

                        <div className="mt-5 flex justify-end border-t border-slate-100 pt-4">

                          <button
                            type="button"
                            onClick={() =>
                              resolve(r._id)
                            }
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98] sm:w-auto"
                          >
                            <CheckCircle2
                              size={17}
                            />

                            Mark Resolved
                          </button>

                        </div>

                      )}

                    </div>

                  </div>

                ))}

              </div>
            )}

          </section>

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
  className,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">

      <div className="flex items-center justify-between gap-3">

        <div
          className={`flex h-9 w-9 items-center justify-center rounded-xl ${className}`}
        >
          {icon}
        </div>

        <span className="text-xl font-bold text-slate-900 sm:text-2xl">
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
   INFO ITEM
========================================================= */

function InfoItem({
  label,
  value,
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">

      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-semibold text-slate-700">
        {value}
      </p>

    </div>
  );
}

/* =========================================================
   SKELETON
========================================================= */

function ReportsSkeleton() {
  return (
    <div className="space-y-4">

      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5"
        >

          <div className="flex gap-3">

            <div className="h-10 w-10 rounded-xl bg-slate-200" />

            <div className="flex-1 space-y-3">

              <div className="h-4 w-1/3 rounded bg-slate-200" />

              <div className="h-3 w-full rounded bg-slate-100" />

              <div className="h-3 w-3/4 rounded bg-slate-100" />

            </div>

          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">

            <div className="h-16 rounded-xl bg-slate-100" />
            <div className="h-16 rounded-xl bg-slate-100" />
            <div className="h-16 rounded-xl bg-slate-100" />

          </div>

        </div>
      ))}

    </div>
  );
}

export default AdminReports;