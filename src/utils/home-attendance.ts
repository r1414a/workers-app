import type { WeekAttendanceRecord } from "@/types/api.types";

export const THIS_WEEK_DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT"];

export type WeekDayStatus =
  | "checked_out"
  | "checked_in"
  | "late"
  | "absent"
  | "future"
  | "today";

function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getMondayOfCurrentWeek(reference = new Date()): Date {
  const day = reference.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(reference);
  monday.setDate(reference.getDate() + diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

function mapRecordStatus(
  record: WeekAttendanceRecord,
  isToday: boolean,
): WeekDayStatus {
  switch (record.status) {
    case "PRESENT":
      return record.exitTime || !isToday ? "checked_out" : "checked_in";
    case "LATE":
      return "late";
    case "ABSENT":
      return "absent";
    default:
      return "absent";
  }
}

export function buildWeekCalendarData(
  weekAttendance: WeekAttendanceRecord[] = [],
) {
  const monday = getMondayOfCurrentWeek();
  const todayKey = toDateKey(new Date());
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  const byDate = new Map(
    weekAttendance.map((record) => [
      toDateKey(new Date(record.date)),
      record,
    ]),
  );

  return THIS_WEEK_DAYS.map((day, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    const key = toDateKey(date);
    const record = byDate.get(key);
    const isToday = key === todayKey;
    const isFuture = date > endOfToday;

    let status: WeekDayStatus = "absent";

    if (isFuture) {
      status = "future";
    } else if (isToday && !record) {
      status = "today";
    } else if (record) {
      status = mapRecordStatus(record, isToday);
    }

    return { day, status };
  });
}
