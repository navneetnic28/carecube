import { useEffect, useState } from "react";
import api from "../../services/api";
import AdminSidebar from "../../components/admin/AdminSidebar";

function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const load = async () => {
    const response = await api.get("/admin/appointments", {
      params: { status: status || undefined },
    });
    setAppointments(response.data.appointments);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold">All Appointments</h1>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="mt-4 rounded-lg border p-2"
        >
          <option value="">All statuses</option>
          <option value="waiting">Waiting</option>
          <option value="in_queue">In Queue</option>
          <option value="consulting">Consulting</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="no_show">No-show</option>
        </select>

        <div className="mt-6 overflow-hidden rounded-xl bg-white shadow">
          <table className="w-full text-left">
            <thead className="bg-gray-100 text-sm text-gray-600">
              <tr>
                <th className="p-3">Token</th>
                <th className="p-3">Patient</th>
                <th className="p-3">Doctor</th>
                <th className="p-3">Centre</th>
                <th className="p-3">Date</th>
                <th className="p-3">Status</th>
                <th className="p-3">Payment</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a._id} className="border-t">
                  <td className="p-3 font-bold">#{a.tokenNumber}</td>
                  <td className="p-3">{a.patientId?.name}</td>
                  <td className="p-3">Dr. {a.doctorId?.name}</td>
                  <td className="p-3">{a.centreId?.name}</td>
                  <td className="p-3 text-sm text-gray-500">
                    {new Date(a.appointmentDate).toLocaleDateString()}
                  </td>
                  <td className="p-3 capitalize">{a.status.replace("_", " ")}</td>
                  <td className="p-3 capitalize">
                    {a.paymentStatus}
                    {a.amount ? ` · ₹${a.amount}` : ""}
                  </td>
                </tr>
              ))}
              {appointments.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-gray-500">
                    No appointments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default AdminAppointments;
