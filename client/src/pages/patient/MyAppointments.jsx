import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Logo from "../../components/Logo";

function paymentBadge(status) {
  const map = {
    paid: "bg-green-100 text-green-700",
    cash: "bg-blue-100 text-blue-700",
    pending: "bg-yellow-100 text-yellow-700",
    unpaid: "bg-gray-100 text-gray-600",
    refunded: "bg-red-100 text-red-700",
  };
  return map[status] || map.pending;
}

function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [queueInfo, setQueueInfo] = useState({});
  const [reviewingId, setReviewingId] = useState("");
  const [reviewed, setReviewed] = useState({});
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const response = await api.get("/appointments/my");
    setAppointments(response.data.appointments);

    response.data.appointments.forEach(async (appt) => {
      try {
        const q = await api.get(`/appointments/${appt._id}/queue-status`);
        setQueueInfo((prev) => ({ ...prev, [appt._id]: q.data }));
      } catch (e) {
        // ignore
      }
    });
  };

  const submitReview = async (id) => {
    try {
      await api.post(`/appointments/${id}/review`, { rating, comment });
      setReviewed((prev) => ({ ...prev, [id]: true }));
      setReviewingId("");
      setComment("");
      setRating(5);
    } catch (error) {
      const msg = error.response?.data?.message || "Could not submit review";
      if (msg.includes("already")) setReviewed((prev) => ({ ...prev, [id]: true }));
      alert(msg);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex items-center justify-between">
        <div>
          <Logo size="sm" />
          <h1 className="text-2xl font-bold">My Appointments</h1>
        </div>
        <Link to="/patient/dashboard" className="rounded-lg bg-white px-4 py-2 shadow">
          Back to search
        </Link>
      </div>

      <div className="mt-6 space-y-4">
        {appointments.length === 0 && <p className="text-gray-500">No appointments yet.</p>}

        {appointments.map((appt) => {
          const q = queueInfo[appt._id];
          return (
            <div key={appt._id} className="rounded-xl bg-white p-5 shadow">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-bold">Dr. {appt.doctorId?.name}</h3>
                  <p className="text-gray-500">{appt.centreId?.name}</p>
                </div>
                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm">
                  Token #{appt.tokenNumber}
                </span>
              </div>

              {q && (
                <div className="mt-3 rounded-lg bg-gray-50 p-3 text-sm">
                  <p>Current Token: {q.currentToken ?? "—"}</p>
                  <p>Your Token: {q.yourToken}</p>
                  <p>{q.patientsAhead} patients ahead</p>
                </div>
              )}

              <p className="mt-2 text-sm text-gray-500">Status: {appt.status}</p>
              <span
                className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium capitalize ${paymentBadge(
                  appt.paymentStatus
                )}`}
              >
                Payment: {appt.paymentStatus}
                {appt.amount ? ` · ₹${appt.amount}` : ""}
              </span>

              <p className="mt-2 text-xs text-gray-400">
                {new Date(appt.appointmentDate).toLocaleDateString()}
              </p>

              {appt.status === "completed" && !reviewed[appt._id] && reviewingId !== appt._id && (
                <button
                  onClick={() => setReviewingId(appt._id)}
                  className="mt-3 block rounded-lg bg-yellow-50 px-4 py-2 text-sm text-yellow-700"
                >
                  ⭐ Rate this visit
                </button>
              )}
              {reviewed[appt._id] && (
                <p className="mt-3 text-sm text-green-600">Thanks for your review!</p>
              )}
              {reviewingId === appt._id && (
                <div className="mt-3 rounded-lg border p-3">
                  <div className="flex gap-1 text-2xl">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        onClick={() => setRating(n)}
                        className={n <= rating ? "text-yellow-500" : "text-gray-300"}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience (optional)"
                    rows={2}
                    maxLength={500}
                    className="mt-2 w-full rounded-lg border p-2 text-sm"
                  />
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => submitReview(appt._id)}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white"
                    >
                      Submit
                    </button>
                    <button
                      onClick={() => setReviewingId("")}
                      className="rounded-lg bg-white px-4 py-2 text-sm ring-1 ring-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MyAppointments;
