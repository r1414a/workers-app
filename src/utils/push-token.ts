import * as Notifications from "expo-notifications";

export async function getDevicePushToken(): Promise<string> {
  try {
    const permissions = await Notifications.getPermissionsAsync();
    if (permissions.status !== "granted") {
      return "";
    }

    const token = await Notifications.getExpoPushTokenAsync();
    return token.data;
  } catch {
    return "";
  }
}
