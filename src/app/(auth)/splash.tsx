// src/app/(auth)/splash.tsx

import { router } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useDispatch } from "react-redux";
import * as SecureStore from "expo-secure-store";
import { DeviceBindingService } from "@/services/DeviceBindingService";
import { TokenService } from "@/services/TokenService";
import { useLazyGetWorkerMeQuery } from "@/store/api/workerApi";
import { loginSuccess, setDeviceRegistered } from "@/store/slice/authSlice";
import { clearAuthSession, persistAuthSession } from "@/utils/auth-session";
import { hasAllPermissions } from "@/utils/permissions";

export default function SplashScreen() {
  const dispatch = useDispatch();
  const [getWorkerMe] = useLazyGetWorkerMeQuery();

  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      await SecureStore.deleteItemAsync("device_fingerprint");
await SecureStore.deleteItemAsync("installation_id");
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (cancelled) return;

      const binding = await DeviceBindingService.validate();
      const deviceReady = binding.isRegistered && binding.isCurrentDevice;
      dispatch(setDeviceRegistered(deviceReady));

      const token = await TokenService.load();

      if (token) {
        try {
          const response = await getWorkerMe().unwrap();
          const worker = response.data.worker;

          await persistAuthSession(token, worker);
          dispatch(loginSuccess({ token, worker }));

          const permissionsGranted = await hasAllPermissions();
          router.replace(
            permissionsGranted ? "/home" : "/(onboarding)/permissions",
          );
          return;
        } catch {
          await clearAuthSession();
        }
      }

      router.replace("/(auth)/sign-in");
    };

    bootstrap();

    return () => {
      cancelled = true;
    };
  }, [dispatch, getWorkerMe]);

  return (
    <View className="flex-1 items-center justify-center bg-maroon">
      <Text className="text-white text-3xl font-bold">Iravya Attendance</Text>

      <ActivityIndicator size="large" color="#D4AF37" className="mt-6" />
    </View>
  );
}
