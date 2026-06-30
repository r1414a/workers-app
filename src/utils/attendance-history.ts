import type { AttendanceHistoryRecord } from "@/types/api.types";
import type { AttendanceRecord } from "@/types/attendance.types";
import { formatShiftTime } from "@/utils/shift";

function toDateKey(date: string | Date): string {
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function mapAttendanceHistoryRecord(
  record: AttendanceHistoryRecord,
): AttendanceRecord {
  const isAbsent = record.status === "ABSENT";
  const isLate = record.status === "LATE";

  let status: AttendanceRecord["status"];
  if (isAbsent) {
    status = "absent";
  } else if (isLate) {
    status = "late";
  } else if (record.exitTime) {
    status = "checked_out";
  } else if (record.arrivalTime) {
    status = "checked_in";
  } else {
    status = "checked_out";
  }

  const totalHours =
    record.totalHours == null
      ? null
      : typeof record.totalHours === "string"
        ? parseFloat(record.totalHours)
        : record.totalHours;

  return {
    id: record.id,
    workerId: record.userId,
    siteId: record.siteId,
    siteName: record.site?.name ?? "",
    date: toDateKey(record.date),
    checkInTime: record.arrivalTime
      ? formatShiftTime(record.arrivalTime)
      : null,
    checkOutTime: record.exitTime ? formatShiftTime(record.exitTime) : null,
    checkInGps: null,
    checkOutGps: null,
    checkInSelfiePath: null,
    checkOutSelfiePath: null,
    faceMatchScore: null,
    isMockLocation: false,
    deviceHash: "",
    hoursWorked: totalHours,
    status,
    syncStatus: "synced",
    isLate,
    lateByMinutes: 0,
  };
}

export function mapAttendanceHistory(
  records: AttendanceHistoryRecord[],
): AttendanceRecord[] {
  return records.map(mapAttendanceHistoryRecord);
}
