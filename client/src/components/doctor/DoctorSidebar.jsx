import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Logo from "../../components/Logo";

function DoctorSidebar() {
  const { logout } = useAuth();

  return (
    <aside className="min-h-screen w-64 bg-white p-5 shadow">
      <Logo size="md" />
      <p className="mt-1 text-sm text-gray-500">Doctor Panel</p>

      <nav className="mt-8 space-y-2">
        <Link to="/doctor/dashboard" className="block rounded-lg p-3 hover:bg-gray-100">
          Dashboard
        </Link>
        <Link to="/doctor/schedule" className="block rounded-lg p-3 hover:bg-gray-100">
          Schedule
        </Link>
        
        <Link to="/doctor/profile" className="block rounded-lg p-3 hover:bg-gray-100">
          My Profile
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

export default DoctorSidebar;
