import { useEffect, useState } from "react";
import api from "../../services/api";
import DoctorSidebar from "../../components/doctor/DoctorSidebar";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function DoctorSchedule() {
  const [schedule, setSchedule] = useState([]);
  const [chambers, setChambers] = useState([]); // associated centres, from profile
  const [requests, setRequests] = useState([]);
  const [joinable, setJoinable] = useState([]);
  const [form, setForm] = useState({
    centreId: "",
    day: "Monday",
    startTime: "10:00",
    endTime: "13:00",
    slotDuration: 30,
  });

  useEffect(() => {
    loadSchedule();
    loadRequests();
    loadChambers();
    loadJoinable();
  }, []);

  const loadJoinable = async () => {
    try {
      const res = await api.get("/doctor/centres");
      setJoinable(res.data.centres);
    } catch (e) {
      console.error(e);
    }
  };

  const requestJoin = async (centreId) => {
    try {
      await api.post("/doctor/join-request", { centreId });
      loadJoinable();
    } catch (error) {
      alert(error.response?.data?.message || "Could not send request");
    }
  };

  const loadRequests = async () => {
    const response = await api.get("/doctor/requests");
    setRequests(response.data.requests);
  };

  const acceptRequest = async (id) => {
    await api.patch(`/doctor/requests/${id}/accept`);
    loadRequests();
    loadChambers();
  };

  const rejectRequest = async (id) => {
    await api.patch(`/doctor/requests/${id}/reject`);
    loadRequests();
  };

  const loadChambers = async () => {
    try {
      const response = await api.get("/doctor/profile");
      const list = response.data.doctor.chambers || [];
      setChambers(list);
      if (list.length > 0) {
        setForm((prev) => (prev.centreId ? prev : { ...prev, centreId: list[0]._id }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const loadSchedule = async () => {
    const response = await api.get("/doctor/schedule");
    setSchedule(response.data.schedule);
  };

  const saveSchedule = async (e) => {
    e.preventDefault();

    if (!form.centreId) {
      alert("Select a chamber first — accept a centre's request if you don't have one yet.");
      return;
    }

    if (form.startTime >= form.endTime) {
      alert("End time must be after start time");
      return;
    }

    try {
      await api.post("/doctor/schedule", form);
      await loadSchedule();
    } catch (error) {
      alert(error.response?.data?.message || "Unable to save schedule");
    }
  };

  const deleteSlot = async (id) => {
    if (!confirm("Delete this schedule slot?")) return;
    try {
      await api.delete(`/doctor/schedule/${id}`);
      setSchedule((prev) => prev.filter((s) => s._id !== id));
    } catch (error) {
      alert(error.response?.data?.message || "Unable to delete schedule slot");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DoctorSidebar />

      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold">My Schedule</h1>

        {requests.length > 0 && (
          <div className="mt-6 max-w-md space-y-3">
            <h2 className="font-bold">Pending Centre Requests</h2>
            {requests.map((r) => (
              <div key={r._id} className="flex items-center justify-between rounded-xl bg-white p-4 shadow">
                <div>
                  <p className="font-medium">{r.centreId?.name}</p>
                  <p className="text-sm text-gray-500">{r.centreId?.address}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => acceptRequest(r._id)}
                    className="rounded-lg bg-green-600 px-3 py-2 text-sm text-white"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => rejectRequest(r._id)}
                    className="rounded-lg bg-red-600 px-3 py-2 text-sm text-white"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 max-w-md rounded-xl bg-white p-5 shadow">
          <h2 className="font-bold">Join a centre / chamber</h2>
          <p className="text-sm text-gray-500">
            Send a request — once the centre accepts, you'll be associated and patients can book you there.
          </p>
          <div className="mt-3 space-y-2">
            {joinable.length === 0 && <p className="text-sm text-gray-400">No other centres available.</p>}
            {joinable.map((c) => (
              <div key={c._id} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-medium">{c.name}</p>
                  <p className="text-xs text-gray-500">{c.address}{c.city ? `, ${c.city}` : ""}</p>
                </div>
                <button
                  onClick={() => requestJoin(c._id)}
                  disabled={c.requested}
                  className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white disabled:bg-gray-300"
                >
                  {c.requested ? "Requested" : "Request to join"}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {schedule.map((s) => (
            <div key={s._id} className="flex items-center justify-between rounded-xl bg-white p-4 shadow">
              <div>
                <p className="font-bold">{s.day}</p>
                <p className="text-gray-500">{s.centreId?.name}</p>
                <p>
                  {s.startTime} - {s.endTime} ({s.slotDuration} min slots)
                </p>
              </div>
              <button
                onClick={() => deleteSlot(s._id)}
                className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 hover:bg-red-100"
              >
                Delete
              </button>
            </div>
          ))}
          {schedule.length === 0 && (
            <p className="text-gray-500">
              No schedule yet. Note: you need to be associated with a centre first (accept a
              centre's request) before adding a schedule.
            </p>
          )}
        </div>

        <form onSubmit={saveSchedule} className="mt-8 max-w-md space-y-3 rounded-xl bg-white p-5 shadow">
          <h2 className="font-bold">Add Schedule</h2>

          {chambers.length > 0 ? (
            <select
              value={form.centreId}
              onChange={(e) => setForm({ ...form, centreId: e.target.value })}
              className="w-full rounded-lg border p-3"
              required
            >
              {chambers.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                  {c.city ? ` — ${c.city}` : ""}
                </option>
              ))}
            </select>
          ) : (
            <p className="rounded-lg bg-yellow-50 p-3 text-sm text-yellow-700">
              You're not associated with any centre yet. Accept a centre's request above first.
            </p>
          )}

          <select
            value={form.day}
            onChange={(e) => setForm({ ...form, day: e.target.value })}
            className="w-full rounded-lg border p-3"
          >
            {DAYS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          <div className="flex gap-3">
            <input
              type="time"
              value={form.startTime}
              onChange={(e) => setForm({ ...form, startTime: e.target.value })}
              className="w-full rounded-lg border p-3"
            />
            <input
              type="time"
              value={form.endTime}
              onChange={(e) => setForm({ ...form, endTime: e.target.value })}
              className="w-full rounded-lg border p-3"
            />
          </div>

          <input
            type="number"
            min="5"
            placeholder="Slot duration (minutes)"
            value={form.slotDuration}
            onChange={(e) => setForm({ ...form, slotDuration: Number(e.target.value) })}
            className="w-full rounded-lg border p-3"
          />

          <button
            type="submit"
            disabled={chambers.length === 0}
            className="w-full rounded-lg bg-blue-600 p-3 text-white disabled:opacity-50"
          >
            Save Schedule
          </button>
        </form>
      </main>
    </div>
  );
}

export default DoctorSchedule;
