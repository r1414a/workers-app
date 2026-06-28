import { API_BASE_URL } from "@/constants/api";

export const SOCKET_BASE_URL =
  process.env.EXPO_PUBLIC_SOCKET_URL ??
  API_BASE_URL.replace(/\/api\/v1\/?$/, "");

export const LOCATION_TASK_NAME = "worker-background-location";

export const TRACKING_SESSION_KEY = "tracking_session";
