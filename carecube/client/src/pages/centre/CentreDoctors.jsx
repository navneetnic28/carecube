import { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import CentreSidebar from "../../components/centre/CentreSidebar";
import StatusBadge from "../../components/StatusBadge";

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
  const [statuses, setStatuses] = useState({}); // doctorId -> { status, delayMinutes, note }
  const [savingId, setSavingId] = useState("");
  const [joinRequests, setJoinRequests] = useState([]);

  useEffect(() => {
    loadDoctors();
    loadStatuses();
    loadJoinRequests();
  }, []);

  const loadJoinRequests = async () => {
    try {
      const res = await api.get("/centre/join-requests");
      setJoinRequests(res.data.requests);
    } catch (e) {
      console.error(e);
    }
  };

  const respondJoin = async (id, action) => {
    await api.patch(`/centre/join-requests/${id}/${action}`);
    loadJoinRequests();
    loadDoctors();
  };

  const loadDoctors = async () => {
    try {
      const response = await api.get("/centre/doctors");
      setDoctors(response.data.doctors);
    } catch (error) {
      console.error(error);
    }
  };

  const loadStatuses = async () => {
    try {
      const response = await api.get("/centre/status");
      const map = {};
      response.data.statuses.forEach((s) => {
        map[s.doctorId._id || s.doctorId] = {
          status: s.status,
          delayMinutes: s.delayMinutes,
          note: s.note,
        };
      });
      setStatuses(map);
    } catch (error) {
      console.error(error);
    }
  };

  const searchToAdd = async (e) => {
    e?.preventDefault();
    try {
      const res = await api.get("/centre/doctors/search", { params: { query: searchText } });
      setResults(res.data.doctors);
      setSearchedOnce(true);
    } catch (error) {
      alert(error.response?.data?.message || "Search failed");
    }
  };

  const sendRequest = async (doctorId) => {
    try {
      await api.post("/centre/doctors/request", { doctorId });
      setResults((prev) => prev.map((d) => (d._id === doctorId ? { ...d, requested: true } : d)));
    } catch (error) {
      alert(error.response?.data?.message || "Unable to send request");
    }
  };

  const updateLocalStatus = (doctorId, field, value) => {
    setStatuses((prev) => ({
      ...prev,
      [doctorId]: { status: "available", delayMinutes: 0, note: "", ...prev[doctorId], [field]: value },
    }));
  };

  const saveStatus = async (doctorId) => {
    const current = statuses[doctorId] || { status: "available", delayMinutes: 0, note: "" };
    setSavingId(doctorId);
    try {
      await api.patch("/centre/status", {
        doctorId,
        date: new Date().toISOString().split("T")[0],
        status: current.status,
        delayMinutes: current.delayMinutes,
        note: current.note,
      });
      await loadStatuses();
    } catch (error) {
      alert(error.response?.data?.message || "Unable to update status");
    } finally {
      setSavingId("");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <CentreSidebar />

      <main className="flex-1 p-8">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">Doctors</h1>
          {user?.centreId && (
            <a
              href={`/centre/${user.centreId}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg bg-white px-4 py-2 text-sm shadow"
            >
              View Public Page
            </a>
          )}
        </div>

        {joinRequests.length > 0 && (
          <div className="mt-6 max-w-xl space-y-3">
            <h2 className="font-bold">Doctors asking to join your centre</h2>
            {joinRequests.map((r) => (
              <div key={r._id} className="flex items-center justify-between rounded-xl bg-white p-4 shadow">
                <div>
                  <p className="font-medium">Dr. {r.doctorId?.name}</p>
                  <p className="text-sm text-gray-500">{r.doctorId?.specialization} · {r.doctorId?.qualification}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => respondJoin(r._id, "accept")} className="rounded-lg bg-green-600 px-3 py-2 text-sm text-white">Accept</button>
                  <button onClick={() => respondJoin(r._id, "reject")} className="rounded-lg bg-red-600 px-3 py-2 text-sm text-white">Reject</button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 max-w-xl rounded-xl bg-white p-5 shadow">
          <h2 className="font-bold">Add a doctor to your centre</h2>
          <p className="text-sm text-gray-500">Search by doctor name or specialization and send an associate request.</p>
          <form onSubmit={searchToAdd} className="mt-3 flex gap-3">
            <input
              type="text"
              placeholder="Search doctor name or specialization..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full rounded-lg border p-3"
            />
            <button type="submit" className="rounded-lg bg-blue-600 px-5 py-2 text-white">Search</button>
          </form>

          <div className="mt-3 space-y-2">
            {searchedOnce && results.length === 0 && <p className="text-sm text-gray-400">No doctors found.</p>}
            {results.map((d) => (
              <div key={d._id} className="flex items-center gap-3 rounded-lg border p-3">
                {d.photoUrl ? (
                  <img src={d.photoUrl} alt={d.name} className="h-10 w-10 rounded-full object-cover" />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600">{d.name?.[0]}</div>
                )}
                <div className="flex-1">
                  <p className="font-medium">Dr. {d.name}</p>
                  <p className="text-xs text-gray-500">{d.specialization} {d.qualification ? `· ${d.qualification}` : ""}</p>
                </div>
                {d.associated ? (
                  <span className="text-sm text-green-600">✓ Associated</span>
                ) : d.theyRequested ? (
                  <span className="text-sm text-blue-600">Asked to join — accept above</span>
                ) : (
                  <button
                    onClick={() => sendRequest(d._id)}
                    disabled={d.requested}
                    className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white disabled:bg-gray-300"
                  >
                    {d.requested ? "Request sent" : "Send associate request"}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <p className="mt-6 text-sm text-gray-500">
          Update each doctor's live availability so patients see it instantly without calling.
        </p>

        <div className="mt-4 space-y-4">
          {doctors.map((doctor) => {
            const current = statuses[doctor._id] || { status: "available", delayMinutes: 0, note: "" };
            return (
              <div key={doctor._id} className="rounded-xl bg-white p-5 shadow">
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-lg font-bold">Dr. {doctor.name}</h3>
                    <p className="text-blue-600">{doctor.specialization}</p>
                    <p className="text-gray-500">{doctor.qualification}</p>
                  </div>
                  <StatusBadge status={current.status} delayMinutes={current.delayMinutes} />
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <select
                    value={current.status}
                    onChange={(e) => updateLocalStatus(doctor._id, "status", e.target.value)}
                    className="rounded-lg border p-2 text-sm"
                  >
                    {STATUS_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>

                  {current.status === "delayed" && (
                    <input
                      type="number"
                      min="0"
                      placeholder="Delay (min)"
                      value={current.delayMinutes}
                      onChange={(e) =>
                        updateLocalStatus(doctor._id, "delayMinutes", Number(e.target.value))
                      }
                      className="w-32 rounded-lg border p-2 text-sm"
                    />
                  )}

                  <input
                    type="text"
                    placeholder="Note (optional)"
                    value={current.note}
                    onChange={(e) => updateLocalStatus(doctor._id, "note", e.target.value)}
                    className="w-48 rounded-lg border p-2 text-sm"
                  />

                  <button
                    onClick={() => saveStatus(doctor._id)}
                    disabled={savingId === doctor._id}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white disabled:opacity-60"
                  >
                    {savingId === doctor._id ? "Saving..." : "Update Status"}
                  </button>
                </div>
              </div>
            );
          })}
          {doctors.length === 0 && (
            <p className="text-gray-500">No doctors associated yet.</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default CentreDoctors;
