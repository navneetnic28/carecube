import { useEffect, useState } from "react";
import api from "../../services/api";
import AdminSidebar from "../../components/admin/AdminSidebar";

function PendingCentres() {
  const [centres, setCentres] = useState([]);

  useEffect(() => {
    loadCentres();
  }, []);

  const loadCentres = async () => {
    const response = await api.get("/admin/centres/pending");
    setCentres(response.data.centres);
  };

  const verifyCentre = async (centreId) => {
    try {
      await api.patch(`/admin/centres/${centreId}/verify`);
      loadCentres();
    } catch (error) {
      alert(error.response?.data?.message || "Unable to verify centre");
    }
  };

  const rejectCentre = async (centreId) => {
    const reason = window.prompt("Reason for rejection:");
    if (reason === null) return;
    try {
      await api.patch(`/admin/centres/${centreId}/reject`, { reason });
      loadCentres();
    } catch (error) {
      alert(error.response?.data?.message || "Unable to reject centre");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold">Centre Verification</h1>

        <div className="mt-6 space-y-4">
          {centres.map((centre) => (
            <div key={centre._id} className="rounded-xl bg-white p-5 shadow">
              <h3 className="text-lg font-bold">{centre.name}</h3>
              <p className="text-gray-500">{centre.address}</p>
              <p className="text-gray-500 capitalize">Type: {centre.type}</p>
              <p className="mt-1 text-sm text-yellow-600">Status: {centre.verificationStatus}</p>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => verifyCentre(centre._id)}
                  className="rounded-lg bg-green-600 px-4 py-2 text-white"
                >
                  Verify
                </button>
                <button
                  onClick={() => rejectCentre(centre._id)}
                  className="rounded-lg bg-red-600 px-4 py-2 text-white"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
          {centres.length === 0 && (
            <p className="text-gray-500">No pending centres.</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default PendingCentres;
