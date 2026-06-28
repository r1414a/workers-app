import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";

import type { ApiErrorResponse } from "@/types/api.types";

export function getApiErrorMessage(
  error: unknown,
  fallback = "Something went wrong",
): string {
  if (!error || typeof error !== "object") return fallback;

  if ("status" in error) {
    const fetchError = error as FetchBaseQueryError;
    const data = fetchError.data as ApiErrorResponse | undefined;
    if (data?.message) return data.message;
    if (typeof fetchError.status === "number") {
      return `Request failed (${fetchError.status})`;
    }
    return fallback;
  }

  if ("message" in error) {
    const serialized = error as SerializedError;
    if (serialized.message) return serialized.message;
  }

  return fallback;
}
