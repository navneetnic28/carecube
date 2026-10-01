import { useEffect, useState } from "react";
import api from "../../services/api";
import CentreSidebar from "../../components/centre/CentreSidebar";
import {
  Menu,
  X,
  UserPlus,
  User,
  Phone,
  Stethoscope,
  FileText,
  CreditCard,
  IndianRupee,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

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
  const [messageType, setMessageType] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  /* =====================================================
     MOBILE MENU
  ===================================================== */

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  /* =====================================================
     LOCK BODY SCROLL WHEN MENU OPEN
  ===================================================== */

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  /* =====================================================
     FORM CHANGE
  ===================================================== */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =====================================================
     SUBMIT
  ===================================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setMessageType("");
    setSubmitting(true);

    try {
      const response = await api.post("/centre/walk-in", {
        ...form,
        amount: form.amount
          ? Number(form.amount)
          : 0,
      });

      setMessage(
        `Added to queue with Token #${response.data.appointment.tokenNumber}`
      );

      setMessageType("success");

      setForm({
        name: "",
        phone: "",
        doctorId: "",
        reason: "",
        paymentMethod: "cash",
        amount: "",
      });
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Unable to add walk-in patient"
      );

      setMessageType("error");
    } finally {
      setSubmitting(false);
    }
  };

  /* =====================================================
     CLOSE MENU
  ===================================================== */

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#f6f8fc]">
      {/* =================================================
          DESKTOP SIDEBAR
          Visible only >= lg
      ================================================= */}

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 lg:block">
        <CentreSidebar />
      </aside>

      {/* =================================================
          MOBILE HEADER
      ================================================= */}

      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white lg:hidden">
        <div className="flex h-16 items-center justify-between px-4">
          {/* MENU */}

          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-95"
          >
            <Menu size={22} />
          </button>

          {/* TITLE */}

          <div className="flex min-w-0 items-center gap-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <UserPlus size={19} />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-slate-900">
                Walk-in Patient
              </p>

              <p className="text-[11px] text-slate-400">
                Add patient to queue
              </p>
            </div>
          </div>

          {/* BALANCE */}

          <div className="w-10" />
        </div>
      </header>

      {/* =================================================
          MOBILE SIDEBAR DRAWER
      ================================================= */}

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          {/* OVERLAY */}

          <button
            type="button"
            aria-label="Close menu"
            onClick={closeMobileMenu}
            className="absolute inset-0 h-full w-full cursor-default bg-slate-950/50 backdrop-blur-[2px]"
          />

          {/* DRAWER */}

          <div className="absolute inset-y-0 left-0 flex w-[280px] max-w-[85vw] flex-col bg-white shadow-2xl">
            {/* DRAWER HEADER */}

            <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 px-4">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Stethoscope size={19} />
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-900">
                    CareCube
                  </p>

                  <p className="text-[11px] text-slate-400">
                    Centre Panel
                  </p>
                </div>
              </div>

              {/* CLOSE */}

              <button
                type="button"
                onClick={closeMobileMenu}
                aria-label="Close menu"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <X size={21} />
              </button>
            </div>

            {/* SIDEBAR */}

            <div
              className="min-h-0 flex-1 overflow-y-auto"
              onClick={(e) => {
                const target =
                  e.target.closest("a");

                if (target) {
                  closeMobileMenu();
                }
              }}
            >
              <CentreSidebar />
            </div>
          </div>
        </div>
      )}

      {/* =================================================
          MAIN CONTENT

          Desktop:
          ml-64

          Mobile:
          full width
      ================================================= */}

      <main className="min-w-0 lg:ml-64">
        {/* =================================================
            DESKTOP HEADER
        ================================================= */}

        <header className="hidden border-b border-slate-200 bg-white lg:block">
          <div className="mx-auto w-full max-w-7xl px-8 py-6">
            <div className="flex items-center justify-between gap-5">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <UserPlus size={22} />
                </div>

                <div className="min-w-0">
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                    Walk-in Patient
                  </h1>

                  <p className="mt-1 text-sm text-slate-500">
                    Add a patient directly to today's queue
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* =================================================
            MOBILE PAGE HEADER
        ================================================= */}

        <div className="border-b border-slate-200 bg-white px-4 py-5 sm:px-6 lg:hidden">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <UserPlus size={20} />
            </div>

            <div className="min-w-0">
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Walk-in Patient
              </h1>

              <p className="mt-1 text-xs text-slate-500">
                Add patient directly to today's queue
              </p>
            </div>
          </div>
        </div>

        {/* =================================================
            CONTENT
        ================================================= */}

        <div className="mx-auto w-full max-w-5xl px-4 py-5 pb-10 sm:px-6 sm:py-7 lg:px-8 lg:py-8">
          {/* =================================================
              INTRO CARD
          ================================================= */}

          <section className="mb-5 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-5 text-white shadow-lg shadow-blue-100 sm:p-6">
            <div className="flex items-center gap-4">
              <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 sm:flex">
                <UserPlus size={27} />
              </div>

              <div className="min-w-0">
                <h2 className="text-lg font-bold sm:text-xl">
                  Add Walk-in Patient
                </h2>

                <p className="mt-1 text-xs leading-5 text-blue-100 sm:text-sm">
                  Register a patient who arrived directly
                  at the centre without a prior appointment.
                </p>
              </div>
            </div>
          </section>

          {/* =================================================
              MESSAGE
          ================================================= */}

          {message && (
            <div
              className={`mb-5 flex items-start gap-3 rounded-xl border p-4 ${
                messageType === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {messageType === "success" ? (
                <CheckCircle2
                  size={20}
                  className="mt-0.5 shrink-0"
                />
              ) : (
                <AlertCircle
                  size={20}
                  className="mt-0.5 shrink-0"
                />
              )}

              <p className="text-sm font-medium leading-5">
                {message}
              </p>
            </div>
          )}

          {/* =================================================
              FORM CARD
          ================================================= */}

          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            {/* FORM HEADER */}

            <div className="border-b border-slate-100 p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <User size={19} />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">
                    Patient Information
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                    Enter the patient's details below
                  </p>
                </div>
              </div>
            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="p-5 sm:p-6"
            >
              <div className="grid gap-5 md:grid-cols-2">
                {/* =================================================
                    PATIENT NAME
                ================================================= */}

                <div>
                  <label
                    htmlFor="patient-name"
                    className="mb-1.5 block text-sm font-semibold text-slate-700"
                  >
                    Patient Name
                    <span className="text-red-500">
                      {" "}
                      *
                    </span>
                  </label>

                  <div className="relative">
                    <User
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="patient-name"
                      type="text"
                      name="name"
                      placeholder="Enter patient name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                {/* =================================================
                    PHONE
                ================================================= */}

                <div>
                  <label
                    htmlFor="patient-phone"
                    className="mb-1.5 block text-sm font-semibold text-slate-700"
                  >
                    Phone Number
                    <span className="text-red-500">
                      {" "}
                      *
                    </span>
                  </label>

                  <div className="relative">
                    <Phone
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="patient-phone"
                      type="tel"
                      name="phone"
                      placeholder="Enter phone number"
                      value={form.phone}
                      onChange={handleChange}
                      required
                      className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                {/* =================================================
                    DOCTOR ID
                ================================================= */}

                <div>
                  <label
                    htmlFor="doctor-id"
                    className="mb-1.5 block text-sm font-semibold text-slate-700"
                  >
                    Doctor ID
                    <span className="text-red-500">
                      {" "}
                      *
                    </span>
                  </label>

                  <div className="relative">
                    <Stethoscope
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="doctor-id"
                      type="text"
                      name="doctorId"
                      placeholder="Enter doctor ID"
                      value={form.doctorId}
                      onChange={handleChange}
                      required
                      className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <p className="mt-1.5 text-xs text-slate-400">
                    Enter the associated doctor's ID.
                  </p>
                </div>

                {/* =================================================
                    REASON
                ================================================= */}

                <div>
                  <label
                    htmlFor="patient-reason"
                    className="mb-1.5 block text-sm font-semibold text-slate-700"
                  >
                    Reason
                  </label>

                  <div className="relative">
                    <FileText
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="patient-reason"
                      type="text"
                      name="reason"
                      placeholder="Reason for visit (optional)"
                      value={form.reason}
                      onChange={handleChange}
                      className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                {/* =================================================
                    PAYMENT METHOD
                ================================================= */}

                <div>
                  <label
                    htmlFor="payment-method"
                    className="mb-1.5 block text-sm font-semibold text-slate-700"
                  >
                    Payment Method
                  </label>

                  <div className="relative">
                    <CreditCard
                      size={17}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <select
                      id="payment-method"
                      name="paymentMethod"
                      value={form.paymentMethod}
                      onChange={handleChange}
                      className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="cash">
                        Cash
                      </option>

                      <option value="online">
                        Online
                      </option>

                      <option value="none">
                        No payment yet
                      </option>
                    </select>
                  </div>
                </div>

                {/* =================================================
                    AMOUNT
                ================================================= */}

                <div>
                  <label
                    htmlFor="payment-amount"
                    className="mb-1.5 block text-sm font-semibold text-slate-700"
                  >
                    Amount
                  </label>

                  <div className="relative">
                    <IndianRupee
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="payment-amount"
                      type="number"
                      name="amount"
                      min="0"
                      placeholder="Enter amount"
                      value={form.amount}
                      onChange={handleChange}
                      className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>
              </div>

              {/* =================================================
                  FORM FOOTER
              ================================================= */}

              <div className="mt-6 border-t border-slate-100 pt-5">
                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs leading-5 text-slate-400">
                    The patient will receive a token number
                    after successful registration.
                  </p>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                  >
                    {submitting ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <UserPlus size={17} />
                        Add to Queue
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </section>

          {/* =================================================
              INFO CARDS
          ================================================= */}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Stethoscope size={17} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Doctor Assignment
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Make sure the doctor ID belongs to a
                    doctor associated with this centre.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <CheckCircle2 size={17} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Queue Registration
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    After registration, the patient will be
                    added to the doctor's queue with a token.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default WalkIn;