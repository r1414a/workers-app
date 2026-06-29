import * as Location from "expo-location";
import * as Notifications from "expo-notifications";

export async function hasAllPermissions() {
  const [fg, bg, notif] = await Promise.all([
    Location.getForegroundPermissionsAsync(),
    Location.getBackgroundPermissionsAsync(),
    Notifications.getPermissionsAsync(),
  ]);

  return (
    fg.status === "granted" &&
    bg.status === "granted" &&
    notif.status === "granted"
  );
}
