import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Logo from "../../components/Logo";

function CentreSidebar() {
  const { logout } = useAuth();

  return (
    <aside className="min-h-screen w-64 bg-white p-5 shadow">
      <Logo size="md" />
      <p className="mt-1 text-sm text-gray-500">Centre Panel</p>

      <nav className="mt-8 space-y-2">
        <Link to="/centre/dashboard" className="block rounded-lg p-3 hover:bg-gray-100">
          Dashboard
        </Link>
        <Link to="/centre/doctors" className="block rounded-lg p-3 hover:bg-gray-100">
          Doctors
        </Link>
        <Link to="/centre/queue" className="block rounded-lg p-3 hover:bg-gray-100">
          Queue
        </Link>
        <Link to="/centre/walk-in" className="block rounded-lg p-3 hover:bg-gray-100">
          Walk-in Patient
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

export default CentreSidebar;
