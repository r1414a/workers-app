import type { WorkerSite } from "@/types/api.types";
import { WorkerProfile } from "@/types/worker.types";
import * as SecureStore from "expo-secure-store";

const WORKER_SESSION_KEY = "worker_session";

export interface WorkerSession {
  token: string;
  worker: WorkerProfile;
  assignedSite: WorkerSite | null;
}

export class AuthSessionService {
  static async save(session: WorkerSession) {
    await SecureStore.setItemAsync(WORKER_SESSION_KEY, JSON.stringify(session));
  }

  static async load(): Promise<WorkerSession | null> {
    const raw = await SecureStore.getItemAsync(WORKER_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as WorkerSession;
  }

  static async clear() {
    await SecureStore.deleteItemAsync(WORKER_SESSION_KEY);
  }
}
