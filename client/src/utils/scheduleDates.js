const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Given a list of schedule entries with a `day` field ("Monday", etc.), returns the
// next `count` upcoming calendar dates (within `withinDays`) that fall on one of
// those weekdays — so patients can pre-book on a day the doctor actually works.
export function getUpcomingDatesForSchedule(schedule, count = 6, withinDays = 21) {
  const workingDays = new Set((schedule || []).map((s) => s.day));
  const dates = [];

  for (let i = 0; i < withinDays && dates.length < count; i++) {
    const d = new Date();
    d.setHours(9, 0, 0, 0);
    d.setDate(d.getDate() + i);
    const dayName = DAY_NAMES[d.getDay()];
    if (workingDays.size === 0 || workingDays.has(dayName)) {
      dates.push({
        date: d,
        label:
          i === 0
            ? `Today, ${dayName.slice(0, 3)} ${d.getDate()}/${d.getMonth() + 1}`
            : i === 1
            ? `Tomorrow, ${dayName.slice(0, 3)} ${d.getDate()}/${d.getMonth() + 1}`
            : `${dayName.slice(0, 3)} ${d.getDate()}/${d.getMonth() + 1}`,
      });
    }
  }

  return dates;
}
