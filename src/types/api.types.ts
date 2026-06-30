export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

export interface ApiErrorResponse {
  status: string;
  message: string;
}

export interface WorkerSite {
  id: string;
  name: string;
  latitude: string;
  longitude: string;
  geofenceRadius: number;
  startTime: string;
  endTime: string;
}

export interface VerifyWorkerRequest {
  phone: string;
  fingerprint: string;
  manufacturer: string;
  brand: string;
  model: string;
  device: string;
}

export interface VerifiedWorker {
  id: string;
  firstName: string;
  lastName: string | null;
  phone: string | null;
  isVerified: boolean;
  role: string;
  site: WorkerSite | null;
}

export interface VerifyWorkerData {
  worker_: VerifiedWorker;
  fingerprint: string;
  alreadyRegistered?: boolean;
}

export interface WorkerLoginRequest {
  phone: string;
  fingerprint: string;
}

export interface WorkerLoginData {
  token: string;
  worker: VerifiedWorker;
}

export interface WorkerMeData {
  worker: WorkerMeProfile;
}

export type ApiAttendanceStatus =
  | "PRESENT"
  | "ABSENT"
  | "LATE"
  | "HALF_DAY"
  | "LEAVE";

export interface WeekAttendanceRecord {
  id: string;
  userId: string;
  siteId: string;
  date: string;
  arrivalTime: string | null;
  exitTime: string | null;
  totalHours: string | number | null;
  status: ApiAttendanceStatus;
  entryCount: number;
  exitCount: number;
}

export interface MonthAttendanceStats {
  attendancePercentage: number;
  present: number;
  absent: number;
  late: number;
  totalDays: number;
}

export interface WorkerMeProfile extends VerifiedWorker {
  current_week_attendance: WeekAttendanceRecord[];
  current_month_attendance: MonthAttendanceStats;
}
