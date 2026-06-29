// import { Camera } from "expo-camera";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import { useCallback, useEffect, useState } from "react";

import { showErrorToast, showSuccessToast } from "@/utils/toast";

export function usePermissions() {
  const [loading, setLoading] = useState(false);
  const [perms, setPerms] = useState({
    foregroundLocation: false,
    backgroundLocation: false,
    notifications: false,
  });

  const allGranted = Object.values(perms).every(Boolean);

  const refreshPermissions = useCallback(async () => {
    const [fg, bg, notif] = await Promise.all([
      Location.getForegroundPermissionsAsync(),
      Location.getBackgroundPermissionsAsync(),
      Notifications.getPermissionsAsync(),
    ]);

    setPerms({
      foregroundLocation: fg.status === "granted",
      backgroundLocation: bg.status === "granted",
      notifications: notif.status === "granted",
    });
  }, []);

  useEffect(() => {
    refreshPermissions();
  }, [refreshPermissions]);

  const requestAll = async () => {
    setLoading(true);
    try {
      const fg = await Location.requestForegroundPermissionsAsync();
      const bg = await Location.requestBackgroundPermissionsAsync();
      const notif = await Notifications.requestPermissionsAsync();

      const nextPerms = {
        foregroundLocation: fg.status === "granted",
        backgroundLocation: bg.status === "granted",
        notifications: notif.status === "granted",
      };

      setPerms(nextPerms);

      if (Object.values(nextPerms).every(Boolean)) {
        showSuccessToast("All permissions granted", "Ready");
      } else {
        const denied: string[] = [];
        if (!nextPerms.foregroundLocation) denied.push("Location");
        if (!nextPerms.backgroundLocation) denied.push("Background Location");
        if (!nextPerms.notifications) denied.push("Notifications");

        showErrorToast(
          `Please allow: ${denied.join(", ")}`,
          "Permissions Required",
        );
      }
    } catch {
      showErrorToast("Could not request permissions", "Permission Error");
    } finally {
      setLoading(false);
    }
  };

  return { loading, perms, allGranted, requestAll, refreshPermissions };
}
