// src/app/(onboarding)/_layout.tsx

import { Stack } from "expo-router";

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="permissions" />
      {/* <Stack.Screen name="personal-info" />
      <Stack.Screen name="profile-photo" /> */}
    </Stack>
  );
}
