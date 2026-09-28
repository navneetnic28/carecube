import { useState } from "react";
import api from "../../services/api";
import CentreSidebar from "../../components/centre/CentreSidebar";

function WalkIn() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    doctorId: "",
    reason: "",
    paymentMethod: "cash",
    amount: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const response = await api.post("/centre/walk-in", {
        ...form,
        amount: form.amount ? Number(form.amount) : 0,
      });
      setMessage(`Added to queue with Token #${response.data.appointment.tokenNumber}`);
      setForm({ name: "", phone: "", doctorId: "", reason: "", paymentMethod: "cash", amount: "" });
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to add walk-in patient");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <CentreSidebar />

      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold">Walk-in Patient</h1>

        {message && (
          <p className="mt-4 max-w-md rounded-lg bg-blue-50 p-3 text-sm text-blue-700">
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 max-w-md space-y-3 rounded-xl bg-white p-5 shadow">
          <input
            type="text"
            name="name"
            placeholder="Patient Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full rounded-lg border p-3"
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            required
            className="w-full rounded-lg border p-3"
          />

          <input
            type="text"
            name="doctorId"
            placeholder="Doctor ID"
            value={form.doctorId}
            onChange={handleChange}
            required
            className="w-full rounded-lg border p-3"
          />

          <input
            type="text"
            name="reason"
            placeholder="Reason (optional)"
            value={form.reason}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
          />

          <div className="flex gap-3">
            <select
              name="paymentMethod"
              value={form.paymentMethod}
              onChange={handleChange}
              className="w-full rounded-lg border p-3"
            >
              <option value="cash">Cash</option>
              <option value="online">Online</option>
              <option value="none">No payment yet</option>
            </select>
            <input
              type="number"
              name="amount"
              min="0"
              placeholder="Amount (₹)"
              value={form.amount}
              onChange={handleChange}
              className="w-full rounded-lg border p-3"
            />
          </div>

          <button type="submit" className="w-full rounded-lg bg-blue-600 p-3 text-white">
            Add to Queue
          </button>
        </form>
      </main>
    </div>
  );
}

export default WalkIn;
