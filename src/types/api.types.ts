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
  worker: VerifiedWorker;
}
