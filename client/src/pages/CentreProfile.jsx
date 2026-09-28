import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import StatusBadge from "../components/StatusBadge";
import Footer from "../components/Footer";
import BookingFlow from "../components/BookingFlow";
import Logo from "../components/Logo";

function CentreProfile() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [centre, setCentre] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showQr, setShowQr] = useState(false);
  const [bookingDoctor, setBookingDoctor] = useState(null);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/centres/${id}`);
      setCentre(res.data.centre);
      setDoctors(res.data.doctors);
    } catch (err) {
      setError(err.response?.data?.message || "Centre not found");
    } finally {
      setLoading(false);
    }
  };

  const book = (doctor) => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.role !== "patient") {
      alert("Only patient accounts can book appointments.");
      return;
    }
    setBookingDoctor(doctor);
  };

  if (loading) return <div className="p-8">Loading...</div>;

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-gray-50">
        <p className="text-gray-600">{error}</p>
        <Link to="/explore" className="text-blue-600">
          Back to Explore
        </Link>
      </div>
    );
  }

  const bookingUrl = `${window.location.origin}/centre/${id}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex items-center justify-between border-b bg-white p-5">
        <Logo size="md" />
        <div className="flex gap-3">
          <Link to="/explore" className="rounded-lg bg-white px-4 py-2 shadow">
            ← Explore
          </Link>
          <button
            onClick={() => setShowQr((v) => !v)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white"
          >
            {showQr ? "Hide QR" : "Show QR Code"}
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-6 py-8">
        {showQr && (
          <div className="mb-6 flex flex-col items-center gap-3 rounded-xl bg-white p-6 shadow">
            <QRCodeSVG value={bookingUrl} size={180} />
            <p className="text-sm text-gray-500">Scan to open {centre.name} on CareCube</p>
            <p className="break-all text-xs text-gray-400">{bookingUrl}</p>
          </div>
        )}

        <div className="rounded-xl bg-white p-6 shadow">
          <h1 className="text-2xl font-bold">{centre.name}</h1>
          <p className="mt-1 capitalize text-blue-600">{centre.type}</p>
          <p className="mt-2 text-gray-500">
            {centre.address}
            {centre.city ? `, ${centre.city}` : ""}
          </p>
          {centre.openingHours && (
            <p className="mt-1 text-sm text-gray-400">Hours: {centre.openingHours}</p>
          )}
          {centre.facilities?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {centre.facilities.map((f) => (
                <span key={f} className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                  {f}
                </span>
              ))}
            </div>
          )}
        </div>

        <h2 className="mt-8 text-xl font-bold">Available Doctors</h2>
        <div className="mt-4 space-y-4">
          {doctors.length === 0 && (
            <p className="text-gray-500">No doctors associated with this centre yet.</p>
          )}

          {doctors.map((doctor) => (
            <div key={doctor._id} className="rounded-xl bg-white p-5 shadow">
              <div className="flex items-start justify-between">
                <div>
                  <Link to={`/doctor/${doctor._id}`} className="font-bold hover:underline">
                    Dr. {doctor.name}
                  </Link>
                  <p className="text-sm text-blue-600">{doctor.specialization}</p>
                  <p className="text-sm text-gray-500">{doctor.qualification}</p>
                </div>
                <StatusBadge
                  status={doctor.todayStatus.status}
                  delayMinutes={doctor.todayStatus.delayMinutes}
                />
              </div>

              {doctor.schedule.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-500">
                  {doctor.schedule.map((s) => (
                    <span key={s._id} className="rounded-full bg-gray-100 px-3 py-1">
                      {s.day}: {s.startTime}–{s.endTime}
                    </span>
                  ))}
                </div>
              )}

              <button
                onClick={() => book(doctor)}
                disabled={
                  doctor.todayStatus.status === "unavailable" ||
                  doctor.todayStatus.status === "holiday"
                }
                className="mt-4 rounded-lg bg-green-600 px-5 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                Book Appointment
              </button>
            </div>
          ))}
        </div>
      </section>

      {bookingDoctor && (
        <BookingFlow
          doctor={bookingDoctor}
          centre={{ _id: id, name: centre.name, address: centre.address }}
          schedule={bookingDoctor.schedule}
          onClose={() => setBookingDoctor(null)}
        />
      )}

      <Footer />
    </div>
  );
}

export default CentreProfile;
