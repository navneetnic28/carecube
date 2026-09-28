import { useEffect, useState } from "react";
import api from "../../services/api";
import DoctorSidebar from "../../components/doctor/DoctorSidebar";

function DoctorBookPatient() {
  const [chambers, setChambers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    centreId: "",
    reason: "",
    paymentMethod: "cash",
    amount: "",
  });
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/doctor/profile").then((res) => {
      const list = res.data.doctor.chambers || [];
      setChambers(list);
      setForm((prev) => ({
        ...prev,
        centreId: list[0]?._id || "",
        amount: res.data.doctor.consultationFee || "",
      }));
    });
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const res = await api.post("/doctor/walk-in", {
        ...form,
        amount: Number(form.amount) || 0,
      });
      setMessage(`Appointment booked — Token #${res.data.appointment.tokenNumber}`);
      setForm((prev) => ({ ...prev, name: "", phone: "", reason: "" }));
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to book appointment");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DoctorSidebar />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold">Book Appointment for a Patient</h1>
        <p className="mt-1 text-gray-500">
          For patients who call you or walk in and don't use the app.
        </p>

        {message && (
          <p className="mt-4 max-w-lg rounded-lg bg-blue-50 p-3 text-sm text-blue-700">{message}</p>
        )}

        <form onSubmit={submit} className="mt-6 max-w-lg space-y-3 rounded-xl bg-white p-6 shadow">
          <input name="name" placeholder="Patient name" value={form.name} onChange={handleChange} required className="w-full rounded-lg border p-3" />
          <input name="phone" placeholder="Patient phone" value={form.phone} onChange={handleChange} required className="w-full rounded-lg border p-3" />

          {chambers.length > 0 ? (
            <select name="centreId" value={form.centreId} onChange={handleChange} className="w-full rounded-lg border p-3">
              {chambers.map((c) => (
                <option key={c._id} value={c._id}>{c.name}{c.city ? ` — ${c.city}` : ""}</option>
              ))}
            </select>
          ) : (
            <p className="rounded-lg bg-yellow-50 p-3 text-sm text-yellow-700">
              You're not associated with any centre yet.
            </p>
          )}

          <input name="reason" placeholder="Reason (optional)" value={form.reason} onChange={handleChange} className="w-full rounded-lg border p-3" />

          <div className="flex gap-3">
            <select name="paymentMethod" value={form.paymentMethod} onChange={handleChange} className="w-full rounded-lg border p-3">
              <option value="cash">Cash</option>
              <option value="online">Online</option>
            </select>
            <input type="number" name="amount" min="0" placeholder="Amount ₹" value={form.amount} onChange={handleChange} className="w-full rounded-lg border p-3" />
          </div>

          <button type="submit" disabled={saving || chambers.length === 0} className="w-full rounded-lg bg-blue-600 p-3 text-white disabled:opacity-50">
            {saving ? "Booking..." : "Book Appointment"}
          </button>
        </form>
      </main>
    </div>
  );
}

export default DoctorBookPatient;
