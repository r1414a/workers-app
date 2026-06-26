// constants/demoData.ts
// All mock data for demo mode — swap with real API calls when backend is ready

import type { AttendanceRecord } from "@/types/attendance.types";

export const DEMO_WORKER = {
  id: "W-2847",
  fullName: "Rajesh Kumar",
  employeeId: "EMP-2847",
  mobile: "+91 98200 11234",
  siteName: "Oberoi Realty — Tower C",
  siteId: "SITE-001",
  siteLat: 19.0762,
  siteLng: 72.878,
  siteRadiusMeters: 250,
  shiftStart: "08:00 AM",
  shiftEnd: "05:00 PM",
  supervisorName: "Arun Mehta",
  deviceModel: "Samsung Galaxy S23",
  deviceId: "a1b2c3d4e5f6",
  appVersion: "1.0.0",
  profilePhoto: null as string | null,
};

// Simulate GPS slightly inside the site boundary
export const DEMO_GPS = {
  latitude: 19.076,
  longitude: 72.8777,
  accuracy: 8.4,
  timestamp: Date.now(),
};

// Distance from site centre in metres (haversine result of above coords)
export const DEMO_DISTANCE_METERS = 38;

const makeRecord = (
  daysAgo: number,
  status: AttendanceRecord["status"],
  checkIn: string | null,
  checkOut: string | null,
  hours: number | null,
  isLate = false,
  lateBy = 0,
): AttendanceRecord => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  const dateStr = d.toISOString().split("T")[0];
  return {
    id: `ATT-${dateStr}-${Math.random().toString(36).slice(2, 6)}`,
    workerId: DEMO_WORKER.id,
    siteId: DEMO_WORKER.siteId,
    siteName: DEMO_WORKER.siteName,
    date: dateStr,
    checkInTime: checkIn,
    checkOutTime: checkOut,
    checkInGps: checkIn
      ? {
          latitude: 19.076,
          longitude: 72.8777,
          accuracy: 8.4,
          timestamp: Date.now(),
        }
      : null,
    checkOutGps: checkOut
      ? {
          latitude: 19.076,
          longitude: 72.8777,
          accuracy: 9.1,
          timestamp: Date.now(),
        }
      : null,
    checkInSelfiePath: checkIn ? "demo://selfie-checkin.jpg" : null,
    checkOutSelfiePath: checkOut ? "demo://selfie-checkout.jpg" : null,
    faceMatchScore: checkIn ? 94 : null,
    isMockLocation: false,
    deviceHash: "a1b2c3d4e5f6",
    hoursWorked: hours,
    status,
    syncStatus: "synced",
    isLate,
    lateByMinutes: lateBy,
  };
};

// Pre-seeded history — most recent first
export const DEMO_HISTORY: AttendanceRecord[] = [
  // today — no record yet (worker hasn't checked in)
  makeRecord(1, "checked_out", "08:47 AM", "05:12 PM", 8.42),
  makeRecord(2, "checked_out", "09:15 AM", "05:05 PM", 7.83, true, 75),
  makeRecord(3, "checked_out", "07:58 AM", "05:00 PM", 9.03),
  makeRecord(4, "absent", null, null, null),
  makeRecord(5, "checked_out", "08:02 AM", "04:48 PM", 8.77),
  makeRecord(6, "checked_out", "08:11 AM", "05:00 PM", 8.82),
  makeRecord(7, "checked_out", "08:55 AM", "05:20 PM", 8.42, true, 55),
  makeRecord(8, "checked_out", "07:59 AM", "05:01 PM", 9.03),
  makeRecord(9, "absent", null, null, null),
  makeRecord(10, "checked_out", "08:03 AM", "05:05 PM", 9.03),
  makeRecord(11, "checked_out", "08:01 AM", "04:55 PM", 8.9),
  makeRecord(12, "checked_out", "08:22 AM", "05:00 PM", 8.63, true, 22),
  makeRecord(13, "checked_out", "07:55 AM", "05:00 PM", 9.08),
  makeRecord(14, "checked_out", "08:00 AM", "05:00 PM", 9.0),
  makeRecord(15, "checked_out", "08:18 AM", "05:10 PM", 8.87, true, 18),
  makeRecord(16, "checked_out", "08:05 AM", "05:00 PM", 8.92),
  makeRecord(17, "absent", null, null, null),
  makeRecord(18, "checked_out", "07:58 AM", "04:50 PM", 8.87),
  makeRecord(19, "checked_out", "08:10 AM", "05:00 PM", 8.83),
  makeRecord(20, "checked_out", "08:01 AM", "05:01 PM", 9.0),
];

export const DEMO_MONTHLY_STATS = {
  presentDays: 17,
  absentDays: 3,
  lateDays: 5,
  totalWorkingDays: 20,
  attendancePercent: 85,
};

export const THIS_WEEK_DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT"];
