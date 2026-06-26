// components/common/AppHeader.tsx

import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type AppHeaderProps = {
  title?: string;
  subtitle?: string;
  employeeId?: string;
  userName?: string;
  showDate?: boolean;
  showBackButton?: boolean;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function AppHeader({
  title,
  subtitle,
  employeeId,
  userName = "Worker",
  showDate = true,
  showBackButton = false,
}: AppHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="bg-maroon border-b border-gray-200 px-5 pb-4"
      style={{ paddingTop: insets.top + 12 }}
    >
      <View className="flex-row items-center">
        <View className="flex-1">
          {subtitle && (
            <Text className="text-sm text-gold mb-0.5">{subtitle}</Text>
          )}

          <Text className="text-xl font-bold text-white">{title}</Text>
        </View>

        {showBackButton ? (
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-11 h-11 rounded-full bg-gray-100 items-center justify-center"
          >
            <Text className="text-lg">←</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/profile")}
            className="w-11 h-11 rounded-full bg-gold items-center justify-center"
          >
            <Text className="text-white font-bold">
              {getInitials(userName)}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View className="flex-row items-center mt-2">
        {employeeId && (
          <View className="bg-blue-50 rounded-full px-2.5 py-1 mr-2">
            <Text className="text-xs text-blue-700 font-medium">
              {employeeId}
            </Text>
          </View>
        )}

        {showDate && (
          <Text className="text-xs text-gray-400">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "short",
            })}
          </Text>
        )}

        <View className="ml-auto flex-row items-center bg-green-50 rounded-full px-2.5 py-1">
          <View className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1" />
          <Text className="text-xs text-green-700 font-medium">Synced</Text>
        </View>
      </View>
    </View>
  );
}
