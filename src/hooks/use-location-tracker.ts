import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

import { LocationTrackingService } from "@/services/LocationTrackingService";
import { socketService } from "@/services/SocketService";
import { selectUser } from "@/store/slice/authSlice";
import type { TrackingSession } from "@/types/location.types";
import { hasAllPermissions } from "@/utils/permissions";
import * as Location from "expo-location";
import { isWithinShift } from "@/utils/shift";
import { showErrorToast, showInfoToast, showSuccessToast } from "@/utils/toast";
import { Alert } from "react-native";

const SHIFT_CHECK_INTERVAL_MS = 60_000;

const ALERT_TOAST: Record<string, { title: string; type: "success" | "error" | "info" }> = {
  MARKED_ATTENDANCE: { title: "Attendance", type: "success" },
  EXIT_ALERT: { title: "Site Exit", type: "error" },
  IMPOSSIBLE_TRAVEL: { title: "Travel Alert", type: "error" },
  FAKE_LOCATION: { title: "Fake Location", type: "error" },
  VPN_DETECTION: { title: "VPN Detected", type: "error" },
  GPS_OFF: { title: "GPS Off", type: "error" },
};

export function useLocationTracker() {
  const { isLoggedIn, worker, assignedSite } = useSelector(selectUser);
  const trackingRef = useRef(false);

  const workerId = worker?.employeeId;
  const siteId = assignedSite?.id;
  const shiftStart = assignedSite?.startTime;
  const shiftEnd = assignedSite?.endTime;

  useEffect(() => {
    if (!isLoggedIn || !workerId || !siteId) return;

    socketService.onAlert((alert) => {
      const config = ALERT_TOAST[alert.type] ?? {
        title: "Alert",
        type: "info" as const,
      };

      if (config.type === "success") {
        showSuccessToast(alert.message, config.title);
      } else if (config.type === "error") {
        showErrorToast(alert.message, config.title);
      } else {
        showInfoToast(alert.message, config.title);
      }
    });

    socketService.joinSite(workerId, siteId);

    return () => {
      socketService.disconnect();
    };
  }, [isLoggedIn, workerId, siteId]);

  useEffect(() => {
    if (!isLoggedIn) {
      if (trackingRef.current) {
        void LocationTrackingService.stop();
        trackingRef.current = false;
      }
      return;
    }

    if (!workerId || !siteId || !shiftStart || !shiftEnd) return;

    const session: TrackingSession = {
      workerId,
      siteId,
      shiftStart,
      shiftEnd,
    };

    const syncTracking = async () => {
      const inShift = isWithinShift(shiftStart, shiftEnd);
      const permissionsGranted = await hasAllPermissions();

      if (inShift && permissionsGranted && !trackingRef.current) {
        // console.log("KJHKJHKJJK",inShift, permissionsGranted)
        const servicesEnabled = await Location.hasServicesEnabledAsync();
        if (!servicesEnabled) {
  Alert.alert(
    "Location is Off",
    "Please turn on Location Services to start attendance tracking."
  );
  return;
}
        await LocationTrackingService.start(session);
        trackingRef.current = true;
      } else if ((!inShift || !permissionsGranted) && trackingRef.current) {
        await LocationTrackingService.stop();
        trackingRef.current = false;
      }
    };

    syncTracking();
    const shiftInterval = setInterval(syncTracking, SHIFT_CHECK_INTERVAL_MS);

    return () => {
      clearInterval(shiftInterval);
      if (trackingRef.current) {
        void LocationTrackingService.stop();
        trackingRef.current = false;
      }
    };
  }, [isLoggedIn, workerId, siteId, shiftStart, shiftEnd]);
}
