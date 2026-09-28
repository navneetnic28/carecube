import { useEffect, useState } from "react";
import api from "../../services/api";
import AdminSidebar from "../../components/admin/AdminSidebar";

function AdminReports() {
  const [reports, setReports] = useState([]);
  const [status, setStatus] = useState("open");

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const load = async () => {
    const response = await api.get("/admin/reports", { params: { status: status || undefined } });
    setReports(response.data.reports);
  };

  const resolve = async (id) => {
    const note = window.prompt("Resolution note (optional):") || "";
    try {
      await api.patch(`/admin/reports/${id}/resolve`, { resolutionNote: note });
      load();
    } catch (error) {
      alert(error.response?.data?.message || "Unable to resolve report");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold">Reported Issues</h1>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="mt-4 rounded-lg border p-2"
        >
          <option value="open">Open</option>
          <option value="resolved">Resolved</option>
          <option value="">All</option>
        </select>

        <div className="mt-6 space-y-4">
          {reports.map((r) => (
            <div key={r._id} className="rounded-xl bg-white p-5 shadow">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold">{r.subject}</h3>
                  <p className="mt-1 text-gray-600">{r.message}</p>
                  <p className="mt-2 text-xs uppercase text-gray-400">
                    Filed by {r.reporterRole} · target: {r.targetType} ·{" "}
                    {new Date(r.createdAt).toLocaleString()}
                  </p>
                  {r.status === "resolved" && r.resolutionNote && (
                    <p className="mt-2 text-sm text-green-700">
                      Resolved: {r.resolutionNote}
                    </p>
                  )}
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    r.status === "open"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {r.status}
                </span>
              </div>

              {r.status === "open" && (
                <button
                  onClick={() => resolve(r._id)}
                  className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white"
                >
                  Mark Resolved
                </button>
              )}
            </div>
          ))}
          {reports.length === 0 && <p className="text-gray-500">No reports found.</p>}
        </div>
      </main>
    </div>
  );
}

export default AdminReports;
