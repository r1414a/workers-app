import { DEMO_MONTHLY_STATS, DEMO_WORKER } from "@/constants/demoData";

import InfoCard from "@/components/profile/InfoCard";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileStats from "@/components/profile/ProfileStats";
import SecurityCard from "@/components/profile/SecurityCard";
import SettingsCard from "@/components/profile/SettingsCard";

import { ScrollView, View } from "react-native";

import Header from "@/components/ui/Header";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 pb-10">
      {/* <StatusBar barStyle="dark-content" /> */}

      <Header text={"Profile"} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <ProfileHeader
          fullName={DEMO_WORKER.fullName}
          employeeId={DEMO_WORKER.employeeId}
        />

        <ProfileStats
          present={DEMO_MONTHLY_STATS.presentDays}
          absent={DEMO_MONTHLY_STATS.absentDays}
          late={DEMO_MONTHLY_STATS.lateDays}
          attendance={DEMO_MONTHLY_STATS.attendancePercent}
        />

        <InfoCard
          title="Personal Information"
          rows={[
            {
              label: "Full Name",
              value: DEMO_WORKER.fullName,
            },
            {
              label: "Employee ID",
              value: DEMO_WORKER.employeeId,
            },
            {
              label: "Mobile",
              value: DEMO_WORKER.mobile,
            },
            {
              label: "Supervisor",
              value: DEMO_WORKER.supervisorName,
            },
          ]}
        />

        <InfoCard
          title="Assigned Site"
          rows={[
            {
              label: "Site",
              value: DEMO_WORKER.siteName,
            },
            {
              label: "Site ID",
              value: DEMO_WORKER.siteId,
            },
            {
              label: "Radius",
              value: `${DEMO_WORKER.siteRadiusMeters}m`,
            },
          ]}
        />

        <InfoCard
          title="Registered Device"
          rows={[
            {
              label: "Model",
              value: DEMO_WORKER.deviceModel,
            },
            {
              label: "Device ID",
              value: DEMO_WORKER.deviceId,
            },
            {
              label: "Version",
              value: DEMO_WORKER.appVersion,
            },
          ]}
        />

        <SecurityCard />

        <SettingsCard />
      </ScrollView>
    </View>
  );
}
