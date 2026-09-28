import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import StatusBadge from "../components/StatusBadge";
import Footer from "../components/Footer";
import BookingFlow from "../components/BookingFlow";
import { getUpcomingDatesForSchedule } from "../utils/scheduleDates";
import Logo from "../components/Logo";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const HIGHLIGHTS = [
  "Clean & Safe Environment",
  "Modern Treatment Facilities",
  "Patient Friendly Staff",
  "Easy Appointment Booking",
];

function Stars({ value }) {
  return (
    <span className="text-yellow-500">
      {"★".repeat(Math.round(value))}
      <span className="text-gray-300">{"★".repeat(5 - Math.round(value))}</span>
    </span>
  );
}

function DoctorProfile() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [chambers, setChambers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("about");

  const [bookingCentreId, setBookingCentreId] = useState("");

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/doctors/${id}`);
      setDoctor(res.data.doctor);
      setChambers(res.data.chambers);
      setReviews(res.data.reviews || []);
    } catch (err) {
      setError(err.response?.data?.message || "Doctor not found");
    } finally {
      setLoading(false);
    }
  };

  const startBooking = (centreId, schedule) => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.role !== "patient") {
      alert("Only patient accounts can book appointments.");
      return;
    }
    setBookingCentreId(centreId);
  };

  if (loading) return <div className="p-8">Loading...</div>;

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-gray-50">
        <p className="text-gray-600">{error}</p>
        <Link to="/explore" className="text-blue-600">Back to Explore</Link>
      </div>
    );
  }

  const primary = chambers[0];
  const anyAvailable = chambers.some(
    (c) => c.todayStatus.status !== "unavailable" && c.todayStatus.status !== "holiday"
  );
  const primaryTimes = primary?.schedule?.[0]
    ? `${primary.schedule[0].startTime} – ${primary.schedule[0].endTime}`
    : null;

  // Upcoming available days across all chambers (next 3 matching dates per chamber)
  const availableDays = chambers
    .flatMap(({ centre, schedule }) =>
      getUpcomingDatesForSchedule(schedule, 3, 14).map((d) => ({
        date: d.date,
        centre,
        slots: schedule.filter((s) => s.day === DAY_NAMES[d.date.getDay()]),
      }))
    )
    .sort((a, b) => a.date - b.date)
    .slice(0, 6);

  const tags = doctor.specializationTags || [];
  const educationLines = (doctor.education || "").split("\n").map((l) => l.trim()).filter(Boolean);
  const bookingChamber = chambers.find((c) => c.centre._id === bookingCentreId);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex items-center justify-between border-b bg-white p-5">
        <Logo size="md" />
        <Link to="/explore" className="rounded-lg bg-white px-4 py-2 shadow">← Back to Doctors</Link>
      </header>

      <section className="mx-auto max-w-4xl space-y-6 px-6 py-8">
        {/* Hero */}
        <div className="rounded-2xl bg-white p-6 shadow">
          <div className="flex flex-col gap-5 md:flex-row md:items-center">
            {doctor.photoUrl ? (
              <img src={doctor.photoUrl} alt={doctor.name} className="h-28 w-28 rounded-full object-cover ring-4 ring-blue-50" />
            ) : (
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-blue-100 text-4xl font-bold text-blue-600">
                {doctor.name?.[0]}
              </div>
            )}

            <div className="flex-1">
              {doctor.verificationStatus === "verified" ? (
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">✓ VERIFIED DOCTOR</span>
              ) : (
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">Verification pending</span>
              )}
              <h1 className="mt-2 text-3xl font-bold">Dr. {doctor.name}</h1>
              <p className="text-lg text-blue-600">{doctor.specialization}</p>

              <div className="mt-2 space-y-1 text-sm text-gray-600">
                <p>
                  ⭐{" "}
                  {doctor.avgRating
                    ? `${doctor.avgRating} Rating (Based on ${doctor.reviewCount} review${doctor.reviewCount > 1 ? "s" : ""})`
                    : "No reviews yet"}
                </p>
                {doctor.experience && <p>💼 {doctor.experience} Experience</p>}
                {primary && (
                  <p>
                    📍 {primary.centre.city || primary.centre.address}
                  </p>
                )}
                {primary && <p>🏥 {primary.centre.name}</p>}
              </div>
            </div>

            <div className="rounded-xl bg-gray-50 p-4 text-sm md:min-w-[210px]">
              <p className={anyAvailable ? "font-semibold text-green-600" : "font-semibold text-red-600"}>
                ● {anyAvailable ? "Available" : "Not available today"}
              </p>
              <p className="mt-2 text-gray-500">Consultation Fee</p>
              <p className="text-xl font-bold">{doctor.consultationFee > 0 ? `₹${doctor.consultationFee}` : "Ask at clinic"}</p>
              {primaryTimes && (
                <>
                  <p className="mt-2 text-gray-500">Available Time</p>
                  <p className="font-medium">{primaryTimes}</p>
                </>
              )}
              {primary && (
                <button
                  onClick={() => startBooking(primary.centre._id, primary.schedule)}
                  disabled={!anyAvailable}
                  className="mt-4 w-full rounded-lg bg-blue-600 py-2 font-medium text-white disabled:opacity-40"
                >
                  Book Appointment →
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Available Days */}
        <div className="rounded-2xl bg-white p-6 shadow">
          <h2 className="text-xl font-bold">📅 Available Days</h2>
          <p className="mt-1 text-sm text-gray-500">
            Dr. {doctor.name} is available on the following dates.
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {availableDays.length === 0 && <p className="text-gray-400">No schedule published yet.</p>}
            {availableDays.map((d, i) => (
              <div key={i} className="rounded-xl border p-4">
                <p className="font-semibold">🟢 {DAY_NAMES[d.date.getDay()]}</p>
                <p className="text-sm text-gray-500">
                  {d.date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
                </p>
                <p className="mt-1 text-xs font-medium text-green-600">Available</p>
                <p className="mt-2 text-sm">📍 {d.centre.name}</p>
                <div className="mt-1 flex flex-wrap gap-1 text-xs text-gray-500">
                  {d.slots.map((s) => (
                    <span key={s._id} className="rounded bg-gray-100 px-2 py-1">{s.startTime} – {s.endTime}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="rounded-2xl bg-white p-6 shadow">
          <div className="flex gap-2 border-b pb-3">
            {[
              ["about", "👤 About"],
              ["experience", "💼 Experience"],
              ["education", "🎓 Education"],
              ["reviews", `⭐ Reviews (${reviews.length})`],
            ].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`rounded-lg px-4 py-2 text-sm font-medium ${tab === key ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="pt-5">
            {tab === "about" && (
              <div>
                <h3 className="text-lg font-bold">About Dr. {doctor.name}</h3>
                <p className="mt-2 text-gray-600">
                  {doctor.bio || `Dr. ${doctor.name} is a ${doctor.specialization || "doctor"} at CareCube.`}
                </p>
                {tags.length > 0 && (
                  <>
                    <h4 className="mt-5 font-semibold">💊 Specializations</h4>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {tags.map((t) => (
                        <span key={t} className="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700">{t}</span>
                      ))}
                    </div>
                  </>
                )}
                <p className="mt-5 rounded-lg bg-green-50 p-3 text-sm text-green-700">
                  🛡️ Your health is our priority. Book an appointment with Dr. {doctor.name} for personalized care.
                </p>
              </div>
            )}

            {tab === "experience" && (
              <div>
                <h3 className="text-lg font-bold">💼 Experience</h3>
                <p className="mt-2 text-gray-600">
                  {doctor.experience
                    ? `Dr. ${doctor.name} has ${doctor.experience} of experience in ${doctor.specialization || "patient care"}.`
                    : "Experience details not added yet."}
                </p>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-gray-600">
                  {doctor.experience && <li>{doctor.experience} of {doctor.specialization} Experience</li>}
                  <li>Patient Consultation &amp; Follow-up</li>
                  <li>Personalized Treatment Planning</li>
                </ul>
              </div>
            )}

            {tab === "education" && (
              <div>
                <h3 className="text-lg font-bold">🎓 Education</h3>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-gray-600">
                  {doctor.qualification && <li>{doctor.qualification}</li>}
                  {educationLines.map((l, i) => <li key={i}>{l}</li>)}
                  {!doctor.qualification && educationLines.length === 0 && <li>Education details not added yet.</li>}
                </ul>
              </div>
            )}

            {tab === "reviews" && (
              <div>
                <h3 className="text-lg font-bold">⭐ Patient Reviews</h3>
                {reviews.length === 0 && (
                  <p className="mt-2 text-gray-400">No reviews yet. Reviews appear after patients complete a visit.</p>
                )}
                <div className="mt-3 space-y-3">
                  {reviews.map((r) => (
                    <div key={r._id} className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <Stars value={r.rating} />
                        <span className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</span>
                      </div>
                      {r.comment && <p className="mt-1 text-gray-600">{r.comment}</p>}
                      <p className="mt-1 text-xs text-gray-400">— {r.patientName}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Chambers + booking */}
        <div className="rounded-2xl bg-white p-6 shadow" id="booking-panel">
          <h2 className="text-xl font-bold">📍 Chambers &amp; Booking</h2>
          <div className="mt-4 space-y-4">
            {chambers.length === 0 && (
              <p className="rounded-lg bg-yellow-50 p-4 text-sm text-yellow-700">
                Dr. {doctor.name} is not associated with any chamber yet, so online booking isn't open. Please check back soon.
              </p>
            )}
            {chambers.map(({ centre, schedule, todayStatus }) => {
              const disabled = todayStatus.status === "unavailable" || todayStatus.status === "holiday";
              return (
                <div key={centre._id} className="rounded-xl border p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <Link to={`/centre/${centre._id}`} className="font-bold hover:underline">{centre.name}</Link>
                      <p className="text-sm text-gray-500">{centre.address}{centre.city ? `, ${centre.city}` : ""}</p>
                      {centre.openingHours && <p className="text-xs text-gray-400">🕐 {centre.openingHours}</p>}
                    </div>
                    <StatusBadge status={todayStatus.status} delayMinutes={todayStatus.delayMinutes} />
                  </div>
                  {todayStatus.note && <p className="mt-2 text-sm italic text-gray-500">"{todayStatus.note}"</p>}
                  {schedule.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-500">
                      {schedule.map((s) => (
                        <span key={s._id} className="rounded-full bg-gray-100 px-3 py-1">{s.day}: {s.startTime}–{s.endTime}</span>
                      ))}
                    </div>
                  )}
                  {bookingCentreId !== centre._id && (
                    <button
                      onClick={() => startBooking(centre._id, schedule)}
                      disabled={disabled}
                      className="mt-4 rounded-lg bg-green-600 px-5 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Book Appointment
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {bookingChamber && (
            <BookingFlow
              doctor={doctor}
              centre={bookingChamber.centre}
              schedule={bookingChamber.schedule}
              onClose={() => setBookingCentreId("")}
            />
          )}
        </div>

        {/* Location + clinic info */}
        {primary && (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl bg-white p-6 shadow">
              <h2 className="text-lg font-bold">📍 Doctor Location &amp; Directions</h2>
              <p className="mt-2 text-gray-600">
                {primary.centre.name}, {primary.centre.address}{primary.centre.city ? `, ${primary.centre.city}` : ""}.
              </p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${primary.centre.name} ${primary.centre.address} ${primary.centre.city || ""}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm text-white"
              >
                Get Directions →
              </a>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow">
              <h2 className="text-lg font-bold">🏥 Clinic Information</h2>
              <p className="mt-2 font-medium">{primary.centre.name}</p>
              <p className="text-sm text-gray-500">📍 {primary.centre.city || primary.centre.address}</p>
              <p className="mt-1 text-sm text-gray-500">
                🕐 {primary.centre.openingHours || "Clinic schedule: Based on available appointment slots"}
              </p>
              <h3 className="mt-4 font-semibold">⭐ Highlights</h3>
              <ul className="mt-1 space-y-1 text-sm text-gray-600">
                {HIGHLIGHTS.map((h) => <li key={h}>✓ {h}</li>)}
              </ul>
            </div>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}

export default DoctorProfile;
