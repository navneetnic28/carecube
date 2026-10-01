import { useEffect, useState } from "react";
import api from "../../services/api";
import AdminSidebar from "../../components/admin/AdminSidebar";
import {
  Menu,
  X,
  Users,
  UserRound,
  Mail,
  Phone,
  CalendarDays,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState("patient");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Mobile sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  // =========================================================
  // LOAD USERS
  // =========================================================
  const load = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await api.get("/admin/users", {
        params: {
          role: role || undefined,
        },
      });

      setUsers(response.data.users || []);
    } catch (error) {
      console.error("Unable to load users:", error);

      alert(
        error.response?.data?.message ||
          "Unable to load users"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // =========================================================
  // CLOSE SIDEBAR
  // =========================================================
  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50">

      {/* =====================================================
          MOBILE SIDEBAR OVERLAY
      ====================================================== */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[1px] lg:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* =====================================================
          SIDEBAR
          
          Desktop:
          Always visible on left.

          Mobile:
          Hidden and opens as drawer.
      ====================================================== */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          w-64
          bg-white
          shadow-2xl
          transition-transform duration-300 ease-in-out
          lg:translate-x-0

          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >

        {/* Mobile Sidebar Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4 lg:hidden">

          <div className="flex items-center gap-2">

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <ShieldCheck size={19} />
            </div>

            <span className="font-bold text-slate-900">
              Admin Panel
            </span>

          </div>

          <button
            type="button"
            onClick={closeSidebar}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100"
            aria-label="Close menu"
          >
            <X size={21} />
          </button>

        </div>

        {/* Existing Admin Sidebar */}
        <div className="h-full overflow-y-auto">
          <AdminSidebar />
        </div>

      </aside>

      {/* =====================================================
          MAIN CONTENT
          
          IMPORTANT:
          lg:ml-64 keeps content to the RIGHT of sidebar.
          Therefore dashboard/sidebar will not go underneath.
      ====================================================== */}
      <main className="min-h-screen min-w-0 lg:ml-64">

        {/* ===================================================
            MOBILE TOP BAR
        ==================================================== */}
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur lg:hidden">

          <div className="flex h-16 items-center justify-between px-4">

            <div className="flex min-w-0 items-center gap-3">

              {/* MENU BUTTON */}
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition hover:bg-slate-200"
                aria-label="Open menu"
              >
                <Menu size={22} />
              </button>

              <div className="min-w-0">

                <p className="truncate text-base font-bold text-slate-900">
                  Registered Users
                </p>

                <p className="text-xs text-slate-500">
                  User management
                </p>

              </div>

            </div>

            {/* MOBILE REFRESH */}
            <button
              type="button"
              onClick={() => load(true)}
              disabled={refreshing}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
              aria-label="Refresh users"
            >
              <RefreshCw
                size={18}
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />
            </button>

          </div>

        </header>

        {/* ===================================================
            PAGE CONTENT
        ==================================================== */}
        <div className="w-full px-4 py-5 sm:px-6 sm:py-7 lg:px-8">

          {/* =================================================
              DESKTOP HEADER
          ================================================== */}
          <div className="mb-6 hidden items-center justify-between lg:flex">

            <div className="flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Users size={24} />
              </div>

              <div>

                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                  Registered Users
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Manage users registered on CareCube
                </p>

              </div>

            </div>

            <button
              type="button"
              onClick={() => load(true)}
              disabled={refreshing}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw
                size={17}
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />

              Refresh
            </button>

          </div>

          {/* =================================================
              MOBILE TITLE
          ================================================== */}
          <div className="mb-5 lg:hidden">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Users size={21} />
              </div>

              <div className="min-w-0">

                <h1 className="truncate text-xl font-bold text-slate-900">
                  Registered Users
                </h1>

                <p className="mt-0.5 text-xs text-slate-500">
                  Manage CareCube users
                </p>

              </div>

            </div>

          </div>

          {/* =================================================
              FILTER CARD
          ================================================== */}
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <h2 className="text-sm font-bold text-slate-900">
                  User Filter
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Select which users you want to view
                </p>

              </div>

              <select
                value={role}
                onChange={(e) =>
                  setRole(e.target.value)
                }
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 sm:w-56"
              >
                <option value="patient">
                  Patients
                </option>

                <option value="">
                  All roles
                </option>
              </select>

            </div>

          </section>

          {/* =================================================
              USERS COUNT
          ================================================== */}
          <div className="mt-6 flex items-center justify-between">

            <div>

              <h2 className="text-base font-bold text-slate-900">
                User List
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                {loading
                  ? "Loading users..."
                  : `${users.length} user${
                      users.length !== 1
                        ? "s"
                        : ""
                    } found`}
              </p>

            </div>

          </div>

          {/* =================================================
              LOADING
          ================================================== */}
          {loading && (
            <div className="mt-5 space-y-4">

              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5"
                >

                  <div className="space-y-3">

                    <div className="h-5 w-40 rounded bg-slate-200" />

                    <div className="h-4 w-64 rounded bg-slate-200" />

                    <div className="h-4 w-48 rounded bg-slate-200" />

                  </div>

                </div>
              ))}

            </div>
          )}

          {/* =================================================
              DESKTOP TABLE
          ================================================== */}
          {!loading && (
            <>

              <div className="mt-5 hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:block">

                <div className="overflow-x-auto">

                  <table className="w-full min-w-[750px] text-left">

                    <thead className="border-b border-slate-200 bg-slate-50">

                      <tr>

                        <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Name
                        </th>

                        <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Email
                        </th>

                        <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Phone
                        </th>

                        <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Role
                        </th>

                        <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Joined
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {users.map((u) => (

                        <tr
                          key={u._id}
                          className="border-b border-slate-100 last:border-0 transition hover:bg-slate-50"
                        >

                          {/* NAME */}
                          <td className="px-5 py-4">

                            <div className="flex items-center gap-3">

                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

                                <UserRound size={18} />

                              </div>

                              <div className="min-w-0">

                                <p className="truncate font-semibold text-slate-900">
                                  {u.name || "Unnamed User"}
                                </p>

                              </div>

                            </div>

                          </td>

                          {/* EMAIL */}
                          <td className="px-5 py-4">

                            <div className="flex min-w-0 items-center gap-2 text-sm text-slate-600">

                              <Mail
                                size={16}
                                className="shrink-0 text-slate-400"
                              />

                              <span className="break-all">
                                {u.email || "—"}
                              </span>

                            </div>

                          </td>

                          {/* PHONE */}
                          <td className="px-5 py-4">

                            <div className="flex items-center gap-2 text-sm text-slate-600">

                              <Phone
                                size={16}
                                className="shrink-0 text-slate-400"
                              />

                              {u.phone || "—"}

                            </div>

                          </td>

                          {/* ROLE */}
                          <td className="px-5 py-4">

                            <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold capitalize text-blue-700">
                              {u.role || "unknown"}
                            </span>

                          </td>

                          {/* DATE */}
                          <td className="px-5 py-4">

                            <div className="flex items-center gap-2 text-sm text-slate-500">

                              <CalendarDays
                                size={16}
                                className="text-slate-400"
                              />

                              {u.createdAt
                                ? new Date(
                                    u.createdAt
                                  ).toLocaleDateString()
                                : "—"}

                            </div>

                          </td>

                        </tr>

                      ))}

                    </tbody>

                  </table>

                </div>

                {/* DESKTOP EMPTY */}
                {users.length === 0 && (
                  <EmptyUsers />
                )}

              </div>

              {/* =================================================
                  MOBILE USER CARDS
              ================================================== */}
              <div className="mt-5 space-y-3 md:hidden">

                {users.map((u) => (

                  <div
                    key={u._id}
                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                  >

                    {/* USER HEADER */}
                    <div className="flex items-start justify-between gap-3">

                      <div className="flex min-w-0 items-center gap-3">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

                          <UserRound size={20} />

                        </div>

                        <div className="min-w-0">

                          <h3 className="truncate font-bold text-slate-900">
                            {u.name || "Unnamed User"}
                          </h3>

                          <span className="mt-1 inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold capitalize text-blue-700">
                            {u.role || "unknown"}
                          </span>

                        </div>

                      </div>

                    </div>

                    {/* DETAILS */}
                    <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">

                      {/* EMAIL */}
                      <div className="flex min-w-0 items-start gap-3">

                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                          <Mail size={15} />
                        </div>

                        <div className="min-w-0">

                          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                            Email
                          </p>

                          <p className="mt-0.5 break-all text-sm text-slate-700">
                            {u.email || "Not available"}
                          </p>

                        </div>

                      </div>

                      {/* PHONE */}
                      <div className="flex items-start gap-3">

                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                          <Phone size={15} />
                        </div>

                        <div>

                          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                            Phone
                          </p>

                          <p className="mt-0.5 text-sm text-slate-700">
                            {u.phone || "Not available"}
                          </p>

                        </div>

                      </div>

                      {/* JOINED */}
                      <div className="flex items-start gap-3">

                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                          <CalendarDays size={15} />
                        </div>

                        <div>

                          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                            Joined
                          </p>

                          <p className="mt-0.5 text-sm text-slate-700">
                            {u.createdAt
                              ? new Date(
                                  u.createdAt
                                ).toLocaleDateString()
                              : "Not available"}
                          </p>

                        </div>

                      </div>

                    </div>

                  </div>

                ))}

                {/* MOBILE EMPTY */}
                {users.length === 0 && (
                  <EmptyUsers />
                )}

              </div>

            </>
          )}

        </div>

      </main>
    </div>
  );
}

// ============================================================
// EMPTY STATE
// ============================================================

function EmptyUsers() {
  return (
    <div className="px-5 py-12 text-center">

      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <Users size={26} />
      </div>

      <h3 className="mt-4 text-base font-bold text-slate-900">
        No users found
      </h3>

      <p className="mt-1 text-sm text-slate-500">
        There are no users available for the selected role.
      </p>

    </div>
  );
}

export default AdminUsers;