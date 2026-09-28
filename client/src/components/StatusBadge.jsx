// Shared live-availability badge: 🟢 Available / 🟡 Delayed / 🔴 Unavailable / Holiday
function StatusBadge({ status, delayMinutes }) {
  const map = {
    available: { label: "🟢 Available", cls: "bg-green-100 text-green-700" },
    delayed: {
      label: `🟡 Delayed${delayMinutes ? ` ~${delayMinutes}m` : ""}`,
      cls: "bg-yellow-100 text-yellow-700",
    },
    unavailable: { label: "🔴 Not available today", cls: "bg-red-100 text-red-700" },
    holiday: { label: "🔴 On holiday", cls: "bg-red-100 text-red-700" },
  };
  const info = map[status] || map.available;
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium ${info.cls}`}>{info.label}</span>
  );
}

export default StatusBadge;
