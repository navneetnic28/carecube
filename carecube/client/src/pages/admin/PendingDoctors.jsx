import { useEffect, useState } from "react";
import api from "../../services/api";
import AdminSidebar from "../../components/admin/AdminSidebar";

function PendingDoctors() {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    const response = await api.get("/admin/doctors/pending");
    setDoctors(response.data.doctors);
  };

  const verifyDoctor = async (doctorId) => {
    try {
      await api.patch(`/admin/doctors/${doctorId}/verify`);
      loadDoctors();
    } catch (error) {
      alert(error.response?.data?.message || "Unable to verify doctor");
    }
  };

  const rejectDoctor = async (doctorId) => {
    const reason = window.prompt("Reason for rejection:");
    if (reason === null) return;
    try {
      await api.patch(`/admin/doctors/${doctorId}/reject`, { reason });
      loadDoctors();
    } catch (error) {
      alert(error.response?.data?.message || "Unable to reject doctor");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold">Doctor Verification</h1>

        <div className="mt-6 space-y-4">
          {doctors.map((doctor) => (
            <div key={doctor._id} className="rounded-xl bg-white p-5 shadow">
              <h3 className="text-lg font-bold">Dr. {doctor.name}</h3>
              <p className="text-blue-600">{doctor.specialization}</p>
              <p className="text-gray-500">{doctor.qualification}</p>
              <p className="text-gray-500">Registration: {doctor.registrationNumber}</p>
              <p className="mt-1 text-sm text-yellow-600">Status: {doctor.verificationStatus}</p>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => verifyDoctor(doctor._id)}
                  className="rounded-lg bg-green-600 px-4 py-2 text-white"
                >
                  Verify
                </button>
                <button
                  onClick={() => rejectDoctor(doctor._id)}
                  className="rounded-lg bg-red-600 px-4 py-2 text-white"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
          {doctors.length === 0 && (
            <p className="text-gray-500">No pending doctors.</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default PendingDoctors;
