// app/(onboarding)/device-registration.tsx

import { DeviceBindingService } from "@/services/DeviceBindingService";
import { registerDevice } from "@/store/slice/deviceSlice";
import { router } from "expo-router";
import { Smartphone } from "lucide-react-native";
import { useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { useDispatch } from "react-redux";

export default function DeviceRegistrationScreen() {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    try {
      setLoading(true);

      const fingerprint = await DeviceBindingService.getFingerprint();

      await DeviceBindingService.saveRegistered(fingerprint);

      dispatch(registerDevice(fingerprint));

      router.replace("/home");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white p-6">
      <Text className="mt-10 text-3xl font-bold">Device Registration</Text>

      <Text className="mt-3 text-gray-500">
        This phone will be linked to your worker account.
      </Text>

      <View className="mt-10 items-center">
        <View className="h-24 w-24 items-center justify-center rounded-full bg-blue-100">
          <Smartphone size={42} color="#2563EB" />
        </View>
      </View>

      <Pressable
        onPress={handleRegister}
        disabled={loading}
        className="mt-10 h-14 items-center justify-center rounded-xl bg-blue-600"
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="font-semibold text-white">Register Device</Text>
        )}
      </Pressable>
    </View>
  );
}
