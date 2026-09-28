import { useEffect, useState } from "react";
import api from "../../services/api";
import CentreSidebar from "../../components/centre/CentreSidebar";

function paymentBadge(status) {
  const map = {
    paid: "bg-green-100 text-green-700",
    cash: "bg-blue-100 text-blue-700",
    pending: "bg-yellow-100 text-yellow-700",
    unpaid: "bg-gray-100 text-gray-600",
    refunded: "bg-red-100 text-red-700",
  };
  return map[status] || map.pending;
}

function CentreQueue() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    load();
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, []);

  const load = async () => {
    try {
      const response = await api.get("/centre/queue");
      setAppointments(response.data.appointments);
    } catch (error) {
      console.error(error);
    }
  };

  const markPaid = async (id) => {
    try {
      await api.patch(`/centre/appointments/${id}/payment`, { paymentStatus: "paid" });
      await load();
    } catch (error) {
      alert(error.response?.data?.message || "Unable to update payment");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <CentreSidebar />

      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold">Today's Queue</h1>

        <div className="mt-6 overflow-hidden rounded-xl bg-white shadow">
          <table className="w-full text-left">
            <thead className="bg-gray-100 text-sm text-gray-600">
              <tr>
                <th className="p-3">Token</th>
                <th className="p-3">Doctor</th>
                <th className="p-3">Patient</th>
                <th className="p-3">Source</th>
                <th className="p-3">Status</th>
                <th className="p-3">Payment</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => (
                <tr key={appt._id} className="border-t">
                  <td className="p-3 font-bold">#{appt.tokenNumber}</td>
                  <td className="p-3">Dr. {appt.doctorId?.name}</td>
                  <td className="p-3">{appt.patientDetails?.name || appt.patientId?.name}{appt.patientDetails?.age ? `, ${appt.patientDetails.age}` : ""}{appt.patientDetails?.gender ? ` · ${appt.patientDetails.gender}` : ""}</td>
                  <td className="p-3 capitalize">{appt.source?.replace("_", " ")}</td>
                  <td className="p-3">
                    <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm capitalize">
                      {appt.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${paymentBadge(
                          appt.paymentStatus
                        )}`}
                      >
                        {appt.paymentStatus}
                        {appt.amount ? ` · ₹${appt.amount}` : ""}
                      </span>
                      {appt.paymentStatus !== "paid" && (
                        <button
                          onClick={() => markPaid(appt._id)}
                          className="rounded-lg bg-green-600 px-2 py-1 text-xs text-white"
                        >
                          Mark Paid
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {appointments.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-gray-500">
                    No appointments today.
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

export default CentreQueue;
