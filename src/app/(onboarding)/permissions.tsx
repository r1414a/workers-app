// src/app/(onboarding)/permissions.tsx

import { router } from "expo-router";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

import { Bell, MapPin } from "lucide-react-native";

import { usePermissions } from "@/hooks/use-permissions";
import { showErrorToast } from "@/utils/toast";

export default function PermissionsScreen() {
  const { loading, perms, allGranted, requestAll } = usePermissions();

  const handleContinue = () => {
    if (!allGranted) {
      showErrorToast(
        "All permissions are required before you can continue",
        "Permissions Required",
      );
      return;
    }

    router.replace("/home");
  };

  return (
    <View className="flex-1 justify-center bg-maroon p-6">
      <Text className="mt-10 text-white text-3xl text-center font-bold">
        Permissions
      </Text>

      <Text className="mt-2 text-center text-gray-300">
        We need these permissions to verify attendance and site presence.
      </Text>

      <View className="mt-10 gap-4">
        <PermissionCard
          icon={<MapPin size={24} color={"gray"} />}
          title="Location"
          granted={perms.foregroundLocation}
        />

        <PermissionCard
          icon={<MapPin size={24} color={"gray"} />}
          title="Background Location"
          granted={perms.backgroundLocation}
        />

        <PermissionCard
          icon={<Bell size={24} />}
          title="Notifications"
          granted={perms.notifications}
        />
      </View>

      {!allGranted && (
        <Pressable
          onPress={requestAll}
          disabled={loading}
          className="mt-10 h-14 items-center justify-center rounded-xl bg-white"
        >
          {loading ? (
            <ActivityIndicator color="#701a40" />
          ) : (
            <Text className="font-semibold text-maroon">Grant Permissions</Text>
          )}
        </Pressable>
      )}

      {allGranted && (
        <Pressable
          className="mt-10 h-14 items-center justify-center rounded-xl bg-white"
          onPress={handleContinue}
        >
          <Text className="font-semibold text-maroon">Continue to Home</Text>
        </Pressable>
      )}
    </View>
  );
}

function PermissionCard({
  title,
  granted,
  icon,
}: {
  title: string;
  granted: boolean;
  icon: React.ReactNode;
}) {
  return (
    <View className="flex-row items-center justify-between rounded-xl bg-white p-4">
      <View className="flex-row items-center gap-3">
        {icon}
        <Text className="text-gray-900 font-semibold">{title}</Text>
      </View>

      <View
        className={`h-3 w-3 rounded-full ${
          granted ? "bg-green-500" : "bg-red-500"
        }`}
      />
    </View>
  );
}
