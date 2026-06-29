// src/services/device-binding.service.ts

import type { VerifyWorkerRequest } from "@/types/api.types";
import * as Application from "expo-application";
import * as Crypto from "expo-crypto";
import * as Device from "expo-device";
import * as SecureStore from "expo-secure-store";

const DEVICE_KEY = "device_fingerprint";
const INSTALL_KEY = "installation_id";

export class DeviceBindingService {
  static async getVerifyPayload(phone: string): Promise<VerifyWorkerRequest> {
    const fp = await DeviceBindingService.getFingerprint();

    return {
      phone,
      fingerprint: fp.fingerprintHash,
      manufacturer: Device.manufacturer ?? "unknown",
      brand: fp.brand ?? "unknown",
      model: fp.model ?? "unknown",
      device: Device.deviceName ?? fp.model ?? "unknown",
    };
  }

  static async getFingerprint() {
    let installationId = await SecureStore.getItemAsync(INSTALL_KEY);

    if (!installationId) {
      installationId = Crypto.randomUUID();

      await SecureStore.setItemAsync(INSTALL_KEY, installationId);
    }

    const raw = {
      installationId,
      brand: Device.brand,
      model: Device.modelName,
      osVersion: Device.osVersion,
      appVersion: Application.nativeApplicationVersion,
    };

    const fingerprintHash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      JSON.stringify(raw),
    );

    return {
      ...raw,
      fingerprintHash,
    };
  }

  static async saveRegistered(fp: any) {
    await SecureStore.setItemAsync(
      DEVICE_KEY,
      JSON.stringify({
        ...fp,
        registeredAt: new Date().toISOString(),
      }),
    );
  }

  static async validate() {
    const stored = await SecureStore.getItemAsync(DEVICE_KEY);

    if (!stored) {
      return {
        isRegistered: false,
        isCurrentDevice: false,
        registeredAt: null,
        mismatchReason: "not_registered",
      };
    }

    const saved = JSON.parse(stored);

    const current = await DeviceBindingService.getFingerprint();

    return {
      isRegistered: true,
      isCurrentDevice: saved.fingerprintHash === current.fingerprintHash,
      registeredAt: saved.registeredAt,
      mismatchReason:
        saved.fingerprintHash !== current.fingerprintHash
          ? "device_changed"
          : null,
    };
  }
}
