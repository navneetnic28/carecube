import { useEffect, useState } from "react";
import api from "../../services/api";
import CentreSidebar from "../../components/centre/CentreSidebar";
import NotificationBell from "../../components/NotificationBell";

function CentreDashboard() {
  const [data, setData] = useState({ doctors: 0, appointments: 0, waiting: 0, completed: 0 });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await api.get("/centre/dashboard");
      setData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <CentreSidebar />

      <main className="flex-1 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Centre Dashboard</h1>
            <p className="mt-2 text-gray-600">Manage your centre operations</p>
          </div>
          <NotificationBell />
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-4">
          <div className="rounded-xl bg-white p-5 shadow">
            <p className="text-gray-500">Doctors</p>
            <h2 className="mt-2 text-3xl font-bold">{data.doctors}</h2>
          </div>
          <div className="rounded-xl bg-white p-5 shadow">
            <p className="text-gray-500">Today's Appointments</p>
            <h2 className="mt-2 text-3xl font-bold">{data.appointments}</h2>
          </div>
          <div className="rounded-xl bg-white p-5 shadow">
            <p className="text-gray-500">Waiting</p>
            <h2 className="mt-2 text-3xl font-bold">{data.waiting}</h2>
          </div>
          <div className="rounded-xl bg-white p-5 shadow">
            <p className="text-gray-500">Completed</p>
            <h2 className="mt-2 text-3xl font-bold">{data.completed}</h2>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CentreDashboard;
