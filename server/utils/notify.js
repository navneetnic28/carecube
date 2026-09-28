const Notification = require("../models/Notification");

// Creates an in-app notification. Never throws — a notification failing to
// send should never break the appointment/status-update flow that triggered it.
async function notifyUser({ userId, title, message, type, appointmentId }) {
  try {
    await Notification.create({ userId, title, message, type, appointmentId });
  } catch (error) {
    console.error("notifyUser failed:", error.message);
  }
}

// Maps an appointment status change to a patient-facing notification.
const STATUS_MESSAGES = {
  in_queue: {
    title: "Appointment accepted",
    message: "Your appointment has been accepted and you're in the queue.",
    type: "appointment_accepted",
  },
  consulting: {
    title: "It's your turn",
    message: "The doctor is ready to see you now.",
    type: "appointment_started",
  },
  completed: {
    title: "Appointment completed",
    message: "Your consultation has been marked as completed.",
    type: "appointment_completed",
  },
  cancelled: {
    title: "Appointment cancelled",
    message: "Your appointment was cancelled by the chamber.",
    type: "appointment_cancelled",
  },
  no_show: {
    title: "Marked as no-show",
    message: "You were marked as a no-show for your appointment.",
    type: "appointment_cancelled",
  },
};

async function notifyAppointmentStatusChange(appointment, status) {
  const template = STATUS_MESSAGES[status];
  if (!template || !appointment) return;

  await notifyUser({
    userId: appointment.patientId,
    title: template.title,
    message: template.message,
    type: template.type,
    appointmentId: appointment._id,
  });
}

module.exports = { notifyUser, notifyAppointmentStatusChange };
