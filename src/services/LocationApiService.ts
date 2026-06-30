import { API_BASE_URL } from "@/constants/api";
import { TokenService } from "@/services/TokenService";
import type { LocationUpdatePayload } from "@/types/location.types";

export class LocationApiService {
  static async postLocationUpdate(
    payload: LocationUpdatePayload,
  ): Promise<void> {
    const token = await TokenService.load();

    if (!token) {
      throw new Error("No auth token available for location upload");
    }

    const response = await fetch(`${API_BASE_URL}/worker/location`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      const message =
        typeof body?.message === "string"
          ? body.message
          : `Location upload failed (${response.status})`;
      throw new Error(message);
    }
  }
}
