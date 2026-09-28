import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import NotificationBell from "../../components/NotificationBell";
import Logo from "../../components/Logo";

const STATUS_LABEL = {
  waiting: { label: "Waiting for confirmation", cls: "bg-yellow-100 text-yellow-700" },
  in_queue: { label: "Accepted — in queue", cls: "bg-blue-100 text-blue-700" },
  consulting: { label: "In consultation", cls: "bg-green-100 text-green-700" },
  completed: { label: "Completed", cls: "bg-gray-100 text-gray-600" },
  cancelled: { label: "Cancelled", cls: "bg-red-100 text-red-700" },
  no_show: { label: "No-show", cls: "bg-red-100 text-red-700" },
};

function PatientDashboard() {
  const { logout } = useAuth();
  const [query, setQuery] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [searched, setSearched] = useState(false);
  const [recentAppointments, setRecentAppointments] = useState([]);

  useEffect(() => {
    api
      .get("/appointments/my")
      .then((res) => setRecentAppointments(res.data.appointments.slice(0, 3)))
      .catch(() => setRecentAppointments([]));
  }, []);

  const search = async (e) => {
    e.preventDefault();
    const response = await api.get("/doctors/search", { params: { query } });
    setDoctors(response.data.doctors);
    setSearched(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex items-center justify-between">
        <div>
          <Logo size="lg" />
          <p className="text-gray-500">Find a doctor and book an appointment</p>
        </div>

        <div className="flex gap-3">
          <NotificationBell />
          <Link to="/patient/appointments" className="rounded-lg bg-white px-4 py-2 shadow">
            My Appointments
          </Link>
          <button onClick={logout} className="rounded-lg bg-white px-4 py-2 shadow">
            Logout
          </button>
        </div>
      </div>

      {recentAppointments.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-700">Your recent appointments</h2>
            <Link to="/patient/appointments" className="text-sm text-blue-600 hover:underline">
              View all →
            </Link>
          </div>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            {recentAppointments.map((appt) => (
              <div key={appt._id} className="rounded-xl bg-white p-4 shadow">
                <p className="font-bold">Dr. {appt.doctorId?.name}</p>
                <p className="text-sm text-gray-500">{appt.centreId?.name}</p>
                <p className="mt-1 text-xs text-gray-400">
                  {new Date(appt.appointmentDate).toLocaleDateString()} · Token #{appt.tokenNumber}
                </p>
                <span
                  className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium ${
                    STATUS_LABEL[appt.status]?.cls || "bg-gray-100 text-gray-600"
                  }`}
                >
                  {STATUS_LABEL[appt.status]?.label || appt.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={search} className="mt-8 flex gap-3">
        <input
          type="text"
          placeholder="Search doctor by name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full max-w-md rounded-lg border p-3"
        />
        <button type="submit" className="rounded-lg bg-blue-600 px-5 py-3 text-white">
          Search
        </button>
        <Link
          to="/explore"
          className="whitespace-nowrap rounded-lg bg-white px-5 py-3 text-blue-600 shadow"
        >
          Advanced Explore →
        </Link>
      </form>

      <div className="mt-6 space-y-4">
        {searched && doctors.length === 0 && (
          <p className="text-gray-500">No verified doctors found.</p>
        )}

        {doctors.map((doctor) => (
          <div key={doctor._id} className="rounded-xl bg-white p-5 shadow">
            <h3 className="text-lg font-bold">Dr. {doctor.name}</h3>
            <p className="text-blue-600">{doctor.specialization}</p>
            <p className="text-gray-500">{doctor.qualification}</p>

            <div className="mt-4 space-y-2">
              {(doctor.chambers || []).map((centre) => (
                <div key={centre._id} className="rounded-lg border p-3">
                  <p className="font-medium">{centre.name}</p>
                  <p className="text-sm text-gray-500">{centre.address}</p>
                </div>
              ))}
              {(!doctor.chambers || doctor.chambers.length === 0) && (
                <p className="text-sm text-gray-400">No associated centre yet</p>
              )}
            </div>

            <Link
              to={`/doctor/${doctor._id}`}
              className="mt-4 inline-block rounded-lg bg-green-600 px-5 py-2 text-sm text-white"
            >
              View Profile &amp; Book
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PatientDashboard;
