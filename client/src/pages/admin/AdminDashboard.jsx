import { useEffect, useState } from "react";
import api from "../../services/api";
import AdminSidebar from "../../components/admin/AdminSidebar";

function Stat({ title, value }) {
  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <p className="text-gray-500">{title}</p>
      <h2 className="mt-2 text-3xl font-bold">{value}</h2>
    </div>
  );
}

function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    doctors: 0,
    centres: 0,
    appointments: 0,
    pendingDoctors: 0,
    pendingCentres: 0,
    activeDoctors: 0,
    activeCentres: 0,
    todaysAppointments: 0,
    openReports: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await api.get("/admin/dashboard");
      setStats(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">Manage the CareCube platform</p>

        <div className="mt-8 grid gap-5 md:grid-cols-4">
          <Stat title="Total Users" value={stats.users} />
          <Stat title="Doctors" value={stats.doctors} />
          <Stat title="Centres" value={stats.centres} />
          <Stat title="Total Appointments" value={stats.appointments} />
          <Stat title="Active Doctors" value={stats.activeDoctors} />
          <Stat title="Active Centres" value={stats.activeCentres} />
          <Stat title="Today's Appointments" value={stats.todaysAppointments} />
          <Stat title="Open Reports" value={stats.openReports} />
          <Stat title="Pending Doctors" value={stats.pendingDoctors} />
          <Stat title="Pending Centres" value={stats.pendingCentres} />
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
