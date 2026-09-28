import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { getUpcomingDatesForSchedule } from "../utils/scheduleDates";

const STEPS = ["Patient details", "Review", "Payment", "Confirmed"];

// 4-step booking: patient details -> review -> payment -> confirmation (token)
function BookingFlow({ doctor, centre, schedule, onClose }) {
  const { user } = useAuth();
  const dates = getUpcomingDatesForSchedule(schedule);
  const [step, setStep] = useState(0);
  const [date, setDate] = useState(dates[0]?.date || new Date());
  const [details, setDetails] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    age: "",
    gender: "",
    reason: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [appointment, setAppointment] = useState(null);

  const fee = doctor.consultationFee || 0;
  const set = (e) => setDetails({ ...details, [e.target.name]: e.target.value });

  const canContinue = details.name.trim() && details.phone.trim();

  const confirm = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await api.post("/appointments/book", {
        doctorId: doctor._id,
        centreId: centre._id,
        appointmentDate: date.toISOString(),
        reason: details.reason,
        paymentMethod,
        amount: fee,
        patientDetails: {
          name: details.name,
          phone: details.phone,
          age: details.age,
          gender: details.gender,
        },
      });
      setAppointment(res.data.appointment);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed");
    } finally {
      setSaving(false);
    }
  };

  const row = (label, value) => (
    <div className="flex justify-between border-b py-2 text-sm last:border-b-0">
      <span className="text-gray-500">{label}</span>
      <span className="text-right font-medium">{value || "—"}</span>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold">Book Appointment</h2>
            <p className="text-sm text-gray-500">Dr. {doctor.name} · {centre.name}</p>
          </div>
          {step < 3 && (
            <button onClick={onClose} className="text-2xl leading-none text-gray-400">×</button>
          )}
        </div>

        <div className="mt-4 flex gap-1">
          {STEPS.map((s, i) => (
            <div key={s} className="flex-1">
              <div className={`h-1.5 rounded-full ${i <= step ? "bg-blue-600" : "bg-gray-200"}`} />
              <p className={`mt-1 text-[11px] ${i === step ? "font-semibold text-blue-600" : "text-gray-400"}`}>{s}</p>
            </div>
          ))}
        </div>

        {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}

        {step === 0 && (
          <div className="mt-5 space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-700">Choose a date</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {dates.length === 0 && <p className="text-sm text-gray-400">No upcoming days in the schedule.</p>}
                {dates.map((d) => (
                  <button
                    key={d.label}
                    type="button"
                    onClick={() => setDate(d.date)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                      date.toDateString() === d.date.toDateString() ? "bg-blue-600 text-white" : "bg-white text-gray-600 ring-1 ring-gray-300"
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
            <input name="name" placeholder="Patient full name *" value={details.name} onChange={set} className="w-full rounded-lg border p-3" />
            <input name="phone" placeholder="Phone number *" value={details.phone} onChange={set} className="w-full rounded-lg border p-3" />
            <div className="flex gap-3">
              <input name="age" type="number" min="0" max="120" placeholder="Age" value={details.age} onChange={set} className="w-full rounded-lg border p-3" />
              <select name="gender" value={details.gender} onChange={set} className="w-full rounded-lg border p-3">
                <option value="">Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <textarea name="reason" placeholder="Reason for visit (optional)" rows={2} value={details.reason} onChange={set} className="w-full rounded-lg border p-3" />
            <button disabled={!canContinue || dates.length === 0} onClick={() => setStep(1)} className="w-full rounded-lg bg-blue-600 p-3 text-white disabled:opacity-50">
              Continue to review
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="mt-5">
            <div className="rounded-xl bg-gray-50 px-4 py-2">
              {row("Doctor", `Dr. ${doctor.name}`)}
              {row("Centre", centre.name)}
              {row("Date", date.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short", year: "numeric" }))}
              {row("Patient", details.name)}
              {row("Phone", details.phone)}
              {row("Age / Gender", [details.age, details.gender].filter(Boolean).join(" / "))}
              {row("Reason", details.reason)}
              {row("Consultation fee", fee > 0 ? `₹${fee}` : "Pay at clinic")}
            </div>
            <div className="mt-4 flex gap-2">
              <button onClick={() => setStep(0)} className="w-1/3 rounded-lg bg-white p-3 ring-1 ring-gray-300">Edit</button>
              <button onClick={() => setStep(2)} className="w-2/3 rounded-lg bg-blue-600 p-3 text-white">Continue to payment</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="mt-5 space-y-3">
            <p className="text-sm font-medium text-gray-700">Payment method — {fee > 0 ? `₹${fee}` : "fee set by clinic"}</p>
            {[
              ["cash", "Pay at clinic (cash)", "Pay when you visit. Recorded as Cash."],
              ["online", "Pay online (later)", "Marked Pending. Online payment gateway is not enabled yet — the clinic will confirm payment."],
            ].map(([key, title, desc]) => (
              <label key={key} className={`block cursor-pointer rounded-xl border p-4 ${paymentMethod === key ? "border-blue-600 bg-blue-50" : ""}`}>
                <input type="radio" className="mr-2" checked={paymentMethod === key} onChange={() => setPaymentMethod(key)} />
                <span className="font-medium">{title}</span>
                <p className="ml-6 mt-1 text-xs text-gray-500">{desc}</p>
              </label>
            ))}
            <div className="flex gap-2 pt-2">
              <button onClick={() => setStep(1)} className="w-1/3 rounded-lg bg-white p-3 ring-1 ring-gray-300">Back</button>
              <button onClick={confirm} disabled={saving} className="w-2/3 rounded-lg bg-green-600 p-3 text-white disabled:opacity-60">
                {saving ? "Booking..." : "Confirm Booking"}
              </button>
            </div>
          </div>
        )}

        {step === 3 && appointment && (
          <div className="mt-5 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl">✓</div>
            <h3 className="mt-3 text-lg font-bold">Appointment confirmed</h3>
            <p className="mt-1 text-sm text-gray-500">Your token number</p>
            <p className="text-5xl font-extrabold text-blue-600">#{appointment.tokenNumber}</p>
            <div className="mt-4 rounded-xl bg-gray-50 px-4 py-2 text-left">
              {row("Doctor", `Dr. ${appointment.doctorId?.name || doctor.name}`)}
              {row("Centre", appointment.centreId?.name || centre.name)}
              {row("Date", new Date(appointment.appointmentDate).toLocaleDateString())}
              {row("Patient", appointment.patientDetails?.name)}
              {row("Payment", `${appointment.paymentStatus}${appointment.amount ? ` · ₹${appointment.amount}` : ""}`)}
              {row("Status", "Waiting for the clinic to accept")}
            </div>
            <p className="mt-3 text-xs text-gray-400">You'll get a notification when the clinic accepts, and can track the live queue in My Appointments.</p>
            <div className="mt-4 flex gap-2">
              <button onClick={onClose} className="w-1/2 rounded-lg bg-white p-3 ring-1 ring-gray-300">Close</button>
              <Link to="/patient/appointments" className="w-1/2 rounded-lg bg-blue-600 p-3 text-white">My Appointments</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookingFlow;
