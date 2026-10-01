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
  Menu,
  X,
  ChevronDown,
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

  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* =====================================================
     LOAD PROFILE
  ===================================================== */

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

  /* =====================================================
     MOBILE SIDEBAR
  ===================================================== */

  const openSidebar = () => {
    setSidebarOpen(true);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (sidebarOpen && window.innerWidth < 1024) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  /* =====================================================
     INPUT CHANGE
  ===================================================== */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =====================================================
     PHOTO UPLOAD
  ===================================================== */

  const handlePhoto = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setUploading(true);
    setMessage("");

    try {
      const dataUrl = await fileToCompressedDataUrl(
        file,
        400,
        0.8
      );

      setForm((prev) => ({
        ...prev,
        photoUrl: dataUrl,
      }));

      setMessage(
        "Profile photo updated. Save your profile to keep it."
      );
    } catch (error) {
      console.error(error);

      setMessage(
        "Could not process that image. Try a different file."
      );
    } finally {
      setUploading(false);
    }
  };

  /* =====================================================
     SUBMIT
  ===================================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setMessage("");

    try {
      await api.patch("/doctor/profile", {
        ...form,

        consultationFee:
          Number(form.consultationFee) || 0,

        specializationTags: form.specializationTags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      });

      setMessage("Profile updated successfully.");
    } catch (error) {
      console.error(error);

      setMessage(
        error.response?.data?.message ||
          "Unable to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f8fc]">

        {/* DESKTOP SIDEBAR */}
        <div className="fixed inset-y-0 left-0 z-50 hidden w-64 lg:block">
          <DoctorSidebar
            isOpen={true}
            onClose={() => {}}
          />
        </div>

        {/* MAIN */}
        <div className="min-h-screen lg:ml-64">

          {/* MOBILE HEADER */}
          <div className="sticky top-0 z-40 flex h-16 items-center border-b border-slate-200 bg-white px-4 lg:hidden">
            <button
              type="button"
              onClick={openSidebar}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm"
            >
              <Menu size={21} />
            </button>

            <div className="ml-3">
              <p className="text-sm font-bold text-slate-900">
                Doctor Panel
              </p>

              <p className="text-[11px] text-slate-500">
                My Profile
              </p>
            </div>
          </div>

          <main className="p-4 sm:p-6 lg:p-8">
            <div className="animate-pulse space-y-5">

              <div className="h-10 w-52 rounded-xl bg-slate-200" />

              <div className="h-4 w-80 max-w-full rounded bg-slate-200" />

              <div className="h-24 rounded-2xl bg-white" />

              <div className="grid gap-6 lg:grid-cols-[300px_1fr]">

                <div className="h-96 rounded-2xl bg-white" />

                <div className="h-[600px] rounded-2xl bg-white" />

              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  /* =====================================================
     MAIN UI
  ===================================================== */

  return (
    <div className="min-h-screen bg-[#f6f8fc]">

      {/* =================================================
          DESKTOP SIDEBAR
      ================================================= */}

      <div className="fixed inset-y-0 left-0 z-50 hidden w-64 lg:block">
        <DoctorSidebar
          isOpen={true}
          onClose={() => {}}
        />
      </div>

      {/* =================================================
          MOBILE SIDEBAR
      ================================================= */}

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-[60] bg-slate-950/40 backdrop-blur-[2px] lg:hidden"
          onClick={closeSidebar}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-[70] w-[280px] max-w-[85vw] transform bg-white shadow-2xl transition-transform duration-300 ease-out lg:hidden ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">

          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
            <div>
              <p className="text-sm font-bold text-slate-900">
                Doctor PANEL
              </p>

              <p className="text-xs text-slate-500">
                CareCube
              </p>
            </div>

            <button
              type="button"
              onClick={closeSidebar}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            >
              <X size={20} />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            <DoctorSidebar
              isOpen={true}
              onClose={closeSidebar}
            />
          </div>

        </div>
      </div>

      {/* =================================================
          PAGE CONTENT

          IMPORTANT:
          Desktop sidebar fixed hai.
          Isliye yahan lg:ml-64 diya gaya hai.
          Sidebar content ko push nahi karega.
      ================================================= */}

      <div className="min-h-screen lg:ml-64">

        {/* =================================================
            MOBILE TOP BAR

            Desktop par completely hidden.
        ================================================= */}

        <div className="sticky top-0 z-40 flex h-16 items-center border-b border-slate-200 bg-white/95 px-4 backdrop-blur lg:hidden">

          <button
            type="button"
            onClick={openSidebar}
            aria-label="Open menu"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-95"
          >
            <Menu size={21} />
          </button>

          <div className="ml-3 min-w-0">
            <p className="truncate text-sm font-bold text-slate-900">
              Doctor Panel
            </p>

            <p className="truncate text-[11px] text-slate-500">
              My Profile
            </p>
          </div>

        </div>

        {/* =================================================
            MAIN
        ================================================= */}

        <main className="min-w-0">

          {/* =================================================
              PAGE HEADER
          ================================================= */}

          <header className="border-b border-slate-200 bg-white">

            <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-7">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex min-w-0 items-center gap-3">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <UserRound size={21} />
                  </div>

                  <div className="min-w-0">

                    <h1 className="truncate text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                      My Profile
                    </h1>

                    <p className="text-sm text-slate-500">
                      Manage your professional information
                    </p>

                  </div>
                </div>

                <div className="hidden items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 sm:flex">
                  <CheckCircle2 size={16} />
                  Profile settings
                </div>

              </div>

            </div>

          </header>

          {/* =================================================
              CONTENT
          ================================================= */}

          <div className="mx-auto max-w-7xl px-4 py-5 pb-32 sm:px-6 sm:py-7 lg:px-8">

            {/* =================================================
                MESSAGE
            ================================================= */}

            {message && (
              <div
                className={`mb-5 flex items-start gap-3 rounded-xl border p-4 text-sm ${
                  message.includes("successfully")
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : message.includes("Save your profile")
                    ? "border-blue-200 bg-blue-50 text-blue-700"
                    : "border-red-200 bg-red-50 text-red-700"
                }`}
              >

                {message.includes("successfully") ? (
                  <CheckCircle2
                    className="mt-0.5 shrink-0"
                    size={18}
                  />
                ) : message.includes("Save your profile") ? (
                  <Sparkles
                    className="mt-0.5 shrink-0"
                    size={18}
                  />
                ) : (
                  <AlertCircle
                    className="mt-0.5 shrink-0"
                    size={18}
                  />
                )}

                <span className="min-w-0 flex-1 break-words">
                  {message}
                </span>

                <button
                  type="button"
                  onClick={() => setMessage("")}
                  className="shrink-0 text-slate-400 transition hover:text-slate-700"
                >
                  <X size={17} />
                </button>

              </div>
            )}

            {/* =================================================
                FORM
            ================================================= */}

            <form onSubmit={handleSubmit}>

              <div className="grid gap-5 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-6">

                {/* =================================================
                    LEFT PROFILE CARD
                ================================================= */}

                <aside className="h-fit lg:sticky lg:top-6">

                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                    {/* COVER */}

                    <div className="h-24 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 sm:h-28" />

                    <div className="-mt-12 px-4 pb-5 sm:px-5 sm:pb-6">

                      {/* AVATAR */}

                      <div className="relative mx-auto w-fit">

                        {form.photoUrl ? (
                          <img
                            src={form.photoUrl}
                            alt="Doctor profile"
                            className="h-24 w-24 rounded-2xl border-4 border-white object-cover shadow-lg sm:h-28 sm:w-28"
                          />
                        ) : (
                          <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-white bg-blue-100 text-3xl font-bold text-blue-600 shadow-lg sm:h-28 sm:w-28">
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

                      {/* NAME */}

                      <div className="mt-4 text-center">

                        <h2 className="break-words text-lg font-bold text-slate-900">
                          {form.name || "Doctor Name"}
                        </h2>

                        <p className="mt-1 text-sm text-blue-600">
                          {form.specialization ||
                            "Medical Specialist"}
                        </p>

                        {form.qualification && (
                          <p className="mt-2 break-words text-xs text-slate-500">
                            {form.qualification}
                          </p>
                        )}

                      </div>

                      {/* CHANGE PHOTO */}

                      <label className="mt-5 flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100">

                        <Camera size={17} />

                        {uploading
                          ? "Processing..."
                          : "Change photo"}

                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhoto}
                          className="hidden"
                        />

                      </label>

                      {/* PROFILE TIP */}

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
                              Complete information helps patients
                              understand your expertise and services.
                            </p>

                          </div>

                        </div>

                      </div>

                    </div>

                  </div>

                </aside>

                {/* =================================================
                    RIGHT CONTENT
                ================================================= */}

                <div className="min-w-0 space-y-5 sm:space-y-6">

                  {/* =================================================
                      BASIC INFORMATION
                  ================================================= */}

                  <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                    <SectionHeader
                      icon={<UserRound size={19} />}
                      title="Basic Information"
                      description="Your primary information visible to patients."
                    />

                    <div className="grid gap-5 p-4 sm:p-6 md:grid-cols-2">

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

                  {/* =================================================
                      PROFESSIONAL INFORMATION
                  ================================================= */}

                  <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                    <SectionHeader
                      icon={<Stethoscope size={19} />}
                      title="Professional Information"
                      description="Tell patients about your specialization and consultation."
                    />

                    <div className="grid gap-5 p-4 sm:p-6 md:grid-cols-2">

                      {/* SPECIALIZATION */}

                      <div>

                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          Specialization
                        </label>

                        <div className="relative">

                          <Stethoscope
                            size={17}
                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                          />

                          <select
                            name="specialization"
                            value={form.specialization}
                            onChange={handleChange}
                            className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-10 pr-10 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                          >

                            <option value="">
                              Select specialization
                            </option>

                            {SPECIALIZATIONS.map((specialization) => (
                              <option
                                key={specialization}
                                value={specialization}
                              >
                                {specialization}
                              </option>
                            ))}

                          </select>

                          <ChevronDown
                            size={17}
                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                          />

                        </div>

                      </div>

                      {/* CONSULTATION FEE */}

                      <InputField
                        label="Consultation fee"
                        name="consultationFee"
                        type="number"
                        min="0"
                        value={form.consultationFee}
                        onChange={handleChange}
                        placeholder="500"
                        icon={<IndianRupee size={17} />}
                      />

                      {/* TAGS */}

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

                  {/* =================================================
                      EDUCATION
                  ================================================= */}

                  <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                    <SectionHeader
                      icon={<BookOpen size={19} />}
                      title="Education & Credentials"
                      description="Add your educational background and qualifications."
                    />

                    <div className="p-4 sm:p-6">

                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Education
                      </label>

                      <div className="relative">

                        <BookOpen
                          size={17}
                          className="pointer-events-none absolute left-3 top-3.5 text-slate-400"
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

                  {/* =================================================
                      ABOUT
                  ================================================= */}

                  <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                    <SectionHeader
                      icon={<FileText size={19} />}
                      title="About You"
                      description="Write a short professional introduction for patients."
                    />

                    <div className="p-4 sm:p-6">

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

              {/* =================================================
                  STICKY SAVE BAR
              ================================================= */}

              <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 px-3 py-3 shadow-[0_-8px_30px_rgba(15,23,42,0.08)] backdrop-blur sm:px-4">

                <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">

                  <div className="hidden min-w-0 sm:block">

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

                    {saving
                      ? "Saving changes..."
                      : "Save Profile"}

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

/* =========================================================
   SECTION HEADER
========================================================= */

function SectionHeader({
  icon,
  title,
  description,
}) {
  return (
    <div className="flex items-start gap-3 border-b border-slate-100 p-4 sm:p-6">

      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        {icon}
      </div>

      <div className="min-w-0">

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

/* =========================================================
   INPUT FIELD
========================================================= */

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
    <div className="min-w-0">

      <label className="mb-2 block text-sm font-semibold text-slate-700">

        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}

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
        <p className="mt-1.5 text-xs leading-5 text-slate-400">
          {helper}
        </p>
      )}

    </div>
  );
}

export default DoctorProfileEdit;