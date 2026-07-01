import { requireNativeModule } from "expo-modules-core";

export interface StartTrackingOptions {
  workerId: string;
  siteId: string;
  token: string;
  apiBaseUrl: string;
  shiftStart: string;
  shiftEnd: string;
  deviceToken?: string;
}

interface WorkerTrackingNativeModule {
  startTracking(options: StartTrackingOptions): Promise<void>;
  stopTracking(): Promise<void>;
  isTracking(): Promise<boolean>;
}

const WorkerTracking =
  requireNativeModule<WorkerTrackingNativeModule>("WorkerTracking");

export default WorkerTracking;
