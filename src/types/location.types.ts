import type { WorkerSite } from "@/types/api.types";

export type { WorkerSite };

export interface LocationUpdatePayload {
  workerId: string;
  siteId: string;
  latitude: number;
  longitude: number;
  timestamp: number;
  isMocked: boolean;
  isVpn: boolean;
  gps: boolean;
}

export interface WorkerAlert {
  type: string;
  message: string;
}

export interface TrackingSession {
  workerId: string;
  siteId: string;
  shiftStart: string;
  shiftEnd: string;
}
