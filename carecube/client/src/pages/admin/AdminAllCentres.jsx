import { useEffect, useState } from "react";
import api from "../../services/api";
import AdminSidebar from "../../components/admin/AdminSidebar";

function AdminAllCentres() {
  const [centres, setCentres] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const load = async () => {
    const response = await api.get("/admin/centres", {
      params: { status: statusFilter || undefined, query: query || undefined },
    });
    setCentres(response.data.centres);
  };

  const toggleDisable = async (centre) => {
    if (centre.isDisabled) {
      await api.patch(`/admin/centres/${centre._id}/enable`);
    } else {
      const reason = window.prompt("Reason for disabling this centre's account:") || "";
      await api.patch(`/admin/centres/${centre._id}/disable`, { reason });
    }
    load();
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold">All Centres</h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            load();
          }}
          className="mt-4 flex flex-wrap gap-3"
        >
          <input
            type="text"
            placeholder="Search by name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="rounded-lg border p-2"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border p-2"
          >
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="rejected">Rejected</option>
          </select>
          <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-white">
            Search
          </button>
        </form>

        <div className="mt-6 space-y-4">
          {centres.map((centre) => (
            <div key={centre._id} className="rounded-xl bg-white p-5 shadow">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold">{centre.name}</h3>
                  <p className="text-gray-500">
                    {centre.address}
                    {centre.city ? `, ${centre.city}` : ""}
                  </p>
                  <p className="text-sm text-gray-500">{centre.email}</p>
                  <p className="mt-1 text-sm capitalize text-gray-500">
                    Status: {centre.verificationStatus}
                    {centre.isDisabled && (
                      <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-700">
                        Disabled
                      </span>
                    )}
                  </p>
                  {centre.disabledReason && (
                    <p className="mt-1 text-xs text-gray-400">Reason: {centre.disabledReason}</p>
                  )}
                </div>

                {centre.verificationStatus === "verified" && (
                  <button
                    onClick={() => toggleDisable(centre)}
                    className={`rounded-lg px-4 py-2 text-sm text-white ${
                      centre.isDisabled ? "bg-green-600" : "bg-red-600"
                    }`}
                  >
                    {centre.isDisabled ? "Enable" : "Disable"}
                  </button>
                )}
              </div>
            </div>
          ))}
          {centres.length === 0 && <p className="text-gray-500">No centres found.</p>}
        </div>
      </main>
    </div>
  );
}

export default AdminAllCentres;
