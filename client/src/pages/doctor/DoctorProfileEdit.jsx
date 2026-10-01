import { useEffect, useState } from "react";
import api from "../../services/api";
import DoctorSidebar from "../../components/doctor/DoctorSidebar";
import { fileToCompressedDataUrl } from "../../utils/image";
import {
  UserRound,
  Phone,
  Stethoscope,
  GraduationCap,
  BriefcaseBusiness,
  IndianRupee,
  Tags,
  BookOpen,
  FileText,
  Camera,
  Save,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";

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
      setMessage("Unable to load your profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const dataUrl = await fileToCompressedDataUrl(file, 400, 0.8);

      setForm((prev) => ({
        ...prev,
        photoUrl: dataUrl,
      }));
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

      setMessage("Profile updated successfully.");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Unable to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <DoctorSidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="animate-pulse space-y-5">
            <div className="h-8 w-48 rounded-lg bg-slate-200" />
            <div className="h-4 w-80 rounded bg-slate-200" />
            <div className="h-96 max-w-5xl rounded-2xl bg-white shadow-sm" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f8fc]">
      <div className="flex min-h-screen">
        <DoctorSidebar />

        <main className="min-w-0 flex-1">
          {/* Header */}
          <div className="border-b border-slate-200 bg-white">
            <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <UserRound size={21} />
                    </div>

                    <div>
                      <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                        My Profile
                      </h1>

                      <p className="text-sm text-slate-500">
                        Manage your professional information
                      </p>
                    </div>
                  </div>
                </div>

                <div className="hidden items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 sm:flex">
                  <CheckCircle2 size={16} />
                  Profile settings
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-7xl px-4 py-5 pb-28 sm:px-6 sm:py-7 lg:px-8">
            {/* Message */}
            {message && (
              <div
                className={`mb-5 flex items-start gap-3 rounded-xl border p-4 text-sm ${
                  message.includes("successfully")
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-red-200 bg-red-50 text-red-700"
                }`}
              >
                {message.includes("successfully") ? (
                  <CheckCircle2 className="mt-0.5 shrink-0" size={18} />
                ) : (
                  <AlertCircle className="mt-0.5 shrink-0" size={18} />
                )}

                <span>{message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
                {/* LEFT PROFILE CARD */}
                <aside className="h-fit lg:sticky lg:top-6">
                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="h-24 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600" />

                    <div className="-mt-12 px-5 pb-6">
                      <div className="relative mx-auto w-fit">
                        {form.photoUrl ? (
                          <img
                            src={form.photoUrl}
                            alt="Doctor profile"
                            className="h-24 w-24 rounded-2xl border-4 border-white object-cover shadow-lg"
                          />
                        ) : (
                          <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-white bg-blue-100 text-3xl font-bold text-blue-600 shadow-lg">
                            {form.name?.[0]?.toUpperCase() || "D"}
                          </div>
                        )}

                        <label className="absolute -bottom-2 -right-2 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-4 border-white bg-blue-600 text-white shadow-md transition hover:bg-blue-700">
                          <Camera size={16} />

                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhoto}
                            className="hidden"
                          />
                        </label>
                      </div>

                      <div className="mt-4 text-center">
                        <h2 className="text-lg font-bold text-slate-900">
                          {form.name || "Doctor Name"}
                        </h2>

                        <p className="mt-1 text-sm text-blue-600">
                          {form.specialization || "Medical Specialist"}
                        </p>

                        {form.qualification && (
                          <p className="mt-2 text-xs text-slate-500">
                            {form.qualification}
                          </p>
                        )}
                      </div>

                      <label className="mt-5 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
                        <Camera size={17} />

                        {uploading ? "Processing..." : "Change photo"}

                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhoto}
                          className="hidden"
                        />
                      </label>

                      <div className="mt-5 rounded-xl bg-blue-50 p-4">
                        <div className="flex gap-3">
                          <Sparkles
                            size={18}
                            className="mt-0.5 shrink-0 text-blue-600"
                          />

                          <div>
                            <p className="text-sm font-semibold text-blue-900">
                              Make your profile complete
                            </p>

                            <p className="mt-1 text-xs leading-5 text-blue-700">
                              Complete information helps patients understand
                              your expertise and services.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </aside>

                {/* RIGHT CONTENT */}
                <div className="space-y-6">
                  {/* Basic Information */}
                  <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <SectionHeader
                      icon={<UserRound size={19} />}
                      title="Basic Information"
                      description="Your primary information visible to patients."
                    />

                    <div className="grid gap-5 p-5 sm:p-6 md:grid-cols-2">
                      <InputField
                        label="Full name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Dr. John Doe"
                        icon={<UserRound size={17} />}
                        required
                      />

                      <InputField
                        label="Phone number"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        icon={<Phone size={17} />}
                      />

                      <InputField
                        label="Qualification"
                        name="qualification"
                        value={form.qualification}
                        onChange={handleChange}
                        placeholder="MBBS, MD"
                        icon={<GraduationCap size={17} />}
                      />

                      <InputField
                        label="Experience"
                        name="experience"
                        value={form.experience}
                        onChange={handleChange}
                        placeholder="5 years"
                        icon={<BriefcaseBusiness size={17} />}
                      />
                    </div>
                  </section>

                  {/* Professional Information */}
                  <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <SectionHeader
                      icon={<Stethoscope size={19} />}
                      title="Professional Information"
                      description="Tell patients about your specialization and consultation."
                    />

                    <div className="grid gap-5 p-5 sm:p-6 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          Specialization
                        </label>

                        <div className="relative">
                          <Stethoscope
                            size={17}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                          />

                          <select
                            name="specialization"
                            value={form.specialization}
                            onChange={handleChange}
                            className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                          >
                            <option value="">
                              Select specialization
                            </option>

                            {SPECIALIZATIONS.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <InputField
                        label="Consultation fee"
                        name="consultationFee"
                        type="number"
                        min="0"
                        value={form.consultationFee}
                        onChange={handleChange}
                        placeholder="500"
                        icon={<IndianRupee size={17} />}
                        prefix="₹"
                      />

                      <div className="md:col-span-2">
                        <InputField
                          label="Specialization tags"
                          name="specializationTags"
                          value={form.specializationTags}
                          onChange={handleChange}
                          placeholder="Acne Treatment, Skin Allergy, Diabetes"
                          icon={<Tags size={17} />}
                          helper="Separate multiple specializations with commas."
                        />
                      </div>
                    </div>
                  </section>

                  {/* Education */}
                  <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <SectionHeader
                      icon={<BookOpen size={19} />}
                      title="Education & Credentials"
                      description="Add your educational background and qualifications."
                    />

                    <div className="p-5 sm:p-6">
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Education
                      </label>

                      <div className="relative">
                        <BookOpen
                          size={17}
                          className="absolute left-3 top-3.5 text-slate-400"
                        />

                        <textarea
                          name="education"
                          value={form.education}
                          onChange={handleChange}
                          rows={4}
                          placeholder={`MBBS – AIIMS Delhi
MD Dermatology – AIIMS Delhi
Fellowship in Dermatology`}
                          className="w-full resize-y rounded-xl border border-slate-200 bg-white px-10 py-3 text-sm leading-6 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                        />
                      </div>
                    </div>
                  </section>

                  {/* About */}
                  <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <SectionHeader
                      icon={<FileText size={19} />}
                      title="About You"
                      description="Write a short professional introduction for patients."
                    />

                    <div className="p-5 sm:p-6">
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Professional bio
                      </label>

                      <textarea
                        name="bio"
                        value={form.bio}
                        onChange={handleChange}
                        rows={6}
                        maxLength={1000}
                        placeholder="Tell patients about your experience, expertise, treatment approach and areas of interest..."
                        className="w-full resize-y rounded-xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                      />

                      <div className="mt-2 flex justify-end text-xs text-slate-400">
                        {form.bio.length}/1000
                      </div>
                    </div>
                  </section>
                </div>
              </div>

              {/* STICKY SAVE BAR */}
              <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-3 shadow-[0_-8px_30px_rgba(15,23,42,0.08)] backdrop-blur">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
                  <div className="hidden sm:block">
                    <p className="text-sm font-semibold text-slate-800">
                      Keep your profile updated
                    </p>
                    <p className="text-xs text-slate-500">
                      Changes will be visible on your public profile.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={saving || uploading}
                    className="ml-auto flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                  >
                    <Save size={18} />

                    {saving ? "Saving changes..." : "Save Profile"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}

/* -------------------------------------------------
   Reusable Components
------------------------------------------------- */

function SectionHeader({ icon, title, description }) {
  return (
    <div className="flex items-start gap-3 border-b border-slate-100 p-5 sm:p-6">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        {icon}
      </div>

      <div>
        <h2 className="text-base font-bold text-slate-900 sm:text-lg">
          {title}
        </h2>

        <p className="mt-0.5 text-xs leading-5 text-slate-500 sm:text-sm">
          {description}
        </p>
      </div>
    </div>
  );
}

function InputField({
  label,
  name,
  value,
  onChange,
  placeholder,
  icon,
  type = "text",
  min,
  required,
  helper,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <div className="relative">
        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </div>

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          min={min}
          required={required}
          className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
        />
      </div>

      {helper && (
        <p className="mt-1.5 text-xs text-slate-400">
          {helper}
        </p>
      )}
    </div>
  );
}

export default DoctorProfileEdit;