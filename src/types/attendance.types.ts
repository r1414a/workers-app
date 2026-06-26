// types/attendance.types.ts

export type AttendanceStatus = "checked_in" | "checked_out" | "absent" | "late";
export type SyncStatus = "synced" | "pending" | "failed";

export interface GpsCoords {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

export interface AttendanceRecord {
  id: string;
  workerId: string;
  siteId: string;
  siteName: string;
  date: string; // 'YYYY-MM-DD'
  checkInTime: string | null; // 'HH:MM AM/PM'
  checkOutTime: string | null;
  checkInGps: GpsCoords | null;
  checkOutGps: GpsCoords | null;
  checkInSelfiePath: string | null;
  checkOutSelfiePath: string | null;
  faceMatchScore: number | null; // 0–100
  isMockLocation: boolean;
  deviceHash: string;
  hoursWorked: number | null; // decimal hours
  status: AttendanceStatus;
  syncStatus: SyncStatus;
  isLate: boolean;
  lateByMinutes: number;
}
