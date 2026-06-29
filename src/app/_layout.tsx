// import { DarkTheme, DefaultTheme, ThemeProvider } from "expo-router";
// import { useColorScheme } from "react-native";

// import { AnimatedSplashOverlay } from "@/components/animated-icon";
// import AppTabs from "@/components/app-tabs";
// import { store } from "@/store";
// import { Provider } from "react-redux";

// export default function TabLayout() {
//   const colorScheme = useColorScheme();
//   return (
//     <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
//       <Provider store={store}>
//         <AnimatedSplashOverlay />
//         <AppTabs />
//       </Provider>
//     </ThemeProvider>
//   );
// }

// src/app/_layout.tsx

import { store } from "@/store";
import { LocationTrackerProvider } from "@/components/LocationTrackerProvider";
import "@/services/LocationTrackingService";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { Provider } from "react-redux";
import "../global.css";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <StatusBar style="light" backgroundColor="#701a40" />
          <LocationTrackerProvider>
            <Stack screenOptions={{ headerShown: false }} />
          </LocationTrackerProvider>
          <Toast />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </Provider>
  );
}
