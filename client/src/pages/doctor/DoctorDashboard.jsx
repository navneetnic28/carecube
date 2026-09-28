import { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import DoctorSidebar from "../../components/doctor/DoctorSidebar";
import StatusBadge from "../../components/StatusBadge";
import NotificationBell from "../../components/NotificationBell";

const STATUS_OPTIONS = [
  { value: "available", label: "🟢 Available" },
  { value: "delayed", label: "🟡 Delayed" },
  { value: "unavailable", label: "🔴 Not available today" },
  { value: "holiday", label: "🔴 On holiday" },
];

function DoctorDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [centreId, setCentreId] = useState("");
  const [chambers, setChambers] = useState([]);
  const [statuses, setStatuses] = useState({}); // centreId -> { status, delayMinutes, note }
  const [statusCentreId, setStatusCentreId] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadAppointments();
    loadChambers();
    loadStatuses();
  }, []);

  const loadAppointments = async () => {
    try {
      const response = await api.get("/appointments/doctor");
      setAppointments(response.data.appointments);
      if (response.data.appointments.length > 0 && !centreId) {
        setCentreId(response.data.appointments[0].centreId?._id || response.data.appointments[0].centreId);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadChambers = async () => {
    try {
      const response = await api.get("/doctor/schedule");
      const seen = new Set();
      const unique = [];
      response.data.schedule.forEach((s) => {
        if (s.centreId && !seen.has(s.centreId._id)) {
          seen.add(s.centreId._id);
          unique.push(s.centreId);
        }
      });
      setChambers(unique);
      if (unique.length > 0) setStatusCentreId(unique[0]._id);
    } catch (error) {
      console.error(error);
    }
  };

  const loadStatuses = async () => {
    try {
      const response = await api.get("/doctor/status");
      const map = {};
      response.data.statuses.forEach((s) => {
        map[s.centreId._id || s.centreId] = {
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

  const currentStatus = statuses[statusCentreId] || { status: "available", delayMinutes: 0, note: "" };

  const updateLocalStatus = (field, value) => {
    setStatuses((prev) => ({
      ...prev,
      [statusCentreId]: { ...currentStatus, [field]: value },
    }));
  };

  const saveStatus = async () => {
    if (!statusCentreId) return;
    setSaving(true);
    try {
      await api.patch("/doctor/status", {
        centreId: statusCentreId,
        date: new Date().toISOString().split("T")[0],
        status: currentStatus.status,
        delayMinutes: currentStatus.delayMinutes,
        note: currentStatus.note,
      });
      await loadStatuses();
    } catch (error) {
      alert(error.response?.data?.message || "Unable to update status");
    } finally {
      setSaving(false);
    }
  };

  const currentPatient = appointments.find((item) => item.status === "consulting");
  const waitingPatients = appointments.filter(
    (item) => item.status === "waiting" || item.status === "in_queue"
  );
  const completed = appointments.filter((item) => item.status === "completed");

  const callNext = async () => {
    try {
      await api.patch("/appointments/doctor/call-next", {
        centreId,
        date: new Date().toISOString().split("T")[0],
      });
      await loadAppointments();
    } catch (error) {
      alert(error.response?.data?.message || "Unable to call next patient");
    }
  };

  const completePatient = async (appointmentId) => {
    try {
      await api.patch(`/appointments/doctor/${appointmentId}/complete`);
      await loadAppointments();
    } catch (error) {
      alert(error.response?.data?.message || "Unable to complete consultation");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <DoctorSidebar />
        <main className="flex-1 p-6">Loading...</main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DoctorSidebar />

      <main className="flex-1 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Doctor Dashboard</h1>
            <p className="mt-2 text-gray-600">Manage today's patients</p>
          </div>
          {user?.id && (
            <div className="flex items-center gap-3">
              <NotificationBell />
              <a
                href={`/doctor/${user.id}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg bg-white px-4 py-2 text-sm shadow"
              >
                View Public Profile
              </a>
            </div>
          )}
        </div>

        {chambers.length > 0 && (
          <div className="mt-6 rounded-xl bg-white p-5 shadow">
            <div className="flex items-center justify-between">
              <h2 className="font-bold">Live Availability</h2>
              <StatusBadge status={currentStatus.status} delayMinutes={currentStatus.delayMinutes} />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Let patients know instantly if you're running late or unavailable — no phone calls needed.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <select
                value={statusCentreId}
                onChange={(e) => setStatusCentreId(e.target.value)}
                className="rounded-lg border p-2 text-sm"
              >
                {chambers.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <select
                value={currentStatus.status}
                onChange={(e) => updateLocalStatus("status", e.target.value)}
                className="rounded-lg border p-2 text-sm"
              >
                {STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>

              {currentStatus.status === "delayed" && (
                <input
                  type="number"
                  min="0"
                  placeholder="Delay (min)"
                  value={currentStatus.delayMinutes}
                  onChange={(e) => updateLocalStatus("delayMinutes", Number(e.target.value))}
                  className="w-32 rounded-lg border p-2 text-sm"
                />
              )}

              <input
                type="text"
                placeholder="Note (optional)"
                value={currentStatus.note}
                onChange={(e) => updateLocalStatus("note", e.target.value)}
                className="w-48 rounded-lg border p-2 text-sm"
              />

              <button
                onClick={saveStatus}
                disabled={saving}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white disabled:opacity-60"
              >
                {saving ? "Saving..." : "Update Status"}
              </button>
            </div>
          </div>
        )}

        <div className="mt-8 grid gap-5 md:grid-cols-4">
          <div className="rounded-xl bg-white p-5 shadow">
            <p className="text-gray-500">Total</p>
            <h2 className="text-3xl font-bold">{appointments.length}</h2>
          </div>
          <div className="rounded-xl bg-white p-5 shadow">
            <p className="text-gray-500">Waiting</p>
            <h2 className="text-3xl font-bold">{waitingPatients.length}</h2>
          </div>
          <div className="rounded-xl bg-white p-5 shadow">
            <p className="text-gray-500">Consulting</p>
            <h2 className="text-3xl font-bold">{currentPatient ? 1 : 0}</h2>
          </div>
          <div className="rounded-xl bg-white p-5 shadow">
            <p className="text-gray-500">Completed</p>
            <h2 className="text-3xl font-bold">{completed.length}</h2>
          </div>
        </div>

        {currentPatient && (
          <div className="mt-8 rounded-xl bg-white p-6 shadow">
            <p className="text-gray-500">Current Patient</p>
            <h2 className="mt-2 text-2xl font-bold">Token #{currentPatient.tokenNumber}</h2>
            <p className="mt-2">{currentPatient.patientDetails?.name || currentPatient.patientId?.name}{currentPatient.patientDetails?.age ? `, ${currentPatient.patientDetails.age}` : ""}{currentPatient.patientDetails?.gender ? ` · ${currentPatient.patientDetails.gender}` : ""}</p>

            <button
              onClick={() => completePatient(currentPatient._id)}
              className="mt-5 rounded-lg bg-green-600 px-5 py-3 text-white"
            >
              Complete Consultation
            </button>
          </div>
        )}

        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Waiting Queue</h2>
            {!currentPatient && waitingPatients.length > 0 && (
              <button onClick={callNext} className="rounded-lg bg-blue-600 px-5 py-3 text-white">
                Call Next
              </button>
            )}
          </div>

          <div className="mt-4 space-y-3">
            {waitingPatients.map((appointment) => (
              <div
                key={appointment._id}
                className="flex items-center justify-between rounded-xl bg-white p-5 shadow"
              >
                <div>
                  <h3 className="font-bold">Token #{appointment.tokenNumber}</h3>
                  <p>{appointment.patientDetails?.name || appointment.patientId?.name}{appointment.patientDetails?.age ? `, ${appointment.patientDetails.age}` : ""}{appointment.patientDetails?.gender ? ` · ${appointment.patientDetails.gender}` : ""}</p>
                </div>
                <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm">
                  {appointment.status}
                </span>
              </div>
            ))}
            {waitingPatients.length === 0 && (
              <p className="text-gray-500">No patients waiting.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default DoctorDashboard;
