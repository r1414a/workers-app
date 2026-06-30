// src/app/(auth)/_layout.tsx

import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="splash" />
      <Stack.Screen name="sign-in" />
      {/* <Stack.Screen name="forgot-password" /> */}
    </Stack>
  );
}
