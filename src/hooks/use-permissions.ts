// import { Camera } from "expo-camera";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import { useState } from "react";

export function usePermissions() {
  const [loading, setLoading] = useState(false);
  const [perms, setPerms] = useState({
    foregroundLocation: false,
    backgroundLocation: false,
    // camera: false,
    notifications: false,
  });

  const allGranted = Object.values(perms).every(Boolean);

  const requestAll = async () => {
    setLoading(true);
    try {
      const fg = await Location.requestForegroundPermissionsAsync();
      //   console.log("FG", fg);
      const bg = await Location.requestBackgroundPermissionsAsync();
      //   console.log("BG", bg);
      // const cam = await Camera.requestCameraPermissionsAsync();
      const notif = await Notifications.requestPermissionsAsync();
      setPerms({
        foregroundLocation: fg.status === "granted",
        backgroundLocation: bg.status === "granted",
        // camera: cam.status === "granted",
        notifications: notif.status === "granted",
      });
    } finally {
      setLoading(false);
    }
  };

  return { loading, perms, allGranted, requestAll };
}
