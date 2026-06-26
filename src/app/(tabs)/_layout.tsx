// src/app/(tabs)/_layout.tsx

import { Tabs } from "expo-router";
import { Clock3, Home, User } from "lucide-react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        animation: "fade",
        tabBarActiveTintColor: "#f5b041",
        tabBarInactiveTintColor: "#ffffff",
        // headerStyle: { backgroundColor: "#f4f4f4" },
        // headerTitleStyle: { fontWeight: "bold" },
        tabBarStyle: {
          backgroundColor: "#701a40",
          borderTopWidth: 0.5,
          // display: "flex",
          // alignItems: "center",
          // justifyContent: "center",
          elevation: 5, // Android shadow
          shadowOpacity: 0.1, // iOS shadow
          height: 60,
          // paddingBottom: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ size, color }) => <Home size={size} color={color} />,
        }}
      />

      {/* <Tabs.Screen
        name="attendance"
        options={{
          title: "Attendance",
          tabBarIcon: ({ size, color }) => (
            <CalendarDays size={size} color={color} />
          ),
        }}
      /> */}

      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ size, color }) => <Clock3 size={size} color={color} />,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ size, color }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
