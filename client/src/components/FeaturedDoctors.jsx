import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function DoctorAvatar({ doctor }) {
  if (doctor.photoUrl) {
    return (
      <img
        src={doctor.photoUrl}
        alt={doctor.name}
        className="h-24 w-24 rounded-full object-cover ring-4 ring-blue-50"
      />
    );
  }
  return (
    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-100 text-3xl font-bold text-blue-600 ring-4 ring-blue-50">
      {doctor.name?.[0] || "D"}
    </div>
  );
}

function FeaturedDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/doctors", { params: { limit: 8 } })
      .then((res) => setDoctors(res.data.doctors))
      .catch(() => setDoctors([]))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && doctors.length === 0) return null;

  return (
    <section className="bg-gray-50 py-14">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold">Meet Our Doctors</h2>
            <p className="mt-2 text-gray-500">
              Verified doctors across specialities, ready to see you today.
            </p>
          </div>
          <Link to="/explore" className="hidden text-blue-600 hover:underline md:block">
            View all doctors →
          </Link>
        </div>

        {loading ? (
          <p className="mt-10 text-center text-gray-400">Loading doctors...</p>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {doctors.map((doctor) => (
              <Link
                key={doctor._id}
                to={`/doctor/${doctor._id}`}
                className="flex flex-col items-center rounded-2xl bg-white p-6 text-center shadow transition hover:-translate-y-1 hover:shadow-lg"
              >
                <DoctorAvatar doctor={doctor} />
                <h3 className="mt-4 font-bold">Dr. {doctor.name}</h3>
                <p className="text-sm text-blue-600">{doctor.specialization}</p>
                <p className="mt-1 text-xs text-gray-400">
                  {doctor.experience ? `${doctor.experience} experience` : doctor.qualification}
                </p>
                {doctor.chambers?.[0] && (
                  <p className="mt-2 text-xs text-gray-400">
                    📍 {doctor.chambers[0].name}
                    {doctor.chambers[0].city ? `, ${doctor.chambers[0].city}` : ""}
                  </p>
                )}
                <span className="mt-4 w-full rounded-lg bg-blue-600 py-2 text-sm font-medium text-white">
                  Book Appointment
                </span>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-8 text-center md:hidden">
          <Link to="/explore" className="text-blue-600 hover:underline">
            View all doctors →
          </Link>
        </div>
      </div>
    </section>
  );
}

export default FeaturedDoctors;
