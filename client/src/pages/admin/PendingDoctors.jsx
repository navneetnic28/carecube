import { useEffect, useState } from "react";
import api from "../../services/api";
import AdminSidebar from "../../components/admin/AdminSidebar";
import {
  Menu,
  X,
  Stethoscope,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  RefreshCw,
  UserRound,
  GraduationCap,
  FileText,
  Clock3,
} from "lucide-react";

function PendingDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [verifyingId, setVerifyingId] = useState("");
  const [rejectingId, setRejectingId] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    loadDoctors();
  }, []);

  // Prevent body scrolling when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const loadDoctors = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await api.get("/admin/doctors/pending");

      setDoctors(response.data?.doctors || []);
    } catch (error) {
      console.error("Unable to load pending doctors:", error);
      alert(
        error.response?.data?.message ||
          "Unable to load pending doctors"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const verifyDoctor = async (doctorId) => {
    try {
      setVerifyingId(doctorId);

      await api.patch(`/admin/doctors/${doctorId}/verify`);

      await loadDoctors();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Unable to verify doctor"
      );
    } finally {
      setVerifyingId("");
    }
  };

  const rejectDoctor = async (doctorId) => {
    const reason = window.prompt("Reason for rejection:");

    if (reason === null) return;

    try {
      setRejectingId(doctorId);

      await api.patch(`/admin/doctors/${doctorId}/reject`, {
        reason,
      });

      await loadDoctors();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Unable to reject doctor"
      );
    } finally {
      setRejectingId("");
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f8fc]">
      {/* =====================================================
          DESKTOP SIDEBAR
          Visible only on lg and above
      ====================================================== */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 lg:block">
        <AdminSidebar />
      </aside>

      {/* =====================================================
          MOBILE OVERLAY
      ====================================================== */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-[2px] lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* =====================================================
          MOBILE DRAWER
      ====================================================== */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[280px] max-w-[85vw] transform bg-white shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
          mobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <ShieldCheck size={20} />
            </div>

            <div>
              <p className="text-sm font-bold text-slate-900">
                CareCube
              </p>

              <p className="text-[11px] text-slate-400">
                Admin Panel
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            aria-label="Close menu"
          >
            <X size={21} />
          </button>
        </div>

        {/* Actual Sidebar */}
        <div
          className="h-[calc(100vh-64px)] overflow-y-auto"
          onClick={(e) => {
            // Close drawer when a sidebar navigation link/button is clicked
            const target = e.target.closest("a, button");

            if (target) {
              setMobileMenuOpen(false);
            }
          }}
        >
          <AdminSidebar />
        </div>
      </aside>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}
      <main className="min-w-0 lg:ml-64">
        {/* =====================================================
            TOP HEADER
        ====================================================== */}
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="mx-auto flex min-h-[68px] max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
            {/* LEFT */}
            <div className="flex min-w-0 items-center gap-3">
              {/* MOBILE MENU BUTTON */}
              <button
                type="button"
                onClick={() =>
                  setMobileMenuOpen(true)
                }
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-95 lg:hidden"
                aria-label="Open menu"
              >
                <Menu size={21} />
              </button>

              {/* TITLE ICON */}
              <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 sm:flex">
                <Stethoscope size={20} />
              </div>

              <div className="min-w-0">
                <h1 className="truncate text-lg font-bold tracking-tight text-slate-900 sm:text-xl lg:text-2xl">
                  Doctor Verification
                </h1>

                <p className="hidden text-xs text-slate-500 sm:block">
                  Review and verify pending doctor registrations
                </p>

                <p className="text-[11px] text-slate-500 sm:hidden">
                  Pending doctor approvals
                </p>
              </div>
            </div>

            {/* RIGHT */}
            <button
              type="button"
              onClick={() => loadDoctors(true)}
              disabled={refreshing}
              className="flex h-10 shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4"
            >
              <RefreshCw
                size={16}
                className={
                  refreshing ? "animate-spin" : ""
                }
              />

              <span className="hidden sm:inline">
                Refresh
              </span>
            </button>
          </div>
        </header>

        {/* =====================================================
            PAGE CONTENT
        ====================================================== */}
        <div className="mx-auto w-full max-w-7xl px-4 py-5 pb-10 sm:px-6 sm:py-7 lg:px-8">
          {/* =====================================================
              SUMMARY CARD
          ====================================================== */}
          <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-5 text-white shadow-lg shadow-blue-100 sm:p-7">
            {/* Decorative circles */}
            <div className="pointer-events-none absolute -right-12 -top-16 h-44 w-44 rounded-full bg-white/10" />

            <div className="pointer-events-none absolute -bottom-16 right-24 h-36 w-36 rounded-full bg-white/5" />

            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold backdrop-blur">
                  <ShieldCheck size={14} />
                  Verification Centre
                </div>

                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Pending Doctors
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100 sm:text-base">
                  Review doctor registration details and verify
                  or reject applications submitted to CareCube.
                </p>
              </div>

              {/* Count */}
              <div className="flex h-20 w-full shrink-0 items-center justify-between rounded-2xl bg-white/10 px-5 backdrop-blur sm:h-20 sm:w-32 sm:flex-col sm:justify-center sm:px-0">
                <span className="text-xs font-medium text-blue-100">
                  Pending
                </span>

                <span className="text-3xl font-bold">
                  {doctors.length}
                </span>
              </div>
            </div>
          </section>

          {/* =====================================================
              SECTION HEADER
          ====================================================== */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Doctor Applications
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Verify professional information before approval.
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
              <Clock3 size={14} />
              {doctors.length} pending
            </div>
          </div>

          {/* =====================================================
              LOADING
          ====================================================== */}
          {loading ? (
            <div className="mt-5 space-y-4">
              {[1, 2, 3].map((item) => (
                <DoctorSkeleton key={item} />
              ))}
            </div>
          ) : doctors.length === 0 ? (
            /* =====================================================
                EMPTY STATE
            ====================================================== */
            <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 size={30} />
              </div>

              <h3 className="mt-4 text-lg font-bold text-slate-900">
                No pending doctors
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                There are currently no doctor applications waiting
                for verification.
              </p>
            </div>
          ) : (
            /* =====================================================
                DOCTOR LIST
            ====================================================== */
            <div className="mt-5 space-y-4">
              {doctors.map((doctor) => {
                const isVerifying =
                  verifyingId === doctor._id;

                const isRejecting =
                  rejectingId === doctor._id;

                const isProcessing =
                  isVerifying || isRejecting;

                return (
                  <DoctorCard
                    key={doctor._id}
                    doctor={doctor}
                    isVerifying={isVerifying}
                    isRejecting={isRejecting}
                    isProcessing={isProcessing}
                    onVerify={verifyDoctor}
                    onReject={rejectDoctor}
                  />
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

/* =========================================================
   DOCTOR CARD
========================================================= */

function DoctorCard({
  doctor,
  isVerifying,
  isRejecting,
  isProcessing,
  onVerify,
  onReject,
}) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:shadow-md">
      {/* Top section */}
      <div className="p-5 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          {/* Doctor info */}
          <div className="flex min-w-0 gap-4">
            {/* Avatar */}
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 text-blue-600">
              <UserRound size={27} />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900 sm:text-xl">
                  Dr. {doctor.name}
                </h3>

                <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-700">
                  Pending
                </span>
              </div>

              <p className="mt-1 font-medium text-blue-600">
                {doctor.specialization || "Specialization not provided"}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {doctor.qualification ||
                  "Qualification not provided"}
              </p>
            </div>
          </div>

          {/* Status */}
          <div className="w-fit rounded-xl bg-amber-50 px-3 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-amber-600">
              Verification Status
            </p>

            <p className="mt-0.5 text-sm font-bold capitalize text-amber-700">
              {doctor.verificationStatus || "pending"}
            </p>
          </div>
        </div>

        {/* =====================================================
            DETAILS
        ====================================================== */}
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <InfoBox
            icon={<FileText size={16} />}
            label="Registration Number"
            value={
              doctor.registrationNumber ||
              "Not provided"
            }
          />

          <InfoBox
            icon={<GraduationCap size={16} />}
            label="Qualification"
            value={
              doctor.qualification ||
              "Not provided"
            }
          />

          <InfoBox
            icon={<Stethoscope size={16} />}
            label="Specialization"
            value={
              doctor.specialization ||
              "Not provided"
            }
          />
        </div>
      </div>

      {/* =====================================================
          ACTION AREA
      ====================================================== */}
      <div className="border-t border-slate-100 bg-slate-50/70 p-4 sm:px-6 sm:py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="hidden text-xs text-slate-400 sm:block">
            Review the doctor's information before taking action.
          </p>

          <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto">
            {/* Reject */}
            <button
              type="button"
              onClick={() => onReject(doctor._id)}
              disabled={isProcessing}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:min-w-[120px]"
            >
              {isRejecting ? (
                <>
                  <RefreshCw
                    size={16}
                    className="animate-spin"
                  />
                  Rejecting...
                </>
              ) : (
                <>
                  <XCircle size={16} />
                  Reject
                </>
              )}
            </button>

            {/* Verify */}
            <button
              type="button"
              onClick={() => onVerify(doctor._id)}
              disabled={isProcessing}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:min-w-[120px]"
            >
              {isVerifying ? (
                <>
                  <RefreshCw
                    size={16}
                    className="animate-spin"
                  />
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  Verify
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   INFO BOX
========================================================= */

function InfoBox({ icon, label, value }) {
  return (
    <div className="min-w-0 rounded-xl border border-slate-100 bg-slate-50 p-3.5">
      <div className="flex items-center gap-2 text-slate-400">
        {icon}

        <span className="text-[11px] font-medium">
          {label}
        </span>
      </div>

      <p className="mt-1.5 truncate text-sm font-semibold text-slate-700">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   SKELETON
========================================================= */

function DoctorSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="p-5 sm:p-6">
        <div className="flex gap-4">
          <div className="h-14 w-14 shrink-0 rounded-2xl bg-slate-200" />

          <div className="flex-1">
            <div className="h-5 w-48 max-w-full rounded bg-slate-200" />

            <div className="mt-3 h-4 w-36 rounded bg-slate-200" />

            <div className="mt-2 h-3 w-44 rounded bg-slate-200" />
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="h-16 rounded-xl bg-slate-100" />
          <div className="h-16 rounded-xl bg-slate-100" />
          <div className="h-16 rounded-xl bg-slate-100" />
        </div>
      </div>

      <div className="h-16 bg-slate-50" />
    </div>
  );
}

export default PendingDoctors;