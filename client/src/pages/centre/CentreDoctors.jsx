import { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import CentreSidebar from "../../components/centre/CentreSidebar";
import StatusBadge from "../../components/StatusBadge";
import {
  Menu,
  X,
  Search,
  ExternalLink,
  UserPlus,
  CheckCircle2,
  XCircle,
  Clock3,
  Users,
  Stethoscope,
  RefreshCw,
} from "lucide-react";

const STATUS_OPTIONS = [
  { value: "available", label: "🟢 Available" },
  { value: "delayed", label: "🟡 Delayed" },
  { value: "unavailable", label: "🔴 Not available today" },
  { value: "holiday", label: "🔴 On holiday" },
];

function CentreDoctors() {
  const { user } = useAuth();

  const [doctors, setDoctors] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState([]);
  const [searchedOnce, setSearchedOnce] = useState(false);

  const [statuses, setStatuses] = useState({});
  const [savingId, setSavingId] = useState("");
  const [joinRequests, setJoinRequests] = useState([]);

  // Mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    loadDoctors();
    loadStatuses();
    loadJoinRequests();
  }, []);

  // Close mobile menu when screen becomes desktop
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

  // Prevent body scroll while mobile drawer is open
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

  /* =====================================================
     LOAD JOIN REQUESTS
  ===================================================== */

  const loadJoinRequests = async () => {
    try {
      const res = await api.get("/centre/join-requests");
      setJoinRequests(res.data?.requests || []);
    } catch (e) {
      console.error("Join requests error:", e);
    }
  };

  /* =====================================================
     RESPOND JOIN REQUEST
  ===================================================== */

  const respondJoin = async (id, action) => {
    try {
      await api.patch(`/centre/join-requests/${id}/${action}`);

      await loadJoinRequests();
      await loadDoctors();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          `Unable to ${action} request`
      );
    }
  };

  /* =====================================================
     LOAD DOCTORS
  ===================================================== */

  const loadDoctors = async () => {
    try {
      const response = await api.get("/centre/doctors");
      setDoctors(response.data?.doctors || []);
    } catch (error) {
      console.error("Doctors loading error:", error);
    }
  };

  /* =====================================================
     LOAD STATUS
  ===================================================== */

  const loadStatuses = async () => {
    try {
      const response = await api.get("/centre/status");

      const map = {};

      (response.data?.statuses || []).forEach((s) => {
        const doctorId = s.doctorId?._id || s.doctorId;

        if (!doctorId) return;

        map[doctorId] = {
          status: s.status,
          delayMinutes: s.delayMinutes || 0,
          note: s.note || "",
        };
      });

      setStatuses(map);
    } catch (error) {
      console.error("Status loading error:", error);
    }
  };

  /* =====================================================
     SEARCH DOCTOR
  ===================================================== */

  const searchToAdd = async (e) => {
    e?.preventDefault();

    if (!searchText.trim()) {
      setResults([]);
      setSearchedOnce(true);
      return;
    }

    try {
      const res = await api.get("/centre/doctors/search", {
        params: {
          query: searchText.trim(),
        },
      });

      setResults(res.data?.doctors || []);
      setSearchedOnce(true);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Search failed"
      );
    }
  };

  /* =====================================================
     SEND REQUEST
  ===================================================== */

  const sendRequest = async (doctorId) => {
    try {
      await api.post("/centre/doctors/request", {
        doctorId,
      });

      setResults((prev) =>
        prev.map((d) =>
          d._id === doctorId
            ? {
                ...d,
                requested: true,
              }
            : d
        )
      );
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Unable to send request"
      );
    }
  };

  /* =====================================================
     UPDATE LOCAL STATUS
  ===================================================== */

  const updateLocalStatus = (
    doctorId,
    field,
    value
  ) => {
    setStatuses((prev) => ({
      ...prev,

      [doctorId]: {
        status: "available",
        delayMinutes: 0,
        note: "",
        ...prev[doctorId],
        [field]: value,
      },
    }));
  };

  /* =====================================================
     SAVE STATUS
  ===================================================== */

  const saveStatus = async (doctorId) => {
    const current = statuses[doctorId] || {
      status: "available",
      delayMinutes: 0,
      note: "",
    };

    setSavingId(doctorId);

    try {
      await api.patch("/centre/status", {
        doctorId,
        date: new Date()
          .toISOString()
          .split("T")[0],
        status: current.status,
        delayMinutes: current.delayMinutes,
        note: current.note,
      });

      await loadStatuses();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Unable to update status"
      );
    } finally {
      setSavingId("");
    }
  };

  /* =====================================================
     CLOSE MOBILE MENU
  ===================================================== */

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#f6f8fc]">
      {/* =================================================
          DESKTOP SIDEBAR
          >= 1024px
      ================================================= */}

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 lg:block">
        <CentreSidebar />
      </aside>

      {/* =================================================
          MOBILE HEADER
      ================================================= */}

      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white lg:hidden">
        <div className="flex h-16 items-center justify-between px-4">
          {/* MENU BUTTON */}

          <button
            type="button"
            onClick={() =>
              setMobileMenuOpen(true)
            }
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-95"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          {/* TITLE */}

          <div className="flex min-w-0 items-center gap-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Stethoscope size={19} />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-slate-900">
                Centre Doctors
              </p>

              <p className="text-[11px] text-slate-400">
                Manage doctors
              </p>
            </div>
          </div>

          {/* EMPTY SPACE FOR BALANCE */}

          <div className="w-10" />
        </div>
      </header>

      {/* =================================================
          MOBILE DRAWER OVERLAY
      ================================================= */}

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          {/* OVERLAY */}

          <button
            type="button"
            aria-label="Close menu"
            onClick={closeMobileMenu}
            className="absolute inset-0 h-full w-full cursor-default bg-slate-950/50 backdrop-blur-[2px]"
          />

          {/* DRAWER */}

          <div className="absolute inset-y-0 left-0 flex w-[280px] max-w-[85vw] flex-col bg-white shadow-2xl">
            {/* DRAWER HEADER */}

            <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 px-4">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Stethoscope size={19} />
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-900">
                    CareCube
                  </p>

                  <p className="text-[11px] text-slate-400">
                    Centre Panel
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeMobileMenu}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                aria-label="Close menu"
              >
                <X size={21} />
              </button>
            </div>

            {/* SIDEBAR */}

            <div
              className="min-h-0 flex-1 overflow-y-auto"
              onClick={(e) => {
                const target =
                  e.target.closest("a");

                if (target) {
                  closeMobileMenu();
                }
              }}
            >
              <CentreSidebar />
            </div>
          </div>
        </div>
      )}

      {/* =================================================
          MAIN CONTENT

          Desktop:
          ml-64

          Mobile:
          full width
      ================================================= */}

      <main className="min-w-0 lg:ml-64">
        {/* =================================================
            DESKTOP PAGE HEADER
        ================================================= */}

        <header className="hidden border-b border-slate-200 bg-white lg:block">
          <div className="mx-auto w-full max-w-7xl px-8 py-6">
            <div className="flex items-center justify-between gap-5">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Stethoscope size={22} />
                </div>

                <div className="min-w-0">
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                    Doctors
                  </h1>

                  <p className="mt-0.5 text-sm text-slate-500">
                    Manage doctors associated with your centre
                  </p>
                </div>
              </div>

              {user?.centreId && (
                <a
                  href={`/centre/${user.centreId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                  <ExternalLink size={16} />
                  View Public Page
                </a>
              )}
            </div>
          </div>
        </header>

        {/* =================================================
            MOBILE TOP AREA
        ================================================= */}

        <div className="border-b border-slate-200 bg-white px-4 py-5 sm:px-6 lg:hidden">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Doctors
              </h1>

              <p className="mt-1 text-xs text-slate-500">
                Manage doctors associated with your centre
              </p>
            </div>

            {user?.centreId && (
              <a
                href={`/centre/${user.centreId}`}
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm"
                aria-label="View public page"
              >
                <ExternalLink size={17} />
              </a>
            )}
          </div>
        </div>

        {/* =================================================
            PAGE CONTENT
        ================================================= */}

        <div className="mx-auto w-full max-w-7xl space-y-5 px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-8">
          {/* =================================================
              JOIN REQUESTS
          ================================================= */}

          {joinRequests.length > 0 && (
            <section className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
              {/* HEADER */}

              <div className="border-b border-slate-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
                    <UserPlus size={19} />
                  </div>

                  <div className="min-w-0">
                    <h2 className="font-bold text-slate-900">
                      Doctor Join Requests
                    </h2>

                    <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                      Doctors asking to join your centre
                    </p>
                  </div>

                  <span className="ml-auto shrink-0 rounded-full bg-blue-600 px-2.5 py-1 text-xs font-bold text-white">
                    {joinRequests.length}
                  </span>
                </div>
              </div>

              {/* REQUEST LIST */}

              <div className="divide-y divide-slate-100">
                {joinRequests.map((r) => (
                  <div
                    key={r._id}
                    className="p-4 sm:p-5"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 font-bold text-blue-600">
                          {r.doctorId?.name?.[0] ||
                            "D"}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate font-semibold text-slate-900">
                            Dr.{" "}
                            {r.doctorId?.name ||
                              "Doctor"}
                          </p>

                          <p className="truncate text-xs text-slate-500 sm:text-sm">
                            {r.doctorId?.specialization ||
                              "Specialization"}

                            {r.doctorId?.qualification
                              ? ` · ${r.doctorId.qualification}`
                              : ""}
                          </p>
                        </div>
                      </div>

                      {/* ACTIONS */}

                      <div className="flex w-full gap-2 sm:w-auto">
                        <button
                          type="button"
                          onClick={() =>
                            respondJoin(
                              r._id,
                              "accept"
                            )
                          }
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-emerald-700 sm:flex-none"
                        >
                          <CheckCircle2 size={15} />
                          Accept
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            respondJoin(
                              r._id,
                              "reject"
                            )
                          }
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-red-600 px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-red-700 sm:flex-none"
                        >
                          <XCircle size={15} />
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* =================================================
              ADD DOCTOR
          ================================================= */}

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            {/* TITLE */}

            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <UserPlus size={19} />
              </div>

              <div className="min-w-0">
                <h2 className="font-bold text-slate-900">
                  Add a doctor to your centre
                </h2>

                <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                  Search by doctor name or specialization
                  and send an associate request.
                </p>
              </div>
            </div>

            {/* SEARCH */}

            <form
              onSubmit={searchToAdd}
              className="mt-5 flex flex-col gap-2 sm:flex-row"
            >
              <div className="relative min-w-0 flex-1">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  placeholder="Search doctor name or specialization..."
                  value={searchText}
                  onChange={(e) =>
                    setSearchText(e.target.value)
                  }
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <button
                type="submit"
                className="flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98]"
              >
                <Search size={16} />
                Search
              </button>
            </form>

            {/* SEARCH RESULTS */}

            <div className="mt-4 space-y-2">
              {searchedOnce &&
                results.length === 0 && (
                  <div className="rounded-xl border border-dashed border-slate-200 p-5 text-center">
                    <Users
                      size={24}
                      className="mx-auto text-slate-300"
                    />

                    <p className="mt-2 text-sm text-slate-400">
                      No doctors found.
                    </p>
                  </div>
                )}

              {results.map((d) => (
                <div
                  key={d._id}
                  className="rounded-xl border border-slate-200 p-3 transition hover:border-blue-200 hover:bg-blue-50/30 sm:p-4"
                >
                  <div className="flex items-start gap-3">
                    {/* PHOTO */}

                    {d.photoUrl ? (
                      <img
                        src={d.photoUrl}
                        alt={d.name}
                        className="h-11 w-11 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600">
                        {d.name?.[0] || "D"}
                      </div>
                    )}

                    {/* INFO */}

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-slate-900">
                        Dr. {d.name}
                      </p>

                      <p className="mt-0.5 truncate text-xs text-slate-500">
                        {d.specialization}

                        {d.qualification
                          ? ` · ${d.qualification}`
                          : ""}
                      </p>
                    </div>

                    {/* DESKTOP ACTION */}

                    <div className="hidden shrink-0 sm:block">
                      {d.associated ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600">
                          <CheckCircle2 size={14} />
                          Associated
                        </span>
                      ) : d.theyRequested ? (
                        <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600">
                          Asked to join
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            sendRequest(d._id)
                          }
                          disabled={d.requested}
                          className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:bg-slate-300"
                        >
                          {d.requested
                            ? "Request sent"
                            : "Send request"}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* MOBILE ACTION */}

                  <div className="mt-3 sm:hidden">
                    {d.associated ? (
                      <div className="flex items-center justify-center gap-1.5 rounded-lg bg-emerald-50 py-2 text-xs font-semibold text-emerald-600">
                        <CheckCircle2 size={14} />
                        Associated
                      </div>
                    ) : d.theyRequested ? (
                      <div className="rounded-lg bg-blue-50 py-2 text-center text-xs font-semibold text-blue-600">
                        Asked to join — accept above
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          sendRequest(d._id)
                        }
                        disabled={d.requested}
                        className="w-full rounded-lg bg-blue-600 py-2.5 text-xs font-semibold text-white disabled:bg-slate-300"
                      >
                        {d.requested
                          ? "Request sent"
                          : "Send associate request"}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* =================================================
              STATUS INFO
          ================================================= */}

          <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
            <Clock3
              size={18}
              className="mt-0.5 shrink-0 text-blue-600"
            />

            <p className="text-xs leading-5 text-blue-700 sm:text-sm">
              Update each doctor's live availability so
              patients can see the latest status without
              calling the centre.
            </p>
          </div>

          {/* =================================================
              DOCTOR LIST
          ================================================= */}

          <section className="space-y-4">
            {doctors.map((doctor) => {
              const current =
                statuses[doctor._id] || {
                  status: "available",
                  delayMinutes: 0,
                  note: "",
                };

              return (
                <article
                  key={doctor._id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                >
                  {/* DOCTOR HEADER */}

                  <div className="p-4 sm:p-5">
                    <div className="flex items-start gap-3 sm:gap-4">
                      {/* AVATAR */}

                      {doctor.photoUrl ? (
                        <img
                          src={doctor.photoUrl}
                          alt={doctor.name}
                          className="h-12 w-12 shrink-0 rounded-full object-cover sm:h-14 sm:w-14"
                        />
                      ) : (
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-600 sm:h-14 sm:w-14">
                          {doctor.name?.[0] ||
                            "D"}
                        </div>
                      )}

                      {/* INFO */}

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <div className="min-w-0">
                            <h3 className="truncate text-base font-bold text-slate-900 sm:text-lg">
                              Dr. {doctor.name}
                            </h3>

                            <p className="mt-0.5 truncate text-sm font-medium text-blue-600">
                              {doctor.specialization}
                            </p>

                            <p className="mt-0.5 truncate text-xs text-slate-500">
                              {doctor.qualification}
                            </p>
                          </div>

                          {/* STATUS */}

                          <div className="shrink-0">
                            <StatusBadge
                              status={current.status}
                              delayMinutes={
                                current.delayMinutes
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* DIVIDER */}

                    <div className="my-4 h-px bg-slate-100" />

                    {/* CONTROLS */}

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[220px_140px_minmax(0,1fr)_auto]">
                      {/* STATUS */}

                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                          Availability
                        </label>

                        <select
                          value={current.status}
                          onChange={(e) =>
                            updateLocalStatus(
                              doctor._id,
                              "status",
                              e.target.value
                            )
                          }
                          className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >
                          {STATUS_OPTIONS.map(
                            (o) => (
                              <option
                                key={o.value}
                                value={o.value}
                              >
                                {o.label}
                              </option>
                            )
                          )}
                        </select>
                      </div>

                      {/* DELAY */}

                      {current.status ===
                      "delayed" ? (
                        <div>
                          <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                            Delay
                          </label>

                          <input
                            type="number"
                            min="0"
                            placeholder="Minutes"
                            value={
                              current.delayMinutes
                            }
                            onChange={(e) =>
                              updateLocalStatus(
                                doctor._id,
                                "delayMinutes",
                                Number(
                                  e.target.value
                                )
                              )
                            }
                            className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          />
                        </div>
                      ) : (
                        <div className="hidden lg:block" />
                      )}

                      {/* NOTE */}

                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                          Note
                        </label>

                        <input
                          type="text"
                          placeholder="Optional note..."
                          value={current.note}
                          onChange={(e) =>
                            updateLocalStatus(
                              doctor._id,
                              "note",
                              e.target.value
                            )
                          }
                          className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                      </div>

                      {/* SAVE */}

                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={() =>
                            saveStatus(
                              doctor._id
                            )
                          }
                          disabled={
                            savingId === doctor._id
                          }
                          className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 lg:w-auto"
                        >
                          {savingId ===
                          doctor._id ? (
                            <>
                              <RefreshCw
                                size={15}
                                className="animate-spin"
                              />
                              Saving...
                            </>
                          ) : (
                            "Update Status"
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}

            {/* EMPTY */}

            {doctors.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <Stethoscope size={25} />
                </div>

                <h3 className="mt-4 font-semibold text-slate-800">
                  No doctors associated yet
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Search for a doctor above and send an
                  associate request.
                </p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default CentreDoctors;