import { useEffect, useState } from "react";
import api from "../../services/api";
import AdminSidebar from "../../components/admin/AdminSidebar";
import {
  Menu,
  Search,
  X,
  Stethoscope,
  Mail,
  ShieldCheck,
  Ban,
  CheckCircle2,
  Loader2,
} from "lucide-react";

function AdminAllDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [query, setQuery] = useState("");

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [actionId, setActionId] = useState("");

  useEffect(() => {
    load();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const load = async () => {
    try {
      setLoading(true);

      const response = await api.get("/admin/doctors", {
        params: {
          status: statusFilter || undefined,
          query: query || undefined,
        },
      });

      setDoctors(response.data.doctors || []);
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.message ||
          "Unable to load doctors"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    await load();
  };

  const toggleDisable = async (doctor) => {
    try {
      setActionId(doctor._id);

      if (doctor.isDisabled) {
        await api.patch(
          `/admin/doctors/${doctor._id}/enable`
        );
      } else {
        const reason =
          window.prompt(
            "Reason for disabling this doctor's account:"
          ) || "";

        await api.patch(
          `/admin/doctors/${doctor._id}/disable`,
          {
            reason,
          }
        );
      }

      await load();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Unable to update doctor"
      );
    } finally {
      setActionId("");
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f8fc]">
      {/* =====================================================
          DESKTOP SIDEBAR
          ===================================================== */}

      <aside
        className="
          fixed
          inset-y-0
          left-0
          z-40
          hidden
          w-64
          lg:block
        "
      >
        <div className="h-full w-64">
          <AdminSidebar />
        </div>
      </aside>

      {/* =====================================================
          MOBILE HEADER
          ===================================================== */}

      <header
        className="
          sticky
          top-0
          z-30
          flex
          h-16
          items-center
          justify-between
          border-b
          border-slate-200
          bg-white
          px-4
          shadow-sm
          lg:hidden
        "
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              border
              border-slate-200
              bg-white
              text-slate-700
              shadow-sm
              transition
              hover:bg-slate-50
            "
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Stethoscope size={19} />
            </div>

            <div>
              <p className="text-sm font-bold text-slate-900">
                CareCube
              </p>

              <p className="text-[10px] text-slate-400">
                Admin Panel
              </p>
            </div>
          </div>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600">
          <ShieldCheck size={18} />
        </div>
      </header>

      {/* =====================================================
          MOBILE DRAWER
          ===================================================== */}

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          {/* BACKDROP */}

          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMobileMenuOpen(false)}
            className="
              absolute
              inset-0
              h-full
              w-full
              cursor-default
              bg-black/40
              backdrop-blur-[2px]
            "
          />

          {/* DRAWER */}

          <div
            className="
              absolute
              inset-y-0
              left-0
              w-[280px]
              max-w-[85vw]
              overflow-y-auto
              bg-white
              shadow-2xl
            "
          >
            {/* DRAWER HEADER */}

            <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <ShieldCheck size={19} />
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Admin Panel
                  </p>

                  <p className="text-[10px] text-slate-400">
                    CareCube
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-lg
                  bg-slate-100
                  text-slate-600
                  hover:bg-slate-200
                "
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* SIDEBAR */}

            <div
              className="
                min-h-[calc(100vh-64px)]
                w-full
              "
            >
              <AdminSidebar />
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          MAIN CONTENT
          Desktop: margin-left 16rem
          Mobile: full width
          ===================================================== */}

      <main
        className="
          min-w-0
          lg:ml-64
        "
      >
        {/* PAGE HEADER */}

        <div className="border-b border-slate-200 bg-white">
          <div className="px-4 py-5 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="hidden h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 sm:flex">
                    <Stethoscope size={20} />
                  </div>

                  <div>
                    <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                      All Doctors
                    </h1>

                    <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                      Manage registered doctors and account status
                    </p>
                  </div>
                </div>
              </div>

              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                <UsersIcon />

                {doctors.length} Doctors
              </div>
            </div>
          </div>
        </div>

        {/* CONTENT */}

        <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
          {/* SEARCH CARD */}

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <form
              onSubmit={handleSearch}
              className="
                grid
                grid-cols-1
                gap-3
                md:grid-cols-[minmax(0,1fr)_200px_auto]
              "
            >
              {/* SEARCH */}

              <div className="relative">
                <Search
                  size={18}
                  className="
                    pointer-events-none
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                  "
                />

                <input
                  type="text"
                  placeholder="Search doctor by name..."
                  value={query}
                  onChange={(e) =>
                    setQuery(e.target.value)
                  }
                  className="
                    h-11
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    pl-10
                    pr-4
                    text-sm
                    text-slate-800
                    outline-none
                    transition
                    focus:border-blue-500
                    focus:bg-white
                    focus:ring-4
                    focus:ring-blue-100
                  "
                />
              </div>

              {/* STATUS */}

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
                className="
                  h-11
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  bg-slate-50
                  px-3
                  text-sm
                  text-slate-700
                  outline-none
                  focus:border-blue-500
                  focus:bg-white
                  focus:ring-4
                  focus:ring-blue-100
                "
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

              {/* SEARCH BUTTON */}

              <button
                type="submit"
                disabled={loading}
                className="
                  flex
                  h-11
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-blue-600
                  px-5
                  text-sm
                  font-semibold
                  text-white
                  shadow-sm
                  transition
                  hover:bg-blue-700
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {loading ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />

                    Searching...
                  </>
                ) : (
                  <>
                    <Search size={17} />
                    Search
                  </>
                )}
              </button>
            </form>
          </section>

          {/* DOCTORS */}

          <section className="mt-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Doctors
                </h2>

                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                  Review verification status and account access
                </p>
              </div>
            </div>

            {loading && doctors.length === 0 ? (
              <DoctorLoading />
            ) : doctors.length === 0 ? (
              <EmptyDoctors />
            ) : (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                {doctors.map((doctor) => (
                  <DoctorCard
                    key={doctor._id}
                    doctor={doctor}
                    actionId={actionId}
                    onToggle={toggleDisable}
                  />
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
   DOCTOR CARD
   ========================================================= */

function DoctorCard({
  doctor,
  actionId,
  onToggle,
}) {
  const isProcessing = actionId === doctor._id;

  return (
    <div
      className="
        overflow-hidden
        rounded-2xl
        border
        border-slate-200
        bg-white
        shadow-sm
        transition
        duration-300
        hover:-translate-y-0.5
        hover:shadow-md
      "
    >
      {/* CARD TOP */}

      <div className="p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          {/* DOCTOR INFO */}

          <div className="flex min-w-0 items-start gap-4">
            {/* AVATAR */}

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Stethoscope size={22} />
            </div>

            <div className="min-w-0">
              <h3 className="truncate text-base font-bold text-slate-900 sm:text-lg">
                Dr. {doctor.name}
              </h3>

              <p className="mt-0.5 text-sm font-medium text-blue-600">
                {doctor.specialization ||
                  "General Physician"}
              </p>

              {doctor.email && (
                <div className="mt-2 flex min-w-0 items-center gap-1.5 text-xs text-slate-500">
                  <Mail
                    size={13}
                    className="shrink-0"
                  />

                  <span className="truncate">
                    {doctor.email}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* STATUS */}

          <StatusBadge
            status={doctor.verificationStatus}
            disabled={doctor.isDisabled}
          />
        </div>

        {/* DETAILS */}

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoBox
            label="Verification Status"
            value={
              doctor.verificationStatus || "Unknown"
            }
          />

          <InfoBox
            label="Account"
            value={
              doctor.isDisabled
                ? "Disabled"
                : "Active"
            }
          />
        </div>

        {/* DISABLED REASON */}

        {doctor.disabledReason && (
          <div className="mt-4 rounded-xl border border-red-100 bg-red-50 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-red-500">
              Disable Reason
            </p>

            <p className="mt-1 text-xs leading-5 text-red-700">
              {doctor.disabledReason}
            </p>
          </div>
        )}
      </div>

      {/* ACTION */}

      {doctor.verificationStatus === "verified" && (
        <div className="border-t border-slate-100 bg-slate-50/70 p-4">
          <button
            onClick={() => onToggle(doctor)}
            disabled={isProcessing}
            className={`
              flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              px-4
              py-2.5
              text-sm
              font-semibold
              text-white
              transition
              disabled:cursor-not-allowed
              disabled:opacity-60
              sm:w-auto
              sm:min-w-[130px]
              ${
                doctor.isDisabled
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-red-600 hover:bg-red-700"
              }
            `}
          >
            {isProcessing ? (
              <>
                <Loader2
                  size={16}
                  className="animate-spin"
                />

                Updating...
              </>
            ) : doctor.isDisabled ? (
              <>
                <CheckCircle2 size={16} />
                Enable
              </>
            ) : (
              <>
                <Ban size={16} />
                Disable
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   STATUS BADGE
   ========================================================= */

function StatusBadge({
  status,
  disabled,
}) {
  if (disabled) {
    return (
      <span
        className="
          inline-flex
          shrink-0
          items-center
          gap-1.5
          rounded-full
          bg-red-100
          px-2.5
          py-1
          text-[11px]
          font-bold
          text-red-700
        "
      >
        <Ban size={12} />
        Disabled
      </span>
    );
  }

  if (status === "verified") {
    return (
      <span
        className="
          inline-flex
          shrink-0
          items-center
          gap-1.5
          rounded-full
          bg-emerald-100
          px-2.5
          py-1
          text-[11px]
          font-bold
          text-emerald-700
        "
      >
        <CheckCircle2 size={12} />
        Verified
      </span>
    );
  }

  if (status === "pending") {
    return (
      <span
        className="
          inline-flex
          shrink-0
          items-center
          gap-1.5
          rounded-full
          bg-amber-100
          px-2.5
          py-1
          text-[11px]
          font-bold
          text-amber-700
        "
      >
        Pending
      </span>
    );
  }

  return (
    <span
      className="
        inline-flex
        shrink-0
        items-center
        rounded-full
        bg-slate-100
        px-2.5
        py-1
        text-[11px]
        font-bold
        capitalize
        text-slate-600
      "
    >
      {status || "Unknown"}
    </span>
  );
}

/* =========================================================
   INFO BOX
   ========================================================= */

function InfoBox({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold capitalize text-slate-700">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   EMPTY
   ========================================================= */

function EmptyDoctors() {
  return (
    <div
      className="
        rounded-2xl
        border
        border-dashed
        border-slate-300
        bg-white
        px-5
        py-14
        text-center
      "
    >
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <Stethoscope size={25} />
      </div>

      <h3 className="mt-4 font-bold text-slate-800">
        No doctors found
      </h3>

      <p className="mt-1 text-sm text-slate-500">
        Try changing the search or status filter.
      </p>
    </div>
  );
}

/* =========================================================
   LOADING
   ========================================================= */

function DoctorLoading() {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="
            h-64
            animate-pulse
            rounded-2xl
            border
            border-slate-200
            bg-white
          "
        />
      ))}
    </div>
  );
}

/* =========================================================
   USERS ICON
   ========================================================= */

function UsersIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export default AdminAllDoctors;