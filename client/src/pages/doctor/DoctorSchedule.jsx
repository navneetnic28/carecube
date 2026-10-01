import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import DoctorSidebar from "../../components/doctor/DoctorSidebar";
import {
  CalendarDays,
  Clock3,
  Building2,
  MapPin,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  Send,
  Users,
  Timer,
  AlertCircle,
  ChevronDown,
  Stethoscope,
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

function DoctorSchedule() {
  const [schedule, setSchedule] = useState([]);
  const [chambers, setChambers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [joinable, setJoinable] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState("");
  const [message, setMessage] = useState("");

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
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadJoinable = async () => {
    try {
      const res = await api.get("/doctor/centres");
      setJoinable(res.data.centres || []);
    } catch (error) {
      console.error(error);
    }
  };

  const loadRequests = async () => {
    try {
      const response = await api.get("/doctor/requests");
      setRequests(response.data.requests || []);
    } catch (error) {
      console.error(error);
    }
  };

  const loadChambers = async () => {
    try {
      const response = await api.get("/doctor/profile");
      const list = response.data.doctor.chambers || [];

      setChambers(list);

      if (list.length > 0) {
        setForm((prev) =>
          prev.centreId
            ? prev
            : {
                ...prev,
                centreId: list[0]._id,
              }
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const loadSchedule = async () => {
    try {
      const response = await api.get("/doctor/schedule");
      setSchedule(response.data.schedule || []);
    } catch (error) {
      console.error(error);
    }
  };

  const requestJoin = async (centreId) => {
    setActionId(centreId);
    setMessage("");

    try {
      await api.post("/doctor/join-request", { centreId });

      setMessage("Join request sent successfully.");
      await loadJoinable();
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Could not send request"
      );
    } finally {
      setActionId("");
    }
  };

  const acceptRequest = async (id) => {
    setActionId(id);
    setMessage("");

    try {
      await api.patch(`/doctor/requests/${id}/accept`);

      setMessage("Centre request accepted.");
      await loadRequests();
      await loadChambers();
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Unable to accept request"
      );
    } finally {
      setActionId("");
    }
  };

  const rejectRequest = async (id) => {
    setActionId(id);
    setMessage("");

    try {
      await api.patch(`/doctor/requests/${id}/reject`);

      setMessage("Centre request rejected.");
      await loadRequests();
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Unable to reject request"
      );
    } finally {
      setActionId("");
    }
  };

  const saveSchedule = async (e) => {
    e.preventDefault();

    if (!form.centreId) {
      setMessage("Please select a chamber first.");
      return;
    }

    if (form.startTime >= form.endTime) {
      setMessage("End time must be after start time.");
      return;
    }

    if (!form.slotDuration || form.slotDuration < 5) {
      setMessage("Slot duration must be at least 5 minutes.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      await api.post("/doctor/schedule", {
        ...form,
        slotDuration: Number(form.slotDuration),
      });

      setMessage("Schedule added successfully.");
      await loadSchedule();
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Unable to save schedule"
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteSlot = async (id) => {
    if (!window.confirm("Delete this schedule slot?")) return;

    setActionId(id);

    try {
      await api.delete(`/doctor/schedule/${id}`);

      setSchedule((prev) => prev.filter((s) => s._id !== id));
      setMessage("Schedule deleted.");
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Unable to delete schedule slot"
      );
    } finally {
      setActionId("");
    }
  };

  const groupedSchedule = useMemo(() => {
    return DAYS.map((day) => ({
      day,
      slots: schedule.filter((item) => item.day === day),
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

      const minutes =
        endHour * 60 +
        endMinute -
        (startHour * 60 + startMinute);

      return total + Math.max(0, Math.floor(minutes / item.slotDuration));
    }, 0);
  }, [schedule]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#f6f8fc]">
        <DoctorSidebar />

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          <div className="animate-pulse space-y-6">
            <div className="h-10 w-64 rounded-lg bg-slate-200" />
            <div className="h-4 w-96 rounded bg-slate-200" />

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="h-28 rounded-2xl bg-white" />
              <div className="h-28 rounded-2xl bg-white" />
              <div className="h-28 rounded-2xl bg-white" />
            </div>

            <div className="h-80 rounded-2xl bg-white" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f8fc]">
      <div className="flex min-h-screen">
        <DoctorSidebar />

        <main className="min-w-0 flex-1">
          {/* Header */}
          <header className="border-b border-slate-200 bg-white">
            <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <CalendarDays size={22} />
                  </div>

                  <div>
                    <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
                      My Schedule
                    </h1>

                    <p className="mt-0.5 text-sm text-slate-500">
                      Manage your clinic timings and appointment slots
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
                  <CheckCircle2 size={15} />
                  {schedule.length} active schedule
                  {schedule.length !== 1 ? "s" : ""}
                </div>
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-7xl space-y-6 px-4 py-5 pb-10 sm:px-6 sm:py-7 lg:px-8">
            {/* Message */}
            {message && (
              <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-700">
                <AlertCircle
                  size={18}
                  className="mt-0.5 shrink-0"
                />

                <span>{message}</span>

                <button
                  onClick={() => setMessage("")}
                  className="ml-auto text-blue-400 hover:text-blue-700"
                >
                  ×
                </button>
              </div>
            )}

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <StatCard
                icon={<CalendarDays size={21} />}
                title="Schedule Days"
                value={schedule.length}
                description="Configured timings"
              />

              <StatCard
                icon={<Building2 size={21} />}
                title="Chambers"
                value={chambers.length}
                description="Associated centres"
              />

              <StatCard
                icon={<Timer size={21} />}
                title="Estimated Slots"
                value={totalSlots}
                description="Appointments per week"
              />
            </div>

            {/* Pending requests */}
            {requests.length > 0 && (
              <section className="overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-sm">
                <div className="border-b border-amber-100 bg-amber-50/70 p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                      <Users size={19} />
                    </div>

                    <div>
                      <h2 className="font-bold text-slate-900">
                        Pending Centre Requests
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        Centres that want to associate with your
                        doctor profile.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="divide-y divide-slate-100">
                  {requests.map((r) => (
                    <div
                      key={r._id}
                      className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between"
                    >
                      <div className="flex min-w-0 items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                          <Building2 size={20} />
                        </div>

                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900">
                            {r.centreId?.name || "Medical Centre"}
                          </p>

                          {r.centreId?.address && (
                            <div className="mt-1 flex items-start gap-1.5 text-xs text-slate-500">
                              <MapPin
                                size={14}
                                className="mt-0.5 shrink-0"
                              />
                              <span>{r.centreId.address}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex w-full gap-2 md:w-auto">
                        <button
                          onClick={() => acceptRequest(r._id)}
                          disabled={actionId === r._id}
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50 md:flex-none"
                        >
                          <CheckCircle2 size={16} />
                          Accept
                        </button>

                        <button
                          onClick={() => rejectRequest(r._id)}
                          disabled={actionId === r._id}
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50 md:flex-none"
                        >
                          <XCircle size={16} />
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_390px]">
              {/* Schedule */}
              <section className="min-w-0 rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <CalendarDays
                        size={19}
                        className="text-blue-600"
                      />

                      <h2 className="text-lg font-bold text-slate-900">
                        Weekly Schedule
                      </h2>
                    </div>

                    <p className="mt-1 text-sm text-slate-500">
                      Your recurring availability for patients.
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                    {schedule.length} timing
                    {schedule.length !== 1 ? "s" : ""}
                  </div>
                </div>

                <div className="p-4 sm:p-6">
                  {schedule.length === 0 ? (
                    <EmptySchedule />
                  ) : (
                    <div className="space-y-3">
                      {groupedSchedule.map(({ day, slots }) => {
                        if (!slots.length) return null;

                        return (
                          <div
                            key={day}
                            className="rounded-xl border border-slate-100 bg-slate-50/70 p-4"
                          >
                            <div className="mb-3 flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-blue-600" />

                              <h3 className="font-bold text-slate-800">
                                {day}
                              </h3>
                            </div>

                            <div className="space-y-2">
                              {slots.map((s) => (
                                <div
                                  key={s._id}
                                  className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                                >
                                  <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                      <div className="flex items-center gap-2 font-bold text-slate-900">
                                        <Clock3
                                          size={17}
                                          className="text-blue-600"
                                        />

                                        <span>
                                          {s.startTime} – {s.endTime}
                                        </span>
                                      </div>

                                      <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                                        {s.slotDuration} min slots
                                      </span>
                                    </div>

                                    <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                                      <Building2 size={15} />

                                      <span>
                                        {s.centreId?.name ||
                                          "Medical Centre"}
                                      </span>
                                    </div>
                                  </div>

                                  <button
                                    onClick={() =>
                                      deleteSlot(s._id)
                                    }
                                    disabled={actionId === s._id}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50 sm:w-auto"
                                  >
                                    <Trash2 size={16} />
                                    Delete
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </section>

              {/* Right column */}
              <div className="space-y-6">
                {/* Add schedule */}
                <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="border-b border-slate-100 p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-200">
                        <Plus size={20} />
                      </div>

                      <div>
                        <h2 className="font-bold text-slate-900">
                          Add Schedule
                        </h2>

                        <p className="text-xs text-slate-500">
                          Create a new appointment timing
                        </p>
                      </div>
                    </div>
                  </div>

                  <form
                    onSubmit={saveSchedule}
                    className="space-y-5 p-5"
                  >
                    {/* Chamber */}
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Chamber / Centre
                      </label>

                      {chambers.length > 0 ? (
                        <div className="relative">
                          <Building2
                            size={17}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                          />

                          <select
                            value={form.centreId}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                centreId: e.target.value,
                              })
                            }
                            className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-10 pr-10 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                            required
                          >
                            {chambers.map((c) => (
                              <option key={c._id} value={c._id}>
                                {c.name}
                                {c.city ? ` — ${c.city}` : ""}
                              </option>
                            ))}
                          </select>

                          <ChevronDown
                            size={17}
                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                          />
                        </div>
                      ) : (
                        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                          <div className="flex gap-3">
                            <AlertCircle
                              size={18}
                              className="mt-0.5 shrink-0 text-amber-600"
                            />

                            <p className="text-sm leading-5 text-amber-700">
                              You're not associated with any centre
                              yet. Accept a centre request first.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Day */}
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Day
                      </label>

                      <div className="relative">
                        <CalendarDays
                          size={17}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <select
                          value={form.day}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              day: e.target.value,
                            })
                          }
                          className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-10 pr-10 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                        >
                          {DAYS.map((day) => (
                            <option key={day} value={day}>
                              {day}
                            </option>
                          ))}
                        </select>

                        <ChevronDown
                          size={17}
                          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                      </div>
                    </div>

                    {/* Time */}
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Consultation hours
                      </label>

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
                    </div>

                    {/* Slot duration */}
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Appointment duration
                      </label>

                      <div className="relative">
                        <Timer
                          size={17}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                          type="number"
                          min="5"
                          step="5"
                          value={form.slotDuration}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              slotDuration: Number(
                                e.target.value
                              ),
                            })
                          }
                          className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-16 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                        />

                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
                          minutes
                        </span>
                      </div>

                      <p className="mt-1.5 text-xs text-slate-400">
                        Example: 30 minutes = one appointment every
                        30 minutes.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={
                        chambers.length === 0 ||
                        saving
                      }
                      className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Plus size={18} />

                      {saving
                        ? "Saving schedule..."
                        : "Save Schedule"}
                    </button>
                  </form>
                </section>

                {/* Join Centre */}
                <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="border-b border-slate-100 p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                        <Building2 size={19} />
                      </div>

                      <div>
                        <h2 className="font-bold text-slate-900">
                          Join a Centre
                        </h2>

                        <p className="text-xs text-slate-500">
                          Find available chambers
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5">
                    <p className="mb-4 text-sm leading-5 text-slate-500">
                      Send a request to a medical centre. Once
                      accepted, you can create schedules there.
                    </p>

                    {joinable.length === 0 ? (
                      <div className="rounded-xl bg-slate-50 p-4 text-center">
                        <Building2
                          size={25}
                          className="mx-auto text-slate-300"
                        />

                        <p className="mt-2 text-sm text-slate-500">
                          No other centres available.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {joinable.map((c) => (
                          <div
                            key={c._id}
                            className="rounded-xl border border-slate-200 p-4 transition hover:border-blue-200 hover:bg-blue-50/30"
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                                <Building2 size={18} />
                              </div>

                              <div className="min-w-0 flex-1">
                                <p className="font-semibold text-slate-900">
                                  {c.name}
                                </p>

                                <div className="mt-1 flex gap-1.5 text-xs text-slate-500">
                                  <MapPin
                                    size={13}
                                    className="mt-0.5 shrink-0"
                                  />

                                  <span>
                                    {c.address}
                                    {c.city
                                      ? `, ${c.city}`
                                      : ""}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={() => requestJoin(c._id)}
                              disabled={
                                c.requested ||
                                actionId === c._id
                              }
                              className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-500"
                            >
                              {c.requested ? (
                                <>
                                  <CheckCircle2 size={16} />
                                  Requested
                                </>
                              ) : (
                                <>
                                  <Send size={16} />
                                  Request to join
                                </>
                              )}
                            </button>
                          </div>
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

/* ---------------------------------------------
   Components
--------------------------------------------- */

function StatCard({ icon, title, value, description }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-900">
            {value}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {description}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          {icon}
        </div>
      </div>
    </div>
  );
}

function TimeInput({ label, value, onChange }) {
  return (
    <div className="relative">
      <label className="absolute left-3 top-1.5 z-10 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </label>

      <input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-14 w-full rounded-xl border border-slate-200 bg-white px-3 pt-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
      />
    </div>
  );
}

function EmptySchedule() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
        <CalendarDays size={26} />
      </div>

      <h3 className="mt-4 font-bold text-slate-900">
        No schedule yet
      </h3>

      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
        Add your consultation timings using the schedule form.
        You need to be associated with a centre first.
      </p>
    </div>
  );
}

export default DoctorSchedule;