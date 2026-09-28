import { useEffect, useState } from "react";
import api from "../../services/api";
import DoctorSidebar from "../../components/doctor/DoctorSidebar";
import { fileToCompressedDataUrl } from "../../utils/image";

const SPECIALIZATIONS = [
  "General Physician",
  "ENT",
  "Cardiologist",
  "Dentist",
  "Dermatologist",
  "Orthopedic",
  "Gynecologist",
  "Pediatrician",
];

function DoctorProfileEdit() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    specialization: "",
    qualification: "",
    experience: "",
    bio: "",
    photoUrl: "",
    consultationFee: "",
    education: "",
    specializationTags: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await api.get("/doctor/profile");
      const d = res.data.doctor;
      setForm({
        name: d.name || "",
        phone: d.phone || "",
        specialization: d.specialization || "",
        qualification: d.qualification || "",
        experience: d.experience || "",
        bio: d.bio || "",
        photoUrl: d.photoUrl || "",
        consultationFee: d.consultationFee || "",
        education: d.education || "",
        specializationTags: (d.specializationTags || []).join(", "),
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const dataUrl = await fileToCompressedDataUrl(file, 400, 0.8);
      setForm((prev) => ({ ...prev, photoUrl: dataUrl }));
    } catch (error) {
      alert("Could not process that image. Try a different file.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      await api.patch("/doctor/profile", {
        ...form,
        consultationFee: Number(form.consultationFee) || 0,
        specializationTags: form.specializationTags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      });
      setMessage("Profile updated.");
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <DoctorSidebar />
        <main className="flex-1 p-6">Loading...</main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DoctorSidebar />

      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="mt-1 text-gray-500">
          This is what patients see on your public profile and in search results.
        </p>

        {message && (
          <p className="mt-4 max-w-lg rounded-lg bg-blue-50 p-3 text-sm text-blue-700">
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 max-w-lg space-y-4 rounded-xl bg-white p-6 shadow">
          <div className="flex items-center gap-4">
            {form.photoUrl ? (
              <img
                src={form.photoUrl}
                alt="Profile"
                className="h-20 w-20 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-600">
                {form.name?.[0] || "D"}
              </div>
            )}
            <label className="cursor-pointer rounded-lg bg-gray-100 px-4 py-2 text-sm hover:bg-gray-200">
              {uploading ? "Processing..." : "Upload photo"}
              <input type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
            </label>
          </div>

          <input
            type="text"
            name="name"
            placeholder="Full name"
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
          />

          <select
            name="specialization"
            value={form.specialization}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
          >
            <option value="">Select specialization</option>
            {SPECIALIZATIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="qualification"
            placeholder="Qualification (e.g. MBBS, MD)"
            value={form.qualification}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
          />

          <input
            type="text"
            name="experience"
            placeholder="Experience (e.g. 5 years)"
            value={form.experience}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
          />

          <input
            type="number"
            min="0"
            name="consultationFee"
            placeholder="Consultation fee (₹)"
            value={form.consultationFee}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
          />

          <input
            type="text"
            name="specializationTags"
            placeholder="Specializations, comma separated (Acne Treatment, Skin Allergy)"
            value={form.specializationTags}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
          />

          <textarea
            name="education"
            placeholder="Education — one item per line (MBBS – AIIMS, MD Dermatology...)"
            value={form.education}
            onChange={handleChange}
            rows={3}
            className="w-full rounded-lg border p-3"
          />

          <textarea
            name="bio"
            placeholder="Short professional description patients will see"
            value={form.bio}
            onChange={handleChange}
            rows={4}
            className="w-full rounded-lg border p-3"
          />

          <button
            type="submit"
            disabled={saving || uploading}
            className="w-full rounded-lg bg-blue-600 p-3 text-white disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </main>
    </div>
  );
}

export default DoctorProfileEdit;
