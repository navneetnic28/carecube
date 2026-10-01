import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import DoctorSidebar from "../../components/doctor/DoctorSidebar";

import {
  Activity,
  AlertCircle,
  ArrowUpRight,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Menu,
  MapPin,
  Plus,
  Send,
  Stethoscope,
  Timer,
  Trash2,
  Users,
  X,
  XCircle,
} from "lucide-react";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const DAY_SHORT = {
  Monday: "MON",
  Tuesday: "TUE",
  Wednesday: "WED",
  Thursday: "THU",
  Friday: "FRI",
  Saturday: "SAT",
  Sunday: "SUN",
};

function DoctorSchedule() {
  const [schedule, setSchedule] = useState([]);
  const [chambers, setChambers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [joinable, setJoinable] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [form, setForm] = useState({
    centreId: "",
    day: "Monday",
    startTime: "10:00",
    endTime: "13:00",
    slotDuration: 30,
  });

  useEffect(() => {
    loadAll();
  }, []);

  useEffect(() => {
    if (mobileSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileSidebarOpen]);

  const showMessage = (text, type = "info") => {
    setMessage(text);
    setMessageType(type);

    window.setTimeout(() => {
      setMessage("");
    }, 4000);
  };

  const loadAll = async () => {
    setLoading(true);

    try {
      await Promise.all([
        loadSchedule(),
        loadRequests(),
        loadChambers(),
        loadJoinable(),
      ]);
    } catch (error) {
      console.error("Schedule loading error:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadSchedule = async () => {
    try {
      const response = await api.get("/doctor/schedule");
      setSchedule(response.data.schedule || []);
    } catch (error) {
      console.error("Schedule error:", error);
    }
  };

  const loadRequests = async () => {
    try {
      const response = await api.get("/doctor/requests");
      setRequests(response.data.requests || []);
    } catch (error) {
      console.error("Requests error:", error);
    }
  };

  const loadChambers = async () => {
    try {
      const response = await api.get("/doctor/profile");

      const list = response.data?.doctor?.chambers || [];

      setChambers(list);

      if (list.length > 0) {
        setForm((prev) => ({
          ...prev,
          centreId: prev.centreId || list[0]._id,
        }));
      }
    } catch (error) {
      console.error("Chambers error:", error);
    }
  };

  const loadJoinable = async () => {
    try {
      const response = await api.get("/doctor/centres");

      setJoinable(response.data.centres || []);
    } catch (error) {
      console.error("Joinable centres error:", error);
    }
  };

  const requestJoin = async (centreId) => {
    setActionId(centreId);

    try {
      await api.post("/doctor/join-request", {
        centreId,
      });

      showMessage(
        "Centre join request sent successfully.",
        "success"
      );

      await loadJoinable();
    } catch (error) {
      showMessage(
        error.response?.data?.message ||
          "Could not send centre request.",
        "error"
      );
    } finally {
      setActionId("");
    }
  };

  const acceptRequest = async (id) => {
    setActionId(id);

    try {
      await api.patch(`/doctor/requests/${id}/accept`);

      showMessage(
        "Centre request accepted successfully.",
        "success"
      );

      await Promise.all([
        loadRequests(),
        loadChambers(),
        loadJoinable(),
      ]);
    } catch (error) {
      showMessage(
        error.response?.data?.message ||
          "Unable to accept request.",
        "error"
      );
    } finally {
      setActionId("");
    }
  };

  const rejectRequest = async (id) => {
    setActionId(id);

    try {
      await api.patch(`/doctor/requests/${id}/reject`);

      showMessage(
        "Centre request rejected.",
        "success"
      );

      await loadRequests();
    } catch (error) {
      showMessage(
        error.response?.data?.message ||
          "Unable to reject request.",
        "error"
      );
    } finally {
      setActionId("");
    }
  };

  const saveSchedule = async (e) => {
    e.preventDefault();

    if (!form.centreId) {
      showMessage(
        "Please select a chamber first.",
        "error"
      );
      return;
    }

    if (form.startTime >= form.endTime) {
      showMessage(
        "End time must be after start time.",
        "error"
      );
      return;
    }

    if (
      !form.slotDuration ||
      Number(form.slotDuration) < 5
    ) {
      showMessage(
        "Slot duration must be at least 5 minutes.",
        "error"
      );
      return;
    }

    setSaving(true);

    try {
      await api.post("/doctor/schedule", {
        ...form,
        slotDuration: Number(form.slotDuration),
      });

      showMessage(
        "Schedule added successfully.",
        "success"
      );

      await loadSchedule();
    } catch (error) {
      showMessage(
        error.response?.data?.message ||
          "Unable to save schedule.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteSlot = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this schedule?"
    );

    if (!confirmed) return;

    setActionId(id);

    try {
      await api.delete(`/doctor/schedule/${id}`);

      setSchedule((prev) =>
        prev.filter((item) => item._id !== id)
      );

      showMessage(
        "Schedule deleted successfully.",
        "success"
      );
    } catch (error) {
      showMessage(
        error.response?.data?.message ||
          "Unable to delete schedule.",
        "error"
      );
    } finally {
      setActionId("");
    }
  };

  const groupedSchedule = useMemo(() => {
    return DAYS.map((day) => ({
      day,
      slots: schedule
        .filter((item) => item.day === day)
        .sort((a, b) =>
          a.startTime.localeCompare(b.startTime)
        ),
    }));
  }, [schedule]);

  const totalSlots = useMemo(() => {
    return schedule.reduce((total, item) => {
      const [startHour, startMinute] = item.startTime
        .split(":")
        .map(Number);

      const [endHour, endMinute] = item.endTime
        .split(":")
        .map(Number);

      const start =
        startHour * 60 + startMinute;

      const end =
        endHour * 60 + endMinute;

      const duration = Math.max(0, end - start);

      const slotDuration = Number(
        item.slotDuration || 30
      );

      return (
        total +
        Math.floor(duration / slotDuration)
      );
    }, 0);
  }, [schedule]);

  const activeDays = useMemo(() => {
    return DAYS.filter((day) =>
      schedule.some((item) => item.day === day)
    ).length;
  }, [schedule]);

  if (loading) {
    return <ScheduleSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-900">
      <div className="flex min-h-screen">
        {/* =====================================================
            DESKTOP SIDEBAR
        ====================================================== */}

        <aside className="hidden shrink-0 lg:block">
          <DoctorSidebar />
        </aside>

        {/* =====================================================
            MOBILE OVERLAY
        ====================================================== */}

        {mobileSidebarOpen && (
          <div
            className="fixed inset-0 z-[90] bg-slate-950/50 backdrop-blur-sm lg:hidden"
            onClick={() =>
              setMobileSidebarOpen(false)
            }
          />
        )}

        {/* =====================================================
            MOBILE SIDEBAR
        ====================================================== */}

        <aside
          className={`fixed inset-y-0 left-0 z-[100] w-[290px] max-w-[88vw] transform bg-white shadow-2xl transition-transform duration-300 lg:hidden ${
            mobileSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }`}
        >
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white">
                  <Stethoscope size={19} />
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-900">
                    CareCube
                  </p>

                  <p className="text-[11px] text-slate-500">
                    Doctor Panel
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setMobileSidebarOpen(false)
                }
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600"
              >
                <X size={19} />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto">
              <DoctorSidebar />
            </div>
          </div>
        </aside>

        {/* =====================================================
            MAIN
        ====================================================== */}

        <main className="min-w-0 flex-1">
          {/* ===================================================
              TOP HEADER
          ==================================================== */}

          <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
            <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-3 px-3 py-3 sm:px-5 lg:px-8 lg:py-4">
              <div className="flex min-w-0 items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setMobileSidebarOpen(true)
                  }
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 lg:hidden"
                >
                  <Menu size={20} />
                </button>

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-200">
                  <CalendarDays size={21} />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h1 className="truncate text-lg font-bold tracking-tight text-slate-950 sm:text-xl lg:text-2xl">
                      My Schedule
                    </h1>

                    <span className="hidden rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 sm:inline-flex">
                      LIVE
                    </span>
                  </div>

                  <p className="hidden text-xs text-slate-500 sm:block lg:text-sm">
                    Manage consultation timings and
                    appointment availability
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <div className="flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-2 text-[11px] font-bold text-emerald-700 sm:text-xs">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />

                  <span>
                    {schedule.length} active
                  </span>
                </div>
              </div>
            </div>
          </header>

          {/* ===================================================
              CONTENT
          ==================================================== */}

          <div className="mx-auto max-w-[1500px] space-y-5 px-3 py-5 pb-12 sm:px-5 sm:py-6 lg:px-8">
            {/* =================================================
                HERO
            ================================================== */}

            <section className="relative overflow-hidden rounded-3xl bg-slate-950 p-5 text-white shadow-xl shadow-slate-200 sm:p-7 lg:p-8">
              <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />

              <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />

              <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl">
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-semibold text-slate-200">
                    <Activity size={14} />
                    Weekly availability
                  </div>

                  <h2 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                    Your clinic schedule,
                    <br className="hidden sm:block" />
                    <span className="text-blue-400">
                      {" "}under control.
                    </span>
                  </h2>

                  <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
                    Configure when patients can book
                    appointments across your associated
                    medical centres.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
                  <HeroStat
                    value={activeDays}
                    label="Active days"
                  />

                  <HeroStat
                    value={totalSlots}
                    label="Weekly slots"
                  />

                  <HeroStat
                    value={chambers.length}
                    label="Chambers"
                  />
                </div>
              </div>
            </section>

            {/* =================================================
                MESSAGE
            ================================================== */}

            {message && (
              <div
                className={`flex items-start gap-3 rounded-2xl border p-4 shadow-sm ${
                  messageType === "success"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : messageType === "error"
                    ? "border-red-200 bg-red-50 text-red-700"
                    : "border-blue-200 bg-blue-50 text-blue-700"
                }`}
              >
                {messageType === "success" ? (
                  <CheckCircle2
                    size={18}
                    className="mt-0.5 shrink-0"
                  />
                ) : (
                  <AlertCircle
                    size={18}
                    className="mt-0.5 shrink-0"
                  />
                )}

                <p className="min-w-0 flex-1 text-sm font-medium">
                  {message}
                </p>

                <button
                  type="button"
                  onClick={() => setMessage("")}
                  className="shrink-0 opacity-60 transition hover:opacity-100"
                >
                  <X size={17} />
                </button>
              </div>
            )}

            {/* =================================================
                STATS
            ================================================== */}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                icon={<CalendarDays size={20} />}
                title="Schedule Days"
                value={activeDays}
                description="Days configured"
              />

              <StatCard
                icon={<Clock3 size={20} />}
                title="Timings"
                value={schedule.length}
                description="Active schedules"
              />

              <StatCard
                icon={<Building2 size={20} />}
                title="Chambers"
                value={chambers.length}
                description="Associated centres"
              />

              <StatCard
                icon={<Timer size={20} />}
                title="Estimated Slots"
                value={totalSlots}
                description="Appointments / week"
              />
            </div>

            {/* =================================================
                PENDING REQUESTS
            ================================================== */}

            {requests.length > 0 && (
              <section className="overflow-hidden rounded-3xl border border-amber-200 bg-white shadow-sm">
                <div className="border-b border-amber-100 bg-gradient-to-r from-amber-50 to-white px-4 py-4 sm:px-6 sm:py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                      <Users size={20} />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-bold text-slate-950">
                          Pending Centre Requests
                        </h2>

                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                          {requests.length}
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                        Medical centres requesting to work
                        with your profile.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="divide-y divide-slate-100">
                  {requests.map((request) => (
                    <RequestCard
                      key={request._id}
                      request={request}
                      actionId={actionId}
                      onAccept={acceptRequest}
                      onReject={rejectRequest}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* =================================================
                MAIN GRID
            ================================================== */}

            <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_390px]">
              {/* =================================================
                  WEEKLY SCHEDULE
              ================================================== */}

              <section className="min-w-0 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col gap-4 border-b border-slate-100 px-4 py-5 sm:px-6 sm:py-6 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <CalendarDays size={18} />
                      </div>

                      <h2 className="text-lg font-bold text-slate-950">
                        Weekly Schedule
                      </h2>
                    </div>

                    <p className="mt-2 text-xs text-slate-500 sm:text-sm">
                      Your recurring consultation availability.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                      {schedule.length} timing
                      {schedule.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>

                <div className="p-3 sm:p-5 lg:p-6">
                  {schedule.length === 0 ? (
                    <EmptySchedule />
                  ) : (
                    <div className="space-y-3">
                      {groupedSchedule.map(
                        ({ day, slots }) => {
                          if (!slots.length) return null;

                          return (
                            <DaySchedule
                              key={day}
                              day={day}
                              slots={slots}
                              actionId={actionId}
                              onDelete={deleteSlot}
                            />
                          );
                        }
                      )}
                    </div>
                  )}
                </div>
              </section>

              {/* =================================================
                  RIGHT SIDE
              ================================================== */}

              <div className="min-w-0 space-y-5">
                {/* =================================================
                    ADD SCHEDULE
                ================================================== */}

                <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                  <div className="border-b border-slate-100 bg-gradient-to-br from-slate-950 to-slate-800 p-5 text-white sm:p-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                        <Plus size={20} />
                      </div>

                      <div>
                        <h2 className="font-bold">
                          Add Schedule
                        </h2>

                        <p className="mt-0.5 text-xs text-slate-400">
                          Create appointment availability
                        </p>
                      </div>
                    </div>
                  </div>

                  <form
                    onSubmit={saveSchedule}
                    className="space-y-5 p-4 sm:p-6"
                  >
                    {/* Chamber */}

                    <FormField label="Chamber / Centre">
                      {chambers.length > 0 ? (
                        <div className="relative">
                          <Building2
                            size={17}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                          />

                          <select
                            value={form.centreId}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                centreId:
                                  e.target.value,
                              })
                            }
                            className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-10 pr-10 text-sm font-medium text-slate-700 outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-100"
                            required
                          >
                            {chambers.map((centre) => (
                              <option
                                key={centre._id}
                                value={centre._id}
                              >
                                {centre.name}
                                {centre.city
                                  ? ` — ${centre.city}`
                                  : ""}
                              </option>
                            ))}
                          </select>

                          <ChevronDown
                            size={17}
                            className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                          />
                        </div>
                      ) : (
                        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                          <div className="flex gap-3">
                            <AlertCircle
                              size={18}
                              className="mt-0.5 shrink-0 text-amber-600"
                            />

                            <p className="text-xs leading-5 text-amber-700">
                              You are not associated with
                              any centre yet. Accept a centre
                              request or join a centre first.
                            </p>
                          </div>
                        </div>
                      )}
                    </FormField>

                    {/* Day */}

                    <FormField label="Consultation Day">
                      <div className="relative">
                        <CalendarDays
                          size={17}
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <select
                          value={form.day}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              day: e.target.value,
                            })
                          }
                          className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-10 pr-10 text-sm font-medium text-slate-700 outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-100"
                        >
                          {DAYS.map((day) => (
                            <option
                              key={day}
                              value={day}
                            >
                              {day}
                            </option>
                          ))}
                        </select>

                        <ChevronDown
                          size={17}
                          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                      </div>
                    </FormField>

                    {/* Time */}

                    <FormField label="Consultation Hours">
                      <div className="grid grid-cols-2 gap-3">
                        <TimeInput
                          label="Start"
                          value={form.startTime}
                          onChange={(value) =>
                            setForm({
                              ...form,
                              startTime: value,
                            })
                          }
                        />

                        <TimeInput
                          label="End"
                          value={form.endTime}
                          onChange={(value) =>
                            setForm({
                              ...form,
                              endTime: value,
                            })
                          }
                        />
                      </div>
                    </FormField>

                    {/* Duration */}

                    <FormField label="Appointment Duration">
                      <div className="relative">
                        <Timer
                          size={17}
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                          type="number"
                          min="5"
                          step="5"
                          value={form.slotDuration}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              slotDuration:
                                Number(
                                  e.target.value
                                ),
                            })
                          }
                          className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-16 text-sm font-medium text-slate-700 outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-100"
                        />

                        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                          min
                        </span>
                      </div>

                      <p className="mt-2 text-[11px] leading-5 text-slate-400">
                        Example: 30 minutes creates one
                        appointment slot every 30 minutes.
                      </p>
                    </FormField>

                    {/* Submit */}

                    <button
                      type="submit"
                      disabled={
                        chambers.length === 0 ||
                        saving
                      }
                      className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 text-sm font-bold text-white shadow-lg shadow-slate-200 transition hover:bg-slate-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {saving ? (
                        <>
                          <Spinner />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Plus size={18} />
                          Save Schedule
                        </>
                      )}
                    </button>
                  </form>
                </section>

                {/* =================================================
                    JOIN CENTRE
                ================================================== */}

                <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                  <div className="border-b border-slate-100 p-5 sm:p-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                        <Building2 size={20} />
                      </div>

                      <div>
                        <h2 className="font-bold text-slate-950">
                          Join a Centre
                        </h2>

                        <p className="mt-0.5 text-xs text-slate-500">
                          Discover available chambers
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 sm:p-6">
                    <p className="mb-4 text-xs leading-5 text-slate-500 sm:text-sm">
                      Send a request to a medical centre.
                      Once accepted, you can create
                      schedules there.
                    </p>

                    {joinable.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-7 text-center">
                        <Building2
                          size={26}
                          className="mx-auto text-slate-300"
                        />

                        <p className="mt-3 text-sm font-semibold text-slate-600">
                          No centres available
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          Check again later for new centres.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {joinable.map((centre) => (
                          <CentreCard
                            key={centre._id}
                            centre={centre}
                            actionId={actionId}
                            onRequest={requestJoin}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

/* =============================================================
   HERO STAT
============================================================= */

function HeroStat({ value, label }) {
  return (
    <div className="min-w-[105px] rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
      <p className="text-2xl font-bold text-white">
        {value}
      </p>

      <p className="mt-0.5 text-[10px] font-medium text-slate-400 sm:text-xs">
        {label}
      </p>
    </div>
  );
}

/* =============================================================
   STAT CARD
============================================================= */

function StatCard({
  icon,
  title,
  value,
  description,
}) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-lg sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            {value}
          </p>

          <p className="mt-1 text-[11px] text-slate-400">
            {description}
          </p>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition group-hover:bg-slate-950 group-hover:text-white">
          {icon}
        </div>
      </div>
    </div>
  );
}

/* =============================================================
   DAY SCHEDULE
============================================================= */

function DaySchedule({
  day,
  slots,
  actionId,
  onDelete,
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/70">
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-3 py-3 sm:px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-[10px] font-bold tracking-wide text-white">
            {DAY_SHORT[day]}
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900 sm:text-base">
              {day}
            </h3>

            <p className="text-[10px] text-slate-400 sm:text-xs">
              {slots.length} consultation
              {slots.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <span className="hidden rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 sm:inline-flex">
          ACTIVE
        </span>
      </div>

      <div className="space-y-2 p-2 sm:p-3">
        {slots.map((slot) => (
          <div
            key={slot._id}
            className="group rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition hover:border-slate-300 hover:shadow-md sm:p-4"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      <Clock3 size={17} />
                    </div>

                    <span className="text-sm font-bold text-slate-950 sm:text-base">
                      {formatTime(slot.startTime)}{" "}
                      <span className="font-normal text-slate-400">
                        –
                      </span>{" "}
                      {formatTime(slot.endTime)}
                    </span>
                  </div>

                  <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-700">
                    {slot.slotDuration} min
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Building2 size={14} />
                    {slot.centreId?.name ||
                      "Medical Centre"}
                  </span>

                  <span className="flex items-center gap-1.5">
                    <Timer size={14} />
                    {calculateSlots(
                      slot.startTime,
                      slot.endTime,
                      slot.slotDuration
                    )}{" "}
                    slots
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  onDelete(slot._id)
                }
                disabled={actionId === slot._id}
                className="flex h-10 w-full shrink-0 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 text-xs font-bold text-red-600 transition hover:border-red-300 hover:bg-red-100 disabled:opacity-50 md:w-auto"
              >
                {actionId === slot._id ? (
                  <Spinner />
                ) : (
                  <Trash2 size={15} />
                )}

                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =============================================================
   REQUEST CARD
============================================================= */

function RequestCard({
  request,
  actionId,
  onAccept,
  onReject,
}) {
  return (
    <div className="flex flex-col gap-4 p-4 sm:p-5 md:flex-row md:items-center md:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Building2 size={20} />
        </div>

        <div className="min-w-0">
          <p className="font-bold text-slate-900">
            {request.centreId?.name ||
              "Medical Centre"}
          </p>

          {request.centreId?.address && (
            <div className="mt-1 flex items-start gap-1.5 text-xs leading-5 text-slate-500">
              <MapPin
                size={14}
                className="mt-0.5 shrink-0"
              />

              <span className="break-words">
                {request.centreId.address}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="grid w-full grid-cols-2 gap-2 md:w-auto">
        <button
          type="button"
          onClick={() =>
            onAccept(request._id)
          }
          disabled={actionId === request._id}
          className="flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-xs font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50 sm:text-sm"
        >
          {actionId === request._id ? (
            <Spinner />
          ) : (
            <Check size={16} />
          )}

          Accept
        </button>

        <button
          type="button"
          onClick={() =>
            onReject(request._id)
          }
          disabled={actionId === request._id}
          className="flex h-11 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 text-xs font-bold text-red-600 transition hover:bg-red-100 disabled:opacity-50 sm:text-sm"
        >
          <XCircle size={16} />
          Reject
        </button>
      </div>
    </div>
  );
}

/* =============================================================
   CENTRE CARD
============================================================= */

function CentreCard({
  centre,
  actionId,
  onRequest,
}) {
  return (
    <div className="group rounded-2xl border border-slate-200 p-4 transition hover:border-slate-300 hover:bg-slate-50">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition group-hover:bg-slate-950 group-hover:text-white">
          <Building2 size={18} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="break-words text-sm font-bold text-slate-900">
            {centre.name}
          </p>

          {(centre.address || centre.city) && (
            <div className="mt-1 flex items-start gap-1.5 text-[11px] leading-5 text-slate-500">
              <MapPin
                size={13}
                className="mt-0.5 shrink-0"
              />

              <span className="break-words">
                {centre.address || ""}
                {centre.city
                  ? `${centre.address ? ", " : ""}${centre.city}`
                  : ""}
              </span>
            </div>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={() =>
          onRequest(centre._id)
        }
        disabled={
          centre.requested ||
          actionId === centre._id
        }
        className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 text-xs font-bold text-white transition hover:bg-slate-800 disabled:bg-slate-100 disabled:text-slate-400"
      >
        {centre.requested ? (
          <>
            <CheckCircle2 size={15} />
            Request Sent
          </>
        ) : actionId === centre._id ? (
          <>
            <Spinner />
            Sending...
          </>
        ) : (
          <>
            <Send size={15} />
            Request to Join
            <ArrowUpRight size={14} />
          </>
        )}
      </button>
    </div>
  );
}

/* =============================================================
   FORM FIELD
============================================================= */

function FormField({ label, children }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold text-slate-700">
        {label}
      </label>

      {children}
    </div>
  );
}

/* =============================================================
   TIME INPUT
============================================================= */

function TimeInput({
  label,
  value,
  onChange,
}) {
  return (
    <div className="relative">
      <label className="absolute left-3 top-1.5 z-10 text-[9px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </label>

      <input
        type="time"
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="h-14 w-full rounded-xl border border-slate-200 bg-white px-3 pt-4 text-sm font-bold text-slate-700 outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-100"
      />
    </div>
  );
}

/* =============================================================
   EMPTY SCHEDULE
============================================================= */

function EmptySchedule() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center sm:p-12">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm">
        <CalendarDays size={28} />
      </div>

      <h3 className="mt-5 text-base font-bold text-slate-900">
        No schedule configured
      </h3>

      <p className="mx-auto mt-2 max-w-md text-xs leading-6 text-slate-500 sm:text-sm">
        Add your consultation timings from the form
        on the right. Patients will be able to use
        these timings for appointment availability.
      </p>
    </div>
  );
}

/* =============================================================
   SKELETON
============================================================= */

function ScheduleSkeleton() {
  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <div className="flex min-h-screen">
        <aside className="hidden w-[250px] shrink-0 bg-white lg:block">
          <div className="animate-pulse space-y-5 p-6">
            <div className="h-10 w-32 rounded-xl bg-slate-200" />

            <div className="h-10 rounded-xl bg-slate-100" />
            <div className="h-10 rounded-xl bg-slate-100" />
            <div className="h-10 rounded-xl bg-slate-100" />
            <div className="h-10 rounded-xl bg-slate-100" />
          </div>
        </aside>

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-[1500px] animate-pulse space-y-5">
            <div className="h-16 rounded-2xl bg-white" />

            <div className="h-52 rounded-3xl bg-slate-200" />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="h-28 rounded-2xl bg-white" />
              <div className="h-28 rounded-2xl bg-white" />
              <div className="h-28 rounded-2xl bg-white" />
              <div className="h-28 rounded-2xl bg-white" />
            </div>

            <div className="grid gap-5 xl:grid-cols-[1fr_390px]">
              <div className="h-[600px] rounded-3xl bg-white" />
              <div className="h-[600px] rounded-3xl bg-white" />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

/* =============================================================
   HELPERS
============================================================= */

function calculateSlots(
  startTime,
  endTime,
  duration
) {
  if (!startTime || !endTime) return 0;

  const [startHour, startMinute] =
    startTime.split(":").map(Number);

  const [endHour, endMinute] =
    endTime.split(":").map(Number);

  const start =
    startHour * 60 + startMinute;

  const end =
    endHour * 60 + endMinute;

  const difference = end - start;

  if (difference <= 0) return 0;

  return Math.floor(
    difference / Number(duration || 30)
  );
}

function formatTime(time) {
  if (!time) return "";

  const [hour, minute] =
    time.split(":").map(Number);

  const date = new Date();

  date.setHours(hour);
  date.setMinutes(minute);

  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function Spinner() {
  return (
    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
  );
}

export default DoctorSchedule;