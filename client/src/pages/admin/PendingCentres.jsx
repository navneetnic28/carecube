import { useEffect, useState } from "react";
import api from "../../services/api";
import AdminSidebar from "../../components/admin/AdminSidebar";
import {
  Menu,
  X,
  Building2,
  MapPin,
  CheckCircle2,
  XCircle,
  RefreshCw,
  ShieldCheck,
  Clock3,
} from "lucide-react";

function PendingCentres() {
  const [centres, setCentres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processingId, setProcessingId] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    loadCentres();
  }, []);

  /* =====================================================
     LOAD CENTRES
  ===================================================== */

  const loadCentres = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await api.get("/admin/centres/pending");

      setCentres(response.data?.centres || []);
    } catch (error) {
      console.error("Load centres error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to load pending centres"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /* =====================================================
     VERIFY
  ===================================================== */

  const verifyCentre = async (centreId) => {
    try {
      setProcessingId(centreId);

      await api.patch(
        `/admin/centres/${centreId}/verify`
      );

      await loadCentres();
    } catch (error) {
      console.error("Verify centre error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to verify centre"
      );
    } finally {
      setProcessingId("");
    }
  };

  /* =====================================================
     REJECT
  ===================================================== */

  const rejectCentre = async (centreId) => {
    const reason = window.prompt(
      "Reason for rejection:"
    );

    if (reason === null) return;

    if (!reason.trim()) {
      alert("Please enter a rejection reason.");
      return;
    }

    try {
      setProcessingId(centreId);

      await api.patch(
        `/admin/centres/${centreId}/reject`,
        {
          reason: reason.trim(),
        }
      );

      await loadCentres();
    } catch (error) {
      console.error("Reject centre error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to reject centre"
      );
    } finally {
      setProcessingId("");
    }
  };

  /* =====================================================
     CLOSE MOBILE SIDEBAR
  ===================================================== */

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f8fc]">

        {/* DESKTOP SIDEBAR */}
        <div className="fixed inset-y-0 left-0 z-50 hidden w-64 lg:block">
          <div className="h-full w-full">
            <AdminSidebar />
          </div>
        </div>

        {/* MOBILE HEADER */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:hidden">

          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm"
            aria-label="Open menu"
          >
            <Menu size={21} />
          </button>

          <h1 className="text-base font-bold text-slate-900">
            Centre Verification
          </h1>

          <div className="w-10" />

        </header>

        {/* MOBILE DRAWER */}
        {mobileMenuOpen && (
          <MobileDrawer onClose={closeMobileMenu} />
        )}

        {/* MAIN */}
        <main className="min-w-0 lg:ml-64">
          <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <LoadingSkeleton />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f8fc]">

      {/* =================================================
          DESKTOP SIDEBAR
          FIXED — NEVER GOES BELOW CONTENT
      ================================================= */}

      <div className="fixed inset-y-0 left-0 z-50 hidden w-64 lg:block">
        <div className="h-full w-full overflow-y-auto">
          <AdminSidebar />
        </div>
      </div>

      {/* =================================================
          MOBILE HEADER
      ================================================= */}

      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:hidden">

        {/* MENU */}

        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-95"
          aria-label="Open menu"
        >
          <Menu size={21} />
        </button>

        {/* TITLE */}

        <div className="flex min-w-0 items-center gap-2">
          <Building2
            size={19}
            className="shrink-0 text-blue-600"
          />

          <h1 className="truncate text-base font-bold text-slate-900">
            Centre Verification
          </h1>
        </div>

        {/* REFRESH */}

        <button
          type="button"
          onClick={() => loadCentres(true)}
          disabled={refreshing}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
          aria-label="Refresh"
        >
          <RefreshCw
            size={17}
            className={
              refreshing ? "animate-spin" : ""
            }
          />
        </button>
      </header>

      {/* =================================================
          MOBILE DRAWER
      ================================================= */}

      {mobileMenuOpen && (
        <MobileDrawer onClose={closeMobileMenu} />
      )}

      {/* =================================================
          MAIN CONTENT

          IMPORTANT:
          lg:ml-64 = sidebar width
          So content starts AFTER sidebar.
      ================================================= */}

      <main className="min-w-0 lg:ml-64">

        <div className="mx-auto w-full max-w-7xl px-4 py-5 pb-10 sm:px-6 sm:py-7 lg:px-8">

          {/* =================================================
              PAGE HEADER
          ================================================= */}

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex min-w-0 items-center gap-3">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <ShieldCheck size={22} />
                </div>

                <div className="min-w-0">

                  <h1 className="truncate text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                    Centre Verification
                  </h1>

                  <p className="mt-1 text-sm text-slate-500">
                    Review and verify healthcare centres
                    waiting for approval.
                  </p>

                </div>
              </div>

              {/* DESKTOP REFRESH */}

              <button
                type="button"
                onClick={() => loadCentres(true)}
                disabled={refreshing}
                className="hidden shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50 sm:flex"
              >
                <RefreshCw
                  size={16}
                  className={
                    refreshing
                      ? "animate-spin"
                      : ""
                  }
                />

                Refresh
              </button>

            </div>
          </section>

          {/* =================================================
              SUMMARY
          ================================================= */}

          <section className="mt-5 grid gap-4 sm:grid-cols-2">

            {/* PENDING */}

            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-amber-600 shadow-sm">
                  <Clock3 size={19} />
                </div>

                <div>

                  <p className="text-xs font-medium text-amber-700">
                    Pending Centres
                  </p>

                  <p className="mt-1 text-2xl font-bold text-amber-900">
                    {centres.length}
                  </p>

                </div>

              </div>
            </div>

            {/* QUEUE */}

            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                  <Building2 size={19} />
                </div>

                <div>

                  <p className="text-xs font-medium text-blue-700">
                    Verification Queue
                  </p>

                  <p className="mt-1 text-sm font-semibold text-blue-900">
                    Centres awaiting admin review
                  </p>

                </div>

              </div>
            </div>

          </section>

          {/* =================================================
              LIST HEADER
          ================================================= */}

          <section className="mt-6">

            <div className="mb-4 flex items-center justify-between gap-3">

              <div>

                <h2 className="font-bold text-slate-900">
                  Pending Centres
                </h2>

                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                  Verify or reject each centre registration.
                </p>

              </div>

              {centres.length > 0 && (
                <span className="shrink-0 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
                  {centres.length} Pending
                </span>
              )}

            </div>

            {/* =================================================
                EMPTY STATE
            ================================================= */}

            {centres.length === 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white px-5 py-12 text-center shadow-sm">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <CheckCircle2 size={28} />
                </div>

                <h3 className="mt-4 text-base font-bold text-slate-900">
                  No pending centres
                </h3>

                <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
                  There are currently no centre registrations
                  waiting for verification.
                </p>

              </div>
            )}

            {/* =================================================
                CENTRE CARDS
            ================================================= */}

            <div className="space-y-4">

              {centres.map((centre) => {

                const isProcessing =
                  processingId === centre._id;

                return (
                  <article
                    key={centre._id}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:shadow-md"
                  >

                    <div className="p-5 sm:p-6">

                      {/* TOP */}

                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                        {/* CENTRE */}

                        <div className="flex min-w-0 gap-4">

                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <Building2 size={23} />
                          </div>

                          <div className="min-w-0">

                            <h3 className="break-words text-lg font-bold text-slate-900">
                              {centre.name ||
                                "Unnamed Centre"}
                            </h3>

                            <div className="mt-2 flex items-start gap-2 text-sm text-slate-500">

                              <MapPin
                                size={16}
                                className="mt-0.5 shrink-0 text-slate-400"
                              />

                              <span className="break-words">
                                {centre.address ||
                                  "Address not provided"}
                              </span>

                            </div>

                          </div>
                        </div>

                        {/* STATUS */}

                        <span className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold capitalize text-amber-700">

                          <Clock3 size={13} />

                          {centre.verificationStatus ||
                            "pending"}

                        </span>

                      </div>

                      {/* DETAILS */}

                      <div className="mt-5 grid gap-3 sm:grid-cols-2">

                        <InfoBox
                          label="Centre Type"
                          value={
                            centre.type ||
                            "Not specified"
                          }
                        />

                        <InfoBox
                          label="Verification Status"
                          value={
                            centre.verificationStatus ||
                            "Pending"
                          }
                        />

                      </div>

                      {/* ACTIONS */}

                      <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">

                        {/* REJECT */}

                        <button
                          type="button"
                          onClick={() =>
                            rejectCentre(centre._id)
                          }
                          disabled={isProcessing}
                          className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                        >
                          <XCircle size={17} />

                          {isProcessing
                            ? "Processing..."
                            : "Reject"}
                        </button>

                        {/* VERIFY */}

                        <button
                          type="button"
                          onClick={() =>
                            verifyCentre(centre._id)
                          }
                          disabled={isProcessing}
                          className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                        >
                          <CheckCircle2 size={17} />

                          {isProcessing
                            ? "Processing..."
                            : "Verify"}
                        </button>

                      </div>
                    </div>
                  </article>
                );
              })}

            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

/* =====================================================
   INFO BOX
===================================================== */

function InfoBox({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5">

      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-semibold capitalize text-slate-800">
        {value}
      </p>

    </div>
  );
}

/* =====================================================
   MOBILE DRAWER
===================================================== */

function MobileDrawer({ onClose }) {
  return (
    <div className="fixed inset-0 z-[999] lg:hidden">

      {/* BACKDROP */}

      <div
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* DRAWER */}

      <aside className="absolute left-0 top-0 h-full w-[280px] max-w-[85vw] overflow-y-auto bg-white shadow-2xl">

        {/* DRAWER HEADER */}

        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4">

          <div className="flex items-center gap-2">

            <ShieldCheck
              size={20}
              className="text-blue-600"
            />

            <span className="font-bold text-slate-900">
              CareCube Admin
            </span>

          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>

        </div>

        {/* SIDEBAR */}

        <div className="relative">

          <AdminSidebar />

        </div>

      </aside>
    </div>
  );
}

/* =====================================================
   LOADING SKELETON
===================================================== */

function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-6">

      {/* HEADER */}

      <div className="rounded-2xl bg-white p-6">

        <div className="h-8 w-64 rounded-lg bg-slate-200" />

        <div className="mt-3 h-4 w-80 max-w-full rounded bg-slate-200" />

      </div>

      {/* SUMMARY */}

      <div className="grid gap-4 sm:grid-cols-2">

        <div className="h-24 rounded-2xl bg-white" />

        <div className="h-24 rounded-2xl bg-white" />

      </div>

      {/* CARDS */}

      <div className="space-y-4">

        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-64 rounded-2xl bg-white"
          />
        ))}

      </div>

    </div>
  );
}

export default PendingCentres;