import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Logo from "../../components/Logo";

function AdminSidebar() {
  const { logout } = useAuth();

  return (
    <aside className="min-h-screen w-64 bg-white p-5 shadow">
      <Logo size="md" />
      <p className="text-sm text-gray-500">Admin Panel</p>

      <nav className="mt-8 space-y-2">
        <Link to="/admin/dashboard" className="block rounded-lg p-3 hover:bg-gray-100">
          Dashboard
        </Link>
        <Link to="/admin/doctors/pending" className="block rounded-lg p-3 hover:bg-gray-100">
          Doctor Verification
        </Link>
        <Link to="/admin/centres/pending" className="block rounded-lg p-3 hover:bg-gray-100">
          Centre Verification
        </Link>
        <Link to="/admin/doctors" className="block rounded-lg p-3 hover:bg-gray-100">
          All Doctors
        </Link>
        <Link to="/admin/centres" className="block rounded-lg p-3 hover:bg-gray-100">
          All Centres
        </Link>
        <Link to="/admin/users" className="block rounded-lg p-3 hover:bg-gray-100">
          Patients / Users
        </Link>
        <Link to="/admin/appointments" className="block rounded-lg p-3 hover:bg-gray-100">
          All Appointments
        </Link>
        <Link to="/admin/reports" className="block rounded-lg p-3 hover:bg-gray-100">
          Reported Issues
        </Link>
        <button
          onClick={logout}
          className="w-full rounded-lg p-3 text-left hover:bg-gray-100"
        >
          Logout
        </button>
      </nav>
    </aside>
  );
}

export default AdminSidebar;
