import { useEffect, useRef, useState } from "react";
import api from "../services/api";

function timeAgo(dateStr) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const ICONS = {
  appointment_accepted: "✅",
  appointment_started: "🔔",
  appointment_completed: "🎉",
  appointment_cancelled: "❌",
  general: "📣",
};

function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const boxRef = useRef(null);

  const load = async () => {
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data.notifications);
      setUnreadCount(res.data.unreadCount);
    } catch {
      // silent — notifications are a non-critical enhancement
    }
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const toggle = async () => {
    const next = !open;
    setOpen(next);
    if (next && unreadCount > 0) {
      try {
        await api.patch("/notifications/read-all");
        setUnreadCount(0);
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      } catch {
        // ignore
      }
    }
  };

  return (
    <div className="relative" ref={boxRef}>
      <button
        onClick={toggle}
        className="relative rounded-lg bg-white px-3 py-2 shadow"
        aria-label="Notifications"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-2 w-80 rounded-xl border bg-white shadow-lg">
          <div className="border-b p-3 font-semibold">Notifications</div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 && (
              <p className="p-4 text-sm text-gray-400">No notifications yet.</p>
            )}
            {notifications.map((n) => (
              <div
                key={n._id}
                className={`flex gap-3 border-b p-3 text-sm last:border-b-0 ${
                  n.read ? "" : "bg-blue-50"
                }`}
              >
                <span>{ICONS[n.type] || "📣"}</span>
                <div>
                  <p className="font-medium">{n.title}</p>
                  <p className="text-gray-500">{n.message}</p>
                  <p className="mt-1 text-xs text-gray-400">{timeAgo(n.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
