import { AuthSessionService } from "@/services/AuthSessionService";
import { LocationTrackingService } from "@/services/LocationTrackingService";
import { TokenService } from "@/services/TokenService";
import type { VerifiedWorker } from "@/types/api.types";
import { WorkerProfile } from "@/types/worker.types";

export function mapVerifiedWorkerToProfile(worker: VerifiedWorker): WorkerProfile {
  return {
    fullName: [worker.firstName, worker.lastName].filter(Boolean).join(" "),
    employeeId: worker.id,
    mobileNumber: worker.phone ?? "",
    emergencyContact: "",
    bloodGroup: "",
  };
}

export async function persistAuthSession(token: string, worker: VerifiedWorker) {
  await TokenService.save(token);

  await AuthSessionService.save({
    token,
    worker: mapVerifiedWorkerToProfile(worker),
    assignedSite: worker.site,
  });
}

export async function clearAuthSession() {
  await LocationTrackingService.stop();
  await Promise.all([TokenService.clear(), AuthSessionService.clear()]);
}
