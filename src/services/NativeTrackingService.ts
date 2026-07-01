import { Platform } from "react-native";

import { API_BASE_URL } from "@/constants/api";
import WorkerTracking, {
  type StartTrackingOptions,
} from "worker-tracking";
import type { TrackingSession } from "@/types/location.types";

export class NativeTrackingService {
  static isSupported(): boolean {
    return Platform.OS === "android";
  }

  static async start(
    session: TrackingSession,
    token: string,
    deviceToken = "",
  ): Promise<void> {
    if (!this.isSupported()) return;

    console.log("NativeTrackingService", session,token, deviceToken);
    
    const options: StartTrackingOptions = {
      workerId: session.workerId,
      siteId: session.siteId,
      token,
      apiBaseUrl: API_BASE_URL,
      shiftStart: session.shiftStart,
      shiftEnd: session.shiftEnd,
      deviceToken,
    };

    await WorkerTracking.startTracking(options);
  }

  static async stop(): Promise<void> {
    if (!this.isSupported()) return;
    await WorkerTracking.stopTracking();
  }

  static async isTracking(): Promise<boolean> {
    if (!this.isSupported()) return false;
    return WorkerTracking.isTracking();
  }
}
