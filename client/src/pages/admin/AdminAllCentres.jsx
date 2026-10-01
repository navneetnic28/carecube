import { useEffect, useState } from "react";
import api from "../../services/api";
import AdminSidebar from "../../components/admin/AdminSidebar";
import {
  Menu,
  X,
  Building2,
  Search,
  RefreshCw,
  MapPin,
  Mail,
  ShieldCheck,
  ShieldOff,
} from "lucide-react";

function AdminAllCentres() {
  const [centres, setCentres] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [query, setQuery] = useState("");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  // -----------------------------------------
  // LOAD CENTRES
  // -----------------------------------------
  const load = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await api.get("/admin/centres", {
        params: {
          status: statusFilter || undefined,
          query: query || undefined,
        },
      });

      setCentres(response.data.centres || []);
    } catch (error) {
      console.error("Unable to load centres:", error);

      alert(
        error.response?.data?.message ||
          "Unable to load centres"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // -----------------------------------------
  // TOGGLE DISABLE / ENABLE
  // -----------------------------------------
  const toggleDisable = async (centre) => {
    try {
      if (centre.isDisabled) {
        await api.patch(
          `/admin/centres/${centre._id}/enable`
        );
      } else {
        const reason = window.prompt(
          "Reason for disabling this centre's account:"
        );

        if (reason === null) return;

        await api.patch(
          `/admin/centres/${centre._id}/disable`,
          {
            reason,
          }
        );
      }

      await load(true);
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Unable to update centre"
      );
    }
  };

  // -----------------------------------------
  // SEARCH
  // -----------------------------------------
  const handleSearch = (e) => {
    e.preventDefault();
    load(true);
  };

  // -----------------------------------------
  // CLOSE MOBILE SIDEBAR
  // -----------------------------------------
  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50">

      {/* =====================================================
          MOBILE OVERLAY
      ====================================================== */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* =====================================================
          SIDEBAR
          
          IMPORTANT:
          Desktop -> fixed left
          Mobile -> drawer
      ====================================================== */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          w-64
          transform
          bg-white
          shadow-xl
          transition-transform duration-300 ease-in-out

          lg:translate-x-0

          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* Mobile Close Button */}
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4 lg:hidden">
          <div className="flex items-center gap-2">
            <Building2
              size={22}
              className="text-blue-600"
            />

            <span className="font-bold text-slate-900">
              Admin Panel
            </span>
          </div>

          <button
            type="button"
            onClick={closeSidebar}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100"
            aria-label="Close menu"
          >
            <X size={21} />
          </button>
        </div>

        {/* Existing Sidebar */}
        <div className="h-full overflow-y-auto">
          <AdminSidebar />
        </div>
      </aside>

      {/* =====================================================
          MAIN CONTENT
          
          Desktop:
          ml-64 => sidebar ke right mein content

          Mobile:
          ml-0 => full width
      ====================================================== */}
      <main className="min-h-screen min-w-0 lg:ml-64">

        {/* =================================================
            MOBILE TOP BAR
        ================================================== */}
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur lg:hidden">
          <div className="flex h-16 items-center justify-between px-4">

            <div className="flex min-w-0 items-center gap-3">

              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition hover:bg-slate-200"
                aria-label="Open menu"
              >
                <Menu size={22} />
              </button>

              <div className="min-w-0">
                <p className="truncate text-base font-bold text-slate-900">
                  All Centres
                </p>

                <p className="text-xs text-slate-500">
                  Centre management
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => load(true)}
              disabled={refreshing}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm"
              aria-label="Refresh"
            >
              <RefreshCw
                size={18}
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />
            </button>
          </div>
        </header>

        {/* =================================================
            PAGE CONTAINER
        ================================================== */}
        <div className="w-full px-4 py-5 sm:px-6 sm:py-7 lg:px-8">

          {/* =================================================
              DESKTOP HEADER
          ================================================== */}
          <div className="mb-6 hidden items-center justify-between lg:flex">

            <div>
              <div className="flex items-center gap-3">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Building2 size={24} />
                </div>

                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                    All Centres
                  </h1>

                  <p className="mt-1 text-sm text-slate-500">
                    Manage and monitor registered healthcare centres
                  </p>
                </div>

              </div>
            </div>

            <button
              type="button"
              onClick={() => load(true)}
              disabled={refreshing}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:opacity-60"
            >
              <RefreshCw
                size={17}
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />

              Refresh
            </button>

          </div>

          {/* =================================================
              MOBILE TITLE
          ================================================== */}
          <div className="mb-5 lg:hidden">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Building2 size={21} />
              </div>

              <div className="min-w-0">

                <h1 className="truncate text-xl font-bold text-slate-900">
                  All Centres
                </h1>

                <p className="mt-0.5 text-xs text-slate-500">
                  Manage registered healthcare centres
                </p>

              </div>

            </div>

          </div>

          {/* =================================================
              SEARCH / FILTER CARD
          ================================================== */}
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">

            <div className="mb-4">
              <h2 className="text-sm font-bold text-slate-900">
                Search & Filter
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Find centres by name or verification status
              </p>
            </div>

            <form
              onSubmit={handleSearch}
              className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_200px_auto]"
            >

              {/* Search */}
              <div className="relative min-w-0">

                <Search
                  size={18}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  placeholder="Search centre by name..."
                  value={query}
                  onChange={(e) =>
                    setQuery(e.target.value)
                  }
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />

              </div>

              {/* Status */}
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              >
                <option value="">
                  All statuses
                </option>

                <option value="pending">
                  Pending
                </option>

                <option value="verified">
                  Verified
                </option>

                <option value="rejected">
                  Rejected
                </option>
              </select>

              {/* Search Button */}
              <button
                type="submit"
                disabled={refreshing}
                className="flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Search size={17} />

                Search
              </button>

            </form>
          </section>

          {/* =================================================
              RESULT COUNT
          ================================================== */}
          <div className="mt-6 flex items-center justify-between">

            <div>
              <h2 className="text-base font-bold text-slate-900">
                Registered Centres
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                {loading
                  ? "Loading centres..."
                  : `${centres.length} centre${
                      centres.length !== 1
                        ? "s"
                        : ""
                    } found`}
              </p>
            </div>

          </div>

          {/* =================================================
              LOADING
          ================================================== */}
          {loading && (
            <div className="mt-5 space-y-4">

              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div className="space-y-3">
                      <div className="h-5 w-48 rounded bg-slate-200" />
                      <div className="h-4 w-72 rounded bg-slate-200" />
                      <div className="h-4 w-56 rounded bg-slate-200" />
                    </div>

                    <div className="h-10 w-24 rounded-xl bg-slate-200" />

                  </div>
                </div>
              ))}

            </div>
          )}

          {/* =================================================
              CENTRES LIST
          ================================================== */}
          {!loading && (
            <div className="mt-5 space-y-4">

              {centres.map((centre) => (

                <div
                  key={centre._id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
                >

                  <div className="p-5 sm:p-6">

                    {/* TOP */}
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                      {/* CENTRE INFO */}
                      <div className="min-w-0">

                        <div className="flex items-start gap-3">

                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <Building2 size={21} />
                          </div>

                          <div className="min-w-0">

                            <h3 className="break-words text-lg font-bold text-slate-900">
                              {centre.name}
                            </h3>

                            <p className="mt-1 text-sm capitalize text-slate-500">
                              {centre.type ||
                                "Healthcare Centre"}
                            </p>

                          </div>

                        </div>

                        {/* DETAILS */}
                        <div className="mt-5 space-y-2.5">

                          {/* Address */}
                          <div className="flex items-start gap-2 text-sm text-slate-500">

                            <MapPin
                              size={17}
                              className="mt-0.5 shrink-0 text-slate-400"
                            />

                            <span className="break-words">
                              {centre.address ||
                                "Address not available"}

                              {centre.city
                                ? `, ${centre.city}`
                                : ""}
                            </span>

                          </div>

                          {/* Email */}
                          {centre.email && (
                            <div className="flex min-w-0 items-center gap-2 text-sm text-slate-500">

                              <Mail
                                size={17}
                                className="shrink-0 text-slate-400"
                              />

                              <span className="break-all">
                                {centre.email}
                              </span>

                            </div>
                          )}

                        </div>

                        {/* STATUS */}
                        <div className="mt-4 flex flex-wrap items-center gap-2">

                          <span className="text-xs font-medium text-slate-500">
                            Verification:
                          </span>

                          <span
                            className={`
                              rounded-full px-2.5 py-1
                              text-xs font-semibold
                              capitalize
                              ${
                                centre.verificationStatus ===
                                "verified"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : centre.verificationStatus ===
                                    "rejected"
                                  ? "bg-red-50 text-red-700"
                                  : "bg-amber-50 text-amber-700"
                              }
                            `}
                          >
                            {centre.verificationStatus}
                          </span>

                          {centre.isDisabled && (
                            <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">
                              Disabled
                            </span>
                          )}

                        </div>

                        {/* DISABLED REASON */}
                        {centre.disabledReason && (
                          <div className="mt-3 rounded-lg bg-red-50 p-3">

                            <p className="text-xs font-semibold text-red-700">
                              Disabled Reason
                            </p>

                            <p className="mt-1 break-words text-xs text-red-600">
                              {centre.disabledReason}
                            </p>

                          </div>
                        )}

                      </div>

                      {/* ACTION */}
                      {centre.verificationStatus ===
                        "verified" && (

                        <div className="w-full shrink-0 lg:w-auto">

                          <button
                            type="button"
                            onClick={() =>
                              toggleDisable(centre)
                            }
                            className={`
                              flex w-full items-center
                              justify-center gap-2
                              rounded-xl px-4 py-2.5
                              text-sm font-semibold
                              text-white
                              transition
                              lg:w-auto
                              ${
                                centre.isDisabled
                                  ? "bg-emerald-600 hover:bg-emerald-700"
                                  : "bg-red-600 hover:bg-red-700"
                              }
                            `}
                          >

                            {centre.isDisabled ? (
                              <>
                                <ShieldCheck size={17} />
                                Enable Centre
                              </>
                            ) : (
                              <>
                                <ShieldOff size={17} />
                                Disable Centre
                              </>
                            )}

                          </button>

                        </div>

                      )}

                    </div>

                  </div>

                </div>

              ))}

              {/* EMPTY */}
              {centres.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center">

                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                    <Building2 size={26} />
                  </div>

                  <h3 className="mt-4 text-base font-bold text-slate-900">
                    No centres found
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Try changing the search text or status filter.
                  </p>

                </div>
              )}

            </div>
          )}

        </div>
      </main>
    </div>
  );
}

export default AdminAllCentres;