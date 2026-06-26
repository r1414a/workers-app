export interface DeviceFingerprint {
  installationId: string;
  model: string | null;
  brand: string | null;
  osVersion: string | null;
  appVersion: string | null;
  fingerprintHash: string; // SHA-256 of above
}

export interface DeviceBindingStatus {
  isRegistered: boolean;
  isCurrentDevice: boolean;
  registeredAt: string | null;
  mismatchReason: string | null;
}
