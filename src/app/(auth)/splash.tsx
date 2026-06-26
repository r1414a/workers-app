// src/app/(auth)/splash.tsx

import { router } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function SplashScreen() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/(auth)/sign-in");
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-3xl font-bold">GeofenceMI</Text>

      <ActivityIndicator
        size="large"
        className="mt-6"
        style={{ animationFillMode: "red" }}
      />
    </View>
  );
}
