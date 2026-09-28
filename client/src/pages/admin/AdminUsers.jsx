import { useEffect, useState } from "react";
import api from "../../services/api";
import AdminSidebar from "../../components/admin/AdminSidebar";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState("patient");

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  const load = async () => {
    const response = await api.get("/admin/users", { params: { role: role || undefined } });
    setUsers(response.data.users);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold">Registered Users</h1>

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="mt-4 rounded-lg border p-2"
        >
          <option value="patient">Patients</option>
          <option value="">All roles</option>
        </select>

        <div className="mt-6 overflow-hidden rounded-xl bg-white shadow">
          <table className="w-full text-left">
            <thead className="bg-gray-100 text-sm text-gray-600">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Role</th>
                <th className="p-3">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-t">
                  <td className="p-3">{u.name}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">{u.phone}</td>
                  <td className="p-3 capitalize">{u.role}</td>
                  <td className="p-3 text-sm text-gray-500">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-gray-500">
                    No users found.
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

export default AdminUsers;
