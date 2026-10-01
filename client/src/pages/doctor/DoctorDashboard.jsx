import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "../../components/Logo";

import {
  Activity,
  ArrowUpRight,
  Bell,
  CalendarDays,
  CheckCircle2,
  Clock3,
  DollarSign,
  HeartPulse,
  Loader2,
  MapPin,
  MoreHorizontal,
  RefreshCw,
  Stethoscope,
  Users,
  UserRound,
  Wallet,
  Zap,
  ChevronRight,
  CircleCheck,
  AlertCircle,
  Play,
  Menu,
  X,
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import DoctorSidebar from "../../components/doctor/DoctorSidebar";
import StatusBadge from "../../components/StatusBadge";
import NotificationBell from "../../components/NotificationBell";

const STATUS_OPTIONS = [
  {
    value: "available",
    label: "🟢 Available",
  },
  {
    value: "delayed",
    label: "🟡 Delayed",
  },
  {
    value: "unavailable",
    label: "🔴 Not available today",
  },
  {
    value: "holiday",
    label: "🔴 On holiday",
  },
];

const COLORS = [
  "#2563eb",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
];

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 20,
  },

  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
    },
  },
};

const stagger = {
  hidden: {},

  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

function formatCurrency(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function getPatientName(appointment) {
  return (
    appointment?.patientDetails?.name ||
    appointment?.patientId?.name ||
    "Unknown Patient"
  );
}

function getPatientAge(appointment) {
  return appointment?.patientDetails?.age;
}

function getPatientGender(appointment) {
  return appointment?.patientDetails?.gender;
}

function getAppointmentAmount(appointment) {
  return (
    Number(
      appointment?.amount ??
        appointment?.consultationFee ??
        appointment?.fee ??
        appointment?.payment?.amount ??
        0
    ) || 0
  );
}

function getHourLabel(appointment) {
  const value =
    appointment?.time ||
    appointment?.appointmentTime ||
    appointment?.scheduledTime ||
    "";

  if (!value) return "Other";

  const match = String(value).match(/(\d{1,2})/);

  if (!match) return "Other";

  const hour = Number(match[1]);

  if (hour > 23) return "Other";

  return `${String(hour).padStart(2, "0")}:00`;
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconClass = "bg-blue-50 text-blue-600",
  trend,
}) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{
        y: -5,
        scale: 1.01,
        transition: {
          duration: 0.2,
        },
      }}
      className="group relative min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-xl sm:p-5"
    >
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-blue-50 opacity-50 transition-transform duration-500 group-hover:scale-150" />

      <div className="relative flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-slate-500 sm:text-sm">
            {title}
          </p>

          <motion.h3
            key={String(value)}
            initial={{
              opacity: 0,
              y: 8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mt-2 break-words text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
          >
            {value}
          </motion.h3>

          {subtitle && (
            <p className="mt-1 text-xs text-slate-500">
              {subtitle}
            </p>
          )}

          {trend && (
            <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-emerald-600">
              <ArrowUpRight size={14} />
              {trend}
            </div>
          )}
        </div>

        <div
          className={`shrink-0 rounded-xl p-2.5 sm:p-3 ${iconClass}`}
        >
          <Icon size={20} className="sm:h-[22px] sm:w-[22px]" />
        </div>
      </div>
    </motion.div>
  );
}

/* =========================================================
   SECTION HEADER
========================================================= */

function SectionHeader({
  title,
  subtitle,
  action,
}) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h2 className="text-lg font-bold text-slate-900">
          {title}
        </h2>

        {subtitle && (
          <p className="mt-1 text-sm text-slate-500">
            {subtitle}
          </p>
        )}
      </div>

      {action && (
        <div className="shrink-0">
          {action}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   DOCTOR DASHBOARD
========================================================= */

function DoctorDashboard() {
  const { user } = useAuth();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [centreId, setCentreId] = useState("");
  const [chambers, setChambers] = useState([]);

  const [statuses, setStatuses] = useState({});
  const [statusCentreId, setStatusCentreId] = useState("");
  const [saving, setSaving] = useState(false);

  /* MOBILE SIDEBAR */
  const [mobileSidebarOpen, setMobileSidebarOpen] =
    useState(false);

  /* =========================================================
     LOAD DASHBOARD
  ========================================================= */

  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
    if (mobileSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileSidebarOpen]);

  const loadDashboard = async () => {
    await Promise.all([
      loadAppointments(),
      loadChambers(),
      loadStatuses(),
    ]);
  };

  const refreshDashboard = async () => {
    setRefreshing(true);

    try {
      await loadDashboard();
    } finally {
      setRefreshing(false);
    }
  };

  /* =========================================================
     APPOINTMENTS
  ========================================================= */

  const loadAppointments = async () => {
    try {
      const response = await api.get(
        "/appointments/doctor"
      );

      const list = response.data.appointments || [];

      setAppointments(list);

      if (list.length > 0 && !centreId) {
        setCentreId(
          list[0].centreId?._id ||
            list[0].centreId ||
            ""
        );
      }
    } catch (error) {
      console.error("Appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     CHAMBERS
  ========================================================= */

  const loadChambers = async () => {
    try {
      const response = await api.get(
        "/doctor/schedule"
      );

      const seen = new Set();
      const unique = [];

      (response.data.schedule || []).forEach(
        (item) => {
          const id = item.centreId?._id;

          if (
            item.centreId &&
            id &&
            !seen.has(id)
          ) {
            seen.add(id);
            unique.push(item.centreId);
          }
        }
      );

      setChambers(unique);

      if (unique.length > 0 && !statusCentreId) {
        setStatusCentreId(unique[0]._id);
      }
    } catch (error) {
      console.error("Chambers:", error);
    }
  };

  /* =========================================================
     STATUS
  ========================================================= */

  const loadStatuses = async () => {
    try {
      const response = await api.get(
        "/doctor/status"
      );

      const map = {};

      (response.data.statuses || []).forEach(
        (item) => {
          const id =
            item.centreId?._id ||
            item.centreId;

          if (!id) return;

          map[id] = {
            status: item.status,
            delayMinutes:
              item.delayMinutes || 0,
            note: item.note || "",
          };
        }
      );

      setStatuses(map);
    } catch (error) {
      console.error("Status:", error);
    }
  };

  const currentStatus =
    statuses[statusCentreId] || {
      status: "available",
      delayMinutes: 0,
      note: "",
    };

  const updateLocalStatus = (
    field,
    value
  ) => {
    setStatuses((prev) => ({
      ...prev,

      [statusCentreId]: {
        ...currentStatus,
        [field]: value,
      },
    }));
  };

  const saveStatus = async () => {
    if (!statusCentreId) return;

    setSaving(true);

    try {
      await api.patch("/doctor/status", {
        centreId: statusCentreId,
        date: new Date()
          .toISOString()
          .split("T")[0],
        status: currentStatus.status,
        delayMinutes:
          currentStatus.delayMinutes,
        note: currentStatus.note,
      });

      await loadStatuses();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Unable to update status"
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     APPOINTMENT GROUPS
  ========================================================= */

  const currentPatient = appointments.find(
    (item) => item.status === "consulting"
  );

  const waitingPatients =
    appointments.filter(
      (item) =>
        item.status === "waiting" ||
        item.status === "in_queue"
    );

  const completed = appointments.filter(
    (item) => item.status === "completed"
  );

  const cancelled = appointments.filter(
    (item) => item.status === "cancelled"
  );

  const confirmed = appointments.filter(
    (item) =>
      item.status === "confirmed" ||
      item.status === "booked"
  );

  /* =========================================================
     EARNINGS
  ========================================================= */

  const totalEarnings = useMemo(() => {
    return appointments
      .filter(
        (item) => item.status === "completed"
      )
      .reduce(
        (sum, item) =>
          sum + getAppointmentAmount(item),
        0
      );
  }, [appointments]);

  /* =========================================================
     CALL NEXT
  ========================================================= */

  const callNext = async () => {
    try {
      await api.patch(
        "/appointments/doctor/call-next",
        {
          centreId,
          date: new Date()
            .toISOString()
            .split("T")[0],
        }
      );

      await loadAppointments();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Unable to call next patient"
      );
    }
  };

  /* =========================================================
     COMPLETE PATIENT
  ========================================================= */

  const completePatient = async (
    appointmentId
  ) => {
    try {
      await api.patch(
        `/appointments/doctor/${appointmentId}/complete`
      );

      await loadAppointments();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Unable to complete consultation"
      );
    }
  };

  /* =========================================================
     ANALYTICS
  ========================================================= */

  const hourlyData = useMemo(() => {
    const map = {};

    appointments.forEach(
      (appointment) => {
        const hour =
          getHourLabel(appointment);

        if (!map[hour]) {
          map[hour] = 0;
        }

        map[hour] += 1;
      }
    );

    return Object.entries(map)
      .filter(
        ([hour]) => hour !== "Other"
      )
      .sort(([a], [b]) =>
        a.localeCompare(b)
      )
      .map(([hour, count]) => ({
        hour,
        patients: count,
      }));
  }, [appointments]);

  const statusData = [
    {
      name: "Completed",
      value: completed.length,
    },
    {
      name: "Waiting",
      value: waitingPatients.length,
    },
    {
      name: "Consulting",
      value: currentPatient ? 1 : 0,
    },
    {
      name: "Cancelled",
      value: cancelled.length,
    },
  ].filter(
    (item) => item.value > 0
  );

  const chamberData = useMemo(() => {
    return chambers.map((chamber) => {
      const count =
        appointments.filter(
          (appointment) => {
            const appointmentCentre =
              appointment.centreId?._id ||
              appointment.centreId;

            return (
              appointmentCentre ===
              chamber._id
            );
          }
        ).length;

      return {
        name:
          chamber.name?.length > 16
            ? `${chamber.name.slice(
                0,
                16
              )}…`
            : chamber.name,

        patients: count,
      };
    });
  }, [appointments, chambers]);

  const uniquePatients = useMemo(() => {
    return new Set(
      appointments.map(
        (appointment) =>
          appointment.patientId?._id ||
          appointment.patientId ||
          appointment.patientDetails
            ?.name
      )
    ).size;
  }, [appointments]);

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <div className="hidden lg:block">
          <DoctorSidebar />
        </div>

        <main className="flex min-w-0 flex-1 items-center justify-center p-6">
          <div className="text-center">
            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                repeat: Infinity,
                duration: 1,
                ease: "linear",
              }}
              className="mx-auto w-fit text-blue-600"
            >
              <Loader2 size={38} />
            </motion.div>

            <p className="mt-4 font-medium text-slate-600">
              Loading your dashboard...
            </p>
          </div>
        </main>
      </div>
    );
  }

  /* =========================================================
     MAIN UI
  ========================================================= */

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f5f8fc]">

      {/* =====================================================
          MOBILE SIDEBAR OVERLAY
      ===================================================== */}

      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              onClick={() =>
                setMobileSidebarOpen(false)
              }
              className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden"
            />

            <motion.div
              initial={{
                x: "-100%",
              }}
              animate={{
                x: 0,
              }}
              exit={{
                x: "-100%",
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
              className="fixed inset-y-0 left-0 z-50 w-[280px] max-w-[85vw] overflow-y-auto bg-white shadow-2xl lg:hidden"
            >
              <div className="flex items-center justify-between border-b border-slate-200 p-4">
                <div>
                  <p className="text-sm font-black text-slate-900">
                      

                  </p>

                
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setMobileSidebarOpen(false)
                  }
                  className="rounded-xl  text-slate-500 hover:bg-slate-100"
                  aria-label="Close sidebar"
                >
                  <X size={20} />
                </button>
              </div>

              <DoctorSidebar />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* =====================================================
          DESKTOP LAYOUT
      ===================================================== */}

      <div className="flex min-h-screen">

        {/* DESKTOP SIDEBAR */}

        <aside className="hidden w-64 shrink-0 lg:block xl:w-72">
          <div className="sticky top-0 h-screen overflow-y-auto">
            <DoctorSidebar />
          </div>
        </aside>

        {/* =================================================
            CONTENT
        ================================================= */}

        <main className="min-w-0 flex-1">

          <div className="w-full px-3 py-4 sm:px-4 sm:py-5 md:px-6 md:py-6 xl:px-8 xl:py-8">

            {/* =================================================
                MOBILE / DESKTOP TOP BAR
            ================================================= */}

            <div className="mb-5 flex items-center justify-between gap-3 lg:hidden">

              <button
                type="button"
                onClick={() =>
                  setMobileSidebarOpen(true)
                }
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50"
                aria-label="Open sidebar"
              >
                <Menu size={21} />
              </button>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-black text-slate-900">
                       <Logo size="md" />

                </p>

                <p className="truncate text-xs text-slate-500">
                  Doctor Dashboard
                </p>
              </div>

              <NotificationBell />
            </div>

            {/* =================================================
                HEADER
            ================================================= */}

            <motion.div
              initial="hidden"
              animate="show"
              variants={stagger}
              className="mb-6 md:mb-7"
            >
              <motion.div
                variants={fadeUp}
                className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between"
              >

                {/* TITLE */}

                <div className="min-w-0">

                  <div className="flex flex-wrap items-center gap-2">

                    <span className="rounded-full bg-blue-100 px-3 py-1 text-[10px] font-bold tracking-wide text-blue-700 sm:text-xs">
                      DOCTOR PANEL
                    </span>

                    <motion.span
                      animate={{
                        opacity: [
                          1,
                          0.4,
                          1,
                        ],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 2,
                      }}
                      className="h-2 w-2 rounded-full bg-emerald-500"
                    />

                    <span className="text-xs text-slate-500">
                      Live
                    </span>
                  </div>

                  <h1 className="mt-3 break-words text-2xl font-black tracking-tight text-slate-900 sm:text-3xl md:text-4xl">
                    Good Morning, Dr.{" "}
                    {user?.name || "Doctor"} 👋
                  </h1>

                  <p className="mt-2 text-sm text-slate-500 md:text-base">
                    Here's your practice overview
                    for today.
                  </p>
                </div>

                {/* ACTIONS */}

                <div className="flex flex-wrap items-center gap-2 sm:gap-3">

                  <motion.button
                    whileTap={{
                      scale: 0.95,
                    }}
                    onClick={
                      refreshDashboard
                    }
                    className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 sm:px-4"
                  >
                    <motion.div
                      animate={
                        refreshing
                          ? {
                              rotate: 360,
                            }
                          : {
                              rotate: 0,
                            }
                      }
                      transition={{
                        duration: 0.8,
                        repeat: refreshing
                          ? Infinity
                          : 0,
                      }}
                    >
                      <RefreshCw size={16} />
                    </motion.div>

                    <span className="hidden xs:inline sm:inline">
                      Refresh
                    </span>
                  </motion.button>

                  <div className="hidden lg:block">
                    <NotificationBell />
                  </div>

                  {user?.id && (
                    <a
                      href={`/doctor/${user.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-xl bg-slate-900 px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 sm:px-4"
                    >
                      <span className="hidden sm:inline">
                        Public Profile
                      </span>

                      <span className="sm:hidden">
                        Profile
                      </span>
                    </a>
                  )}
                </div>
              </motion.div>
            </motion.div>

            {/* =================================================
                KPI CARDS
            ================================================= */}

            <motion.div
              initial="hidden"
              animate="show"
              variants={stagger}
              className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-5"
            >

              <StatCard
                title="Total Appointments"
                value={appointments.length}
                subtitle="Today's appointments"
                icon={CalendarDays}
                iconClass="bg-blue-50 text-blue-600"
              />

              <StatCard
                title="Total Patients"
                value={uniquePatients}
                subtitle="Unique patients"
                icon={Users}
                iconClass="bg-violet-50 text-violet-600"
              />

              <StatCard
                title="Waiting Queue"
                value={
                  waitingPatients.length
                }
                subtitle="Patients waiting"
                icon={Clock3}
                iconClass="bg-amber-50 text-amber-600"
              />

              <StatCard
                title="Completed"
                value={completed.length}
                subtitle="Consultations done"
                icon={CheckCircle2}
                iconClass="bg-emerald-50 text-emerald-600"
              />

              <StatCard
                title="Today's Earnings"
                value={formatCurrency(
                  totalEarnings
                )}
                subtitle="Completed consultations"
                icon={Wallet}
                iconClass="bg-cyan-50 text-cyan-600"
              />

            </motion.div>

            {/* =================================================
                LIVE STATUS
            ================================================= */}

            {chambers.length > 0 && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.3,
                }}
                className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:mt-6"
              >

                {/* STATUS HEADER */}

                <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 p-4 text-white sm:p-5">

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div className="flex items-center gap-3 sm:gap-4">

                      <motion.div
                        animate={{
                          scale: [
                            1,
                            1.08,
                            1,
                          ],
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 2,
                        }}
                        className="shrink-0 rounded-2xl bg-white/15 p-3 backdrop-blur"
                      >
                        <Activity
                          size={23}
                        />
                      </motion.div>

                      <div className="min-w-0">
                        <h2 className="font-bold">
                          Live Availability
                        </h2>

                        <p className="mt-1 text-xs text-blue-100 sm:text-sm">
                          Update your chamber
                          status instantly.
                        </p>
                      </div>
                    </div>

                    <div className="self-start rounded-xl bg-white/10 px-3 py-2 backdrop-blur sm:self-auto sm:px-4">
                      <StatusBadge
                        status={
                          currentStatus.status
                        }
                        delayMinutes={
                          currentStatus.delayMinutes
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* STATUS FORM */}

                <div className="grid gap-3 p-4 sm:p-5 md:grid-cols-2 xl:grid-cols-5">

                  <select
                    value={
                      statusCentreId
                    }
                    onChange={(e) =>
                      setStatusCentreId(
                        e.target.value
                      )
                    }
                    className="min-w-0 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    {chambers.map(
                      (chamber) => (
                        <option
                          key={
                            chamber._id
                          }
                          value={
                            chamber._id
                          }
                        >
                          {chamber.name}
                        </option>
                      )
                    )}
                  </select>

                  <select
                    value={
                      currentStatus.status
                    }
                    onChange={(e) =>
                      updateLocalStatus(
                        "status",
                        e.target.value
                      )
                    }
                    className="min-w-0 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    {STATUS_OPTIONS.map(
                      (option) => (
                        <option
                          key={
                            option.value
                          }
                          value={
                            option.value
                          }
                        >
                          {option.label}
                        </option>
                      )
                    )}
                  </select>

                  {currentStatus.status ===
                    "delayed" && (
                    <input
                      type="number"
                      min="0"
                      placeholder="Delay in minutes"
                      value={
                        currentStatus.delayMinutes
                      }
                      onChange={(e) =>
                        updateLocalStatus(
                          "delayMinutes",
                          Number(
                            e.target
                              .value
                          )
                        )
                      }
                      className="min-w-0 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  )}

                  <input
                    type="text"
                    placeholder="Status note"
                    value={
                      currentStatus.note
                    }
                    onChange={(e) =>
                      updateLocalStatus(
                        "note",
                        e.target.value
                      )
                    }
                    className="min-w-0 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                  <motion.button
                    whileHover={{
                      scale: 1.02,
                    }}
                    whileTap={{
                      scale: 0.97,
                    }}
                    onClick={saveStatus}
                    disabled={saving}
                    className="flex min-h-[46px] items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? (
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />
                    ) : (
                      <Zap size={17} />
                    )}

                    {saving
                      ? "Updating..."
                      : "Update Status"}
                  </motion.button>

                </div>
              </motion.div>
            )}

            {/* =================================================
                ANALYTICS
            ================================================= */}

            <div className="mt-5 grid min-w-0 gap-5 md:mt-7 md:gap-6 xl:grid-cols-[1.7fr_1fr]">

              {/* APPOINTMENT TREND */}

              <motion.div
                initial={{
                  opacity: 0,
                  x: -20,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  delay: 0.4,
                }}
                className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
              >

                <SectionHeader
                  title="Appointment Analytics"
                  subtitle="Patient appointments by available time"
                  action={
                    <div className="w-fit rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                      Today
                    </div>
                  }
                />

                <div className="h-[240px] w-full sm:h-[300px]">

                  {hourlyData.length > 0 ? (
                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >
                      <AreaChart
                        data={
                          hourlyData
                        }
                        margin={{
                          top: 5,
                          right: 5,
                          left: -20,
                          bottom: 0,
                        }}
                      >

                        <defs>
                          <linearGradient
                            id="appointmentGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="#2563eb"
                              stopOpacity={
                                0.35
                              }
                            />

                            <stop
                              offset="100%"
                              stopColor="#2563eb"
                              stopOpacity={
                                0.02
                              }
                            />
                          </linearGradient>
                        </defs>

                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="#e2e8f0"
                        />

                        <XAxis
                          dataKey="hour"
                          tick={{
                            fontSize: 10,
                            fill: "#64748b",
                          }}
                          axisLine={false}
                          tickLine={false}
                        />

                        <YAxis
                          allowDecimals={
                            false
                          }
                          tick={{
                            fontSize: 10,
                            fill: "#64748b",
                          }}
                          axisLine={false}
                          tickLine={false}
                        />

                        <Tooltip />

                        <Area
                          type="monotone"
                          dataKey="patients"
                          stroke="#2563eb"
                          strokeWidth={3}
                          fill="url(#appointmentGradient)"
                          animationDuration={
                            1200
                          }
                        />

                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center text-center text-sm text-slate-400">
                      No appointment time
                      data available.
                    </div>
                  )}

                </div>
              </motion.div>

              {/* STATUS DONUT */}

              <motion.div
                initial={{
                  opacity: 0,
                  x: 20,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  delay: 0.45,
                }}
                className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
              >

                <SectionHeader
                  title="Appointment Status"
                  subtitle="Today's appointment distribution"
                />

                <div className="relative h-[220px]">

                  {statusData.length > 0 ? (
                    <>
                      <ResponsiveContainer
                        width="100%"
                        height="100%"
                      >
                        <PieChart>

                          <Pie
                            data={
                              statusData
                            }
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={80}
                            paddingAngle={4}
                            animationDuration={
                              1000
                            }
                          >
                            {statusData.map(
                              (
                                _,
                                index
                              ) => (
                                <Cell
                                  key={
                                    index
                                  }
                                  fill={
                                    COLORS[
                                      index %
                                        COLORS.length
                                    ]
                                  }
                                />
                              )
                            )}
                          </Pie>

                          <Tooltip />

                        </PieChart>
                      </ResponsiveContainer>

                      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-black text-slate-900 sm:text-3xl">
                          {
                            appointments.length
                          }
                        </span>

                        <span className="text-xs text-slate-500">
                          Total
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-slate-400">
                      No appointment
                      data.
                    </div>
                  )}

                </div>

                <div className="mt-2 grid grid-cols-2 gap-3">

                  {statusData.map(
                    (item, index) => (
                      <div
                        key={
                          item.name
                        }
                        className="flex min-w-0 items-center gap-2 text-xs"
                      >

                        <span
                          className="h-2.5 w-2.5 shrink-0 rounded-full"
                          style={{
                            backgroundColor:
                              COLORS[
                                index %
                                  COLORS.length
                              ],
                          }}
                        />

                        <span className="truncate text-slate-500">
                          {item.name}
                        </span>

                        <strong className="ml-auto text-slate-900">
                          {item.value}
                        </strong>

                      </div>
                    )
                  )}

                </div>
              </motion.div>

            </div>

            {/* =================================================
                CHAMBER + CURRENT PATIENT
            ================================================= */}

            <div className="mt-5 grid min-w-0 gap-5 md:mt-6 md:gap-6 xl:grid-cols-2">

              {/* CHAMBER GRAPH */}

              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.5,
                }}
                className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
              >

                <SectionHeader
                  title="Chamber Performance"
                  subtitle="Appointments by chamber"
                />

                <div className="h-[230px] w-full sm:h-[250px]">

                  {chamberData.length >
                  0 ? (
                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >
                      <BarChart
                        data={
                          chamberData
                        }
                        margin={{
                          top: 5,
                          right: 5,
                          left: -20,
                          bottom: 0,
                        }}
                      >

                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="#e2e8f0"
                        />

                        <XAxis
                          dataKey="name"
                          tick={{
                            fontSize: 10,
                            fill: "#64748b",
                          }}
                          axisLine={false}
                          tickLine={false}
                        />

                        <YAxis
                          allowDecimals={
                            false
                          }
                          axisLine={false}
                          tickLine={false}
                        />

                        <Tooltip />

                        <Bar
                          dataKey="patients"
                          fill="#2563eb"
                          radius={[
                            8,
                            8,
                            0,
                            0,
                          ]}
                          animationDuration={
                            1000
                          }
                        />

                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-slate-400">
                      No chamber data
                      available.
                    </div>
                  )}

                </div>
              </motion.div>

              {/* CURRENT PATIENT */}

              <AnimatePresence mode="wait">

                {currentPatient ? (
                  <motion.div
                    key="current"
                    initial={{
                      opacity: 0,
                      scale: 0.96,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.96,
                    }}
                    className="relative min-w-0 overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-blue-900 to-blue-700 p-5 text-white shadow-xl sm:p-6"
                  >

                    <motion.div
                      animate={{
                        scale: [
                          1,
                          1.2,
                          1,
                        ],
                        opacity: [
                          0.2,
                          0.4,
                          0.2,
                        ],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 4,
                      }}
                      className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-cyan-400"
                    />

                    <div className="relative">

                      <div className="flex items-center justify-between gap-3">

                        <div className="flex items-center gap-2">

                          <motion.div
                            animate={{
                              scale: [
                                1,
                                1.2,
                                1,
                              ],
                            }}
                            transition={{
                              repeat:
                                Infinity,
                              duration: 1.5,
                            }}
                            className="h-3 w-3 shrink-0 rounded-full bg-emerald-400"
                          />

                          <span className="text-xs font-semibold text-blue-100 sm:text-sm">
                            LIVE
                            CONSULTATION
                          </span>

                        </div>

                        <Stethoscope
                          size={23}
                        />

                      </div>

                      <div className="mt-7 sm:mt-8">

                        <p className="text-sm text-blue-200">
                          Currently
                          consulting
                        </p>

                        <h2 className="mt-2 text-3xl font-black sm:text-4xl">
                          Token #
                          {
                            currentPatient.tokenNumber
                          }
                        </h2>

                        <div className="mt-4 flex items-center gap-3">

                          <div className="shrink-0 rounded-full bg-white/10 p-3">
                            <UserRound
                              size={
                                22
                              }
                            />
                          </div>

                          <div className="min-w-0">

                            <p className="truncate font-bold">
                              {getPatientName(
                                currentPatient
                              )}
                            </p>

                            <p className="text-sm text-blue-200">

                              {getPatientAge(
                                currentPatient
                              )
                                ? `${getPatientAge(
                                    currentPatient
                                  )} years`
                                : "Age not available"}

                              {getPatientGender(
                                currentPatient
                              )
                                ? ` • ${getPatientGender(
                                    currentPatient
                                  )}`
                                : ""}

                            </p>
                          </div>

                        </div>
                      </div>

                      <motion.button
                        whileHover={{
                          scale: 1.02,
                        }}
                        whileTap={{
                          scale: 0.97,
                        }}
                        onClick={() =>
                          completePatient(
                            currentPatient._id
                          )
                        }
                        className="mt-7 flex min-h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 font-bold text-blue-700 shadow-lg sm:mt-8"
                      >
                        <CircleCheck
                          size={19}
                        />

                        Complete
                        Consultation
                      </motion.button>

                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="none"
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: 1,
                    }}
                    className="flex min-h-[300px] min-w-0 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center sm:min-h-[330px]"
                  >

                    <div className="rounded-2xl bg-blue-50 p-4 text-blue-600">
                      <Stethoscope
                        size={32}
                      />
                    </div>

                    <h3 className="mt-4 text-lg font-bold text-slate-900">
                      No active
                      consultation
                    </h3>

                    <p className="mt-1 max-w-sm text-sm text-slate-500">
                      Start your next
                      consultation from
                      the waiting queue.
                    </p>

                    {waitingPatients.length >
                      0 && (
                      <motion.button
                        whileHover={{
                          scale: 1.03,
                        }}
                        whileTap={{
                          scale: 0.97,
                        }}
                        onClick={
                          callNext
                        }
                        className="mt-5 flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-bold text-white shadow-lg shadow-blue-200"
                      >
                        <Play
                          size={17}
                        />
                        Call Next
                        Patient
                      </motion.button>
                    )}

                  </motion.div>
                )}

              </AnimatePresence>
            </div>

            {/* =================================================
                WAITING QUEUE
            ================================================= */}

            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.6,
              }}
              className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:mt-6 sm:p-5"
            >

              <SectionHeader
                title="Waiting Queue"
                subtitle={`${waitingPatients.length} patients waiting`}
                action={
                  !currentPatient &&
                  waitingPatients.length >
                    0 ? (
                    <motion.button
                      whileHover={{
                        scale: 1.03,
                      }}
                      whileTap={{
                        scale: 0.97,
                      }}
                      onClick={
                        callNext
                      }
                      className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-100"
                    >
                      <Play
                        size={16}
                      />
                      Call Next
                    </motion.button>
                  ) : null
                }
              />

              <div className="space-y-3">

                <AnimatePresence>
                  {waitingPatients.map(
                    (
                      appointment,
                      index
                    ) => (
                      <motion.div
                        key={
                          appointment._id
                        }
                        layout
                        initial={{
                          opacity: 0,
                          x: -20,
                        }}
                        animate={{
                          opacity: 1,
                          x: 0,
                        }}
                        exit={{
                          opacity: 0,
                          x: 30,
                        }}
                        transition={{
                          delay:
                            index *
                            0.04,
                        }}
                        whileHover={{
                          x: 5,
                        }}
                        className="group flex min-w-0 items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 transition hover:border-blue-200 hover:bg-blue-50/40 sm:p-4"
                      >

                        <div className="flex min-w-0 items-center gap-3 sm:gap-4">

                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-sm font-black text-blue-700 sm:h-12 sm:w-12 sm:text-base">
                            #
                            {
                              appointment.tokenNumber
                            }
                          </div>

                          <div className="min-w-0">

                            <h3 className="truncate font-bold text-slate-900">
                              {getPatientName(
                                appointment
                              )}
                            </h3>

                            <p className="mt-1 truncate text-xs text-slate-500">

                              {getPatientAge(
                                appointment
                              )
                                ? `${getPatientAge(
                                    appointment
                                  )} years`
                                : "Age N/A"}

                              {getPatientGender(
                                appointment
                              )
                                ? ` • ${getPatientGender(
                                    appointment
                                  )}`
                                : ""}

                            </p>
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-2">

                          <span className="hidden rounded-full bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-700 sm:block">
                            Waiting
                          </span>

                          <ChevronRight
                            size={18}
                            className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-600"
                          />

                        </div>
                      </motion.div>
                    )
                  )}
                </AnimatePresence>

                {waitingPatients.length ===
                  0 && (
                  <div className="rounded-xl bg-slate-50 px-4 py-10 text-center sm:py-12">

                    <CheckCircle2
                      className="mx-auto text-emerald-500"
                      size={40}
                    />

                    <p className="mt-3 font-semibold text-slate-700">
                      Queue is clear
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      No patients are
                      waiting right now.
                    </p>

                  </div>
                )}

              </div>
            </motion.div>

            {/* =================================================
                QUICK OVERVIEW
            ================================================= */}

            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.7,
              }}
              className="mt-5 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 md:mt-6"
            >

              {/* ACTIVE CHAMBERS */}

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">

                <div className="flex items-center justify-between">

                  <div className="rounded-xl bg-violet-50 p-3 text-violet-600">
                    <MapPin size={20} />
                  </div>

                  <MoreHorizontal
                    size={18}
                    className="text-slate-400"
                  />
                </div>

                <p className="mt-4 text-sm text-slate-500">
                  Active Chambers
                </p>

                <p className="mt-1 text-2xl font-black text-slate-900">
                  {chambers.length}
                </p>
              </div>

              {/* CONFIRMED */}

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">

                <div className="flex items-center justify-between">

                  <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                    <HeartPulse
                      size={20}
                    />
                  </div>
                </div>

                <p className="mt-4 text-sm text-slate-500">
                  Confirmed
                </p>

                <p className="mt-1 text-2xl font-black text-slate-900">
                  {confirmed.length}
                </p>
              </div>

              {/* CANCELLED */}

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">

                <div className="flex items-center justify-between">

                  <div className="rounded-xl bg-red-50 p-3 text-red-600">
                    <AlertCircle
                      size={20}
                    />
                  </div>
                </div>

                <p className="mt-4 text-sm text-slate-500">
                  Cancelled
                </p>

                <p className="mt-1 text-2xl font-black text-slate-900">
                  {cancelled.length}
                </p>
              </div>

              {/* REVENUE */}

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">

                <div className="flex items-center justify-between">

                  <div className="rounded-xl bg-cyan-50 p-3 text-cyan-600">
                    <DollarSign
                      size={20}
                    />
                  </div>
                </div>

                <p className="mt-4 text-sm text-slate-500">
                  Consultation Revenue
                </p>

                <p className="mt-1 break-words text-2xl font-black text-slate-900">
                  {formatCurrency(
                    totalEarnings
                  )}
                </p>
              </div>

            </motion.div>

            {/* =================================================
                FOOTER
            ================================================= */}

            <footer className="mt-8 border-t border-slate-200 py-6 text-center text-xs text-slate-400">
              CareCube • Smart Doctor
              Management Platform
            </footer>

          </div>
        </main>
      </div>
    </div>
  );
}

export default DoctorDashboard;
