import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

import { LocationTrackingService } from "@/services/LocationTrackingService";
import { socketService } from "@/services/SocketService";
import { selectUser } from "@/store/slice/authSlice";
import type { TrackingSession } from "@/types/location.types";

import { isWithinShift } from "@/utils/shift";
import { showErrorToast, showInfoToast, showSuccessToast } from "@/utils/toast";

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

  // ── Socket: connect + join site once, listen for alerts ───────────────────
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

    // joinSite handles connect + a single join (and auto re-join on reconnect).
    socketService.joinSite(workerId, siteId);

    return () => {
      socketService.disconnect();
    };
  }, [isLoggedIn, workerId, siteId]);

  // ── Shift window: start/stop background location updates ──────────────────
  useEffect(() => {
    if (!isLoggedIn || !workerId || !siteId || !shiftStart || !shiftEnd) return;

    const session: TrackingSession = {
      workerId,
      siteId,
      shiftStart,
      shiftEnd,
    };

    const syncTracking = async () => {
      const inShift = isWithinShift(shiftStart, shiftEnd);

      if (inShift && !trackingRef.current) {
        await LocationTrackingService.start(session);
        trackingRef.current = true;
      } else if (!inShift && trackingRef.current) {
        await LocationTrackingService.stop();
        trackingRef.current = false;
      }
    };

    syncTracking();
    const shiftInterval = setInterval(syncTracking, SHIFT_CHECK_INTERVAL_MS);

    return () => {
      clearInterval(shiftInterval);
    };
  }, [isLoggedIn, workerId, siteId, shiftStart, shiftEnd]);
}
