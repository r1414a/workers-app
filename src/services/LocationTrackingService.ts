import { LOCATION_TASK_NAME, TRACKING_SESSION_KEY } from "@/constants/location";
import { DeviceIntegrityService } from "@/services/DeviceIntegrityService";
import { LocationApiService } from "@/services/LocationApiService";
import { NativeTrackingService } from "@/services/NativeTrackingService";
import { TokenService } from "@/services/TokenService";
import type { TrackingSession } from "@/types/location.types";
import { getDevicePushToken } from "@/utils/push-token";
import { isWithinShift } from "@/utils/shift";
import * as Location from "expo-location";
import * as SecureStore from "expo-secure-store";
import * as TaskManager from "expo-task-manager";
import { Platform } from "react-native";

async function readSession(): Promise<TrackingSession | null> {
  const raw = await SecureStore.getItemAsync(TRACKING_SESSION_KEY);
  if (!raw) return null;
  return JSON.parse(raw) as TrackingSession;
}

async function handleLocationUpdate(locations: Location.LocationObject[]) {
  const session = await readSession();
  if (!session) return;

  if (!isWithinShift(session.shiftStart, session.shiftEnd)) {
    return;
  }

  const location = locations[locations.length - 1];
  if (!location) return;

  const integrity = await DeviceIntegrityService.getIntegrityFlags(location);
  const deviceToken = await getDevicePushToken();

  await LocationApiService.postLocationUpdate({
    workerId: session.workerId,
    siteId: session.siteId,
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    timestamp: location.timestamp ?? Date.now(),
    isMocked: integrity.isMocked,
    isVpn: integrity.isVpn,
    gps: integrity.gps,
    deviceToken,
  });
}

if (Platform.OS === "ios") {
  TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
    if (error) {
      console.error("Background location task error:", error);
      return;
    }

    const { locations } = data as { locations: Location.LocationObject[] };
    await handleLocationUpdate(locations);
  });
}

export class LocationTrackingService {
  static async saveSession(session: TrackingSession) {
    await SecureStore.setItemAsync(
      TRACKING_SESSION_KEY,
      JSON.stringify(session),
    );
  }

  static async clearSession() {
    await SecureStore.deleteItemAsync(TRACKING_SESSION_KEY);
  }

  static async isTrackingActive() {
    if (NativeTrackingService.isSupported()) {
      return NativeTrackingService.isTracking();
    }

    return TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME);
  }

  static async start(session: TrackingSession) {
    await this.saveSession(session);

    if (NativeTrackingService.isSupported()) {
      const token = await TokenService.load();
      if (!token) {
        throw new Error("No auth token available to start native tracking");
      }

      const deviceToken = await getDevicePushToken();

      console.log("LocationTrackingService", session,token, deviceToken);
      await NativeTrackingService.start(session, token, deviceToken);
      return;
    }

    const hasStarted =
      await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);

    if (hasStarted) return;

    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.High,
      timeInterval: 30_000,
      distanceInterval: 25,
      showsBackgroundLocationIndicator: true,
      foregroundService: {
        notificationTitle: "Iravya Attendance",
        notificationBody: "Tracking your location during shift",
        notificationColor: "#701a40",
      },
      pausesUpdatesAutomatically: false,
    });
  }

  static async stop() {
    if (NativeTrackingService.isSupported()) {
      await NativeTrackingService.stop();
      await this.clearSession();
      return;
    }

    const hasStarted =
      await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);

    if (hasStarted) {
      await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
    }

    await this.clearSession();
  }
}
