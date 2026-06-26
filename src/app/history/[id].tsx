// import { useState } from "react";
// import {
//   ScrollView,
//   StatusBar,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { useSelector } from "react-redux";

// import { FilterType } from "@/components/history/AttendanceFilters";

// import { DEMO_HISTORY } from "@/constants/demoData";
// import { selectHistory } from "@/store/slice/attendanceSlice";
// import { router, useLocalSearchParams } from "expo-router";
// import { useSafeAreaInsets } from "react-native-safe-area-context";

// const SITE_NAME = "Oberoi Realty — Tower C";

// export default function AttendanceDetailScreen() {
//   const { id } = useLocalSearchParams();
//   const insets = useSafeAreaInsets();
//   const [filter, setFilter] = useState<FilterType>("month");

//   const history = useSelector(selectHistory);

//   const records = history.length > 0 ? history : DEMO_HISTORY;

//   const record = records.find((item) => item.id === id);

//   if (!record) {
//     return (
//       <View className="flex-1 items-center justify-center">
//         <Text>Attendance record not found</Text>
//       </View>
//     );
//   }

//   return (
//     <View className="flex-1">
//       <StatusBar barStyle="dark-content" />

//       {/* Header */}
//       <View
//         className="border-b border-gray-200 bg-maroon"
//         style={{
//           paddingTop: insets.top + 8,
//           paddingHorizontal: 20,
//           paddingBottom: 16,
//           flexDirection: "row",
//           alignItems: "center",
//         }}
//       >
//         <TouchableOpacity
//           onPress={() => router.back()}
//           className="bg-gold"
//           style={{
//             width: 36,
//             height: 36,
//             borderRadius: 10,
//             alignItems: "center",
//             justifyContent: "center",
//             marginRight: 14,
//           }}
//         >
//           <Text className="text-white text-xl">←</Text>
//         </TouchableOpacity>
//         <View>
//           <Text className="text-white font-bold text-xl">
//             Attendance Details
//           </Text>
//           <Text className="text-gold text-xs">{SITE_NAME}</Text>
//         </View>
//       </View>
//       <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
//         {/* <Text className="text-2xl font-bold mb-5">Attendance Details</Text> */}

//         <View className="bg-white rounded-2xl p-5 mb-4">
//           <Text className="text-slate-500">Site</Text>

//           <Text className="font-bold text-lg">{record.siteName}</Text>
//         </View>

//         <View className="bg-white rounded-2xl p-5 mb-4">
//           <Text className="font-semibold mb-3">Check In</Text>

//           <Text>{record.checkInTime}</Text>

//           <Text className="mt-4 font-semibold mb-3">Check Out</Text>

//           <Text>{record.checkOutTime}</Text>
//         </View>

//         <View className="bg-white rounded-2xl p-5 mb-4">
//           <Text className="font-semibold mb-2">GPS Verification</Text>

//           <Text>Accuracy: {record.checkInGps?.accuracy ?? "--"}m</Text>

//           <Text>
//             Mock Location: {record.isMockLocation ? "Detected" : "No"}
//           </Text>
//         </View>

//         <View className="bg-white rounded-2xl p-5">
//           <Text className="font-semibold mb-2">Face Verification</Text>

//           <Text>Match Score: {record.faceMatchScore ?? "--"}%</Text>

//           <Text>Device: {record.deviceHash}</Text>
//         </View>
//       </ScrollView>
//     </View>
//   );
// }

import { ScrollView, Text, View } from "react-native";
import { useSelector } from "react-redux";

import Header from "@/components/ui/Header";
import { DEMO_HISTORY } from "@/constants/demoData";
import { selectHistory } from "@/store/slice/attendanceSlice";
import { format } from "date-fns";
import { useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SITE_NAME = "Oberoi Realty — Tower C";

function StatusBadge({ record }: { record: any }) {
  const isAbsent = record.status === "absent";
  const isLate = record.isLate;

  const config = isAbsent
    ? { label: "Absent", bg: "#fee2e2", color: "#dc2626", icon: "✗" }
    : isLate
      ? { label: "Late", bg: "#fef3c7", color: "#d97706", icon: "⏱" }
      : { label: "Present", bg: "#dcfce7", color: "#16a34a", icon: "✓" };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: config.bg,
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 6,
        gap: 6,
        alignSelf: "flex-start",
      }}
    >
      <Text style={{ color: config.color, fontSize: 14, fontWeight: "700" }}>
        {config.icon}
      </Text>
      <Text style={{ color: config.color, fontSize: 13, fontWeight: "700" }}>
        {config.label}
      </Text>
    </View>
  );
}

function DetailRow({
  icon,
  label,
  value,
  valueColor,
}: {
  icon: string;
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#f3edf0",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Text style={{ fontSize: 16 }}>{icon}</Text>
        <Text style={{ color: "#9d6b82", fontSize: 13 }}>{label}</Text>
      </View>
      <Text
        style={{
          color: valueColor ?? "#2d0a1a",
          fontSize: 13,
          fontWeight: "600",
          maxWidth: "55%",
          textAlign: "right",
        }}
      >
        {value}
      </Text>
    </View>
  );
}

function SectionCard({
  title,
  children,
  accent,
}: {
  title: string;
  children: React.ReactNode;
  accent?: string;
}) {
  return (
    <View
      className="bg-white border border-gray-200 rounded-2xl"
      style={{
        padding: 16,
        marginBottom: 14,
        // shadowColor: "#701a40",
        // shadowOpacity: 0.06,
        // shadowOffset: { width: 0, height: 2 },
        // shadowRadius: 6,
        // elevation: 2,
        // borderLeftWidth: 4,
        // borderLeftColor: accent ?? "#701a40",
      }}
    >
      <Text
        style={{
          color: "#701a40",
          fontSize: 11,
          fontWeight: "700",
          letterSpacing: 0.8,
          textTransform: "uppercase",
          marginBottom: 4,
        }}
      >
        {title}
      </Text>
      {children}
    </View>
  );
}

export default function AttendanceDetailScreen() {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();

  const history = useSelector(selectHistory);
  const records = history.length > 0 ? history : DEMO_HISTORY;
  const record = records.find((item) => item.id === id);

  if (!record) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: "#888" }}>Attendance record not found</Text>
      </View>
    );
  }

  const dateObj = new Date(record.date);
  const dayName = format(dateObj, "EEEE");
  const dateStr = format(dateObj, "dd MMMM yyyy");

  const hoursDisplay = record.hoursWorked
    ? `${record.hoursWorked.toFixed(1)} hrs`
    : "--";

  return (
    <View style={{ flex: 1, backgroundColor: "#f8f4f6" }}>
      {/* <StatusBar barStyle="light-content" /> */}

      {/* Header */}
      <Header text={"Attendance Details"} />
      {/* <View
        style={{
          backgroundColor: "#701a40",
          paddingTop: insets.top + 8,
          paddingHorizontal: 20,
          paddingBottom: 18,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            backgroundColor: "#f5b041",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 14,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>
            <ArrowLeft />
          </Text>
        </TouchableOpacity>
        <View>
          <Text style={{ color: "#fff", fontWeight: "700", fontSize: 20 }}>
            Attendance Details
          </Text>
          <Text style={{ color: "#f5b041", fontSize: 12 }}>{SITE_NAME}</Text>
        </View>
      </View> */}

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 36 }}
      >
        {/* Date Hero Card */}
        <View
          style={{
            backgroundColor: "#701a40",
            borderRadius: 18,
            padding: 20,
            marginBottom: 16,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View>
            <Text
              style={{
                color: "#f5b041",
                fontSize: 12,
                fontWeight: "600",
                marginBottom: 4,
              }}
            >
              {dayName}
            </Text>
            <Text style={{ color: "#fff", fontSize: 22, fontWeight: "700" }}>
              {dateStr}
            </Text>
            <Text style={{ color: "#e8b8cc", fontSize: 13, marginTop: 4 }}>
              {record.siteName}
            </Text>
          </View>
          <StatusBadge record={record} />
        </View>

        {/* Time Info */}
        <SectionCard title="Time Log" accent="#701a40">
          <View style={{ flexDirection: "row", marginTop: 8, gap: 12 }}>
            <View
              style={{
                flex: 1,
                backgroundColor: "#f5e6ed",
                borderRadius: 12,
                padding: 14,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#9d6b82", fontSize: 11, marginBottom: 4 }}>
                Check In
              </Text>
              <Text
                style={{ color: "#701a40", fontSize: 16, fontWeight: "700" }}
              >
                {record.checkInTime ?? "--"}
              </Text>
            </View>

            <View
              style={{
                flex: 1,
                backgroundColor: "#f5e6ed",
                borderRadius: 12,
                padding: 14,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#9d6b82", fontSize: 11, marginBottom: 4 }}>
                Check Out
              </Text>
              <Text
                style={{ color: "#701a40", fontSize: 16, fontWeight: "700" }}
              >
                {record.checkOutTime ?? "--"}
              </Text>
            </View>

            <View
              style={{
                flex: 1,
                backgroundColor: "#fef3c7",
                borderRadius: 12,
                padding: 14,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#92400e", fontSize: 11, marginBottom: 4 }}>
                Duration
              </Text>
              <Text
                style={{ color: "#b45309", fontSize: 16, fontWeight: "700" }}
              >
                {hoursDisplay}
              </Text>
            </View>
          </View>

          {record.isLate && (
            <View
              style={{
                marginTop: 12,
                backgroundColor: "#fef3c7",
                borderRadius: 10,
                padding: 10,
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Text style={{ fontSize: 14 }}>⏱</Text>
              <Text
                style={{ color: "#92400e", fontSize: 13, fontWeight: "600" }}
              >
                Late by {record.lateByMinutes} minutes
              </Text>
            </View>
          )}
        </SectionCard>

        {/* GPS Verification */}
        <SectionCard title="GPS Verification" accent="#f5b041">
          <View style={{ marginTop: 4 }}>
            <DetailRow
              icon="📍"
              label="Accuracy"
              value={
                record.checkInGps?.accuracy != null
                  ? `${record.checkInGps.accuracy}m`
                  : "--"
              }
              valueColor={
                (record.checkInGps?.accuracy ?? 999) < 20
                  ? "#16a34a"
                  : "#d97706"
              }
            />
            <DetailRow
              icon="🛡"
              label="Mock Location"
              value={record.isMockLocation ? "Detected" : "Not Detected"}
              valueColor={record.isMockLocation ? "#dc2626" : "#16a34a"}
            />
            {record.checkInGps?.latitude && (
              <DetailRow
                icon="🌐"
                label="Coordinates"
                value={`${record.checkInGps.latitude.toFixed(4)}, ${record.checkInGps.longitude?.toFixed(4)}`}
              />
            )}
          </View>
        </SectionCard>

        {/* Face Verification */}
        {/* <SectionCard title="Face Verification" accent="#16a34a">
          <View style={{ marginTop: 4 }}>
            <DetailRow
              icon="👤"
              label="Match Score"
              value={
                record.faceMatchScore != null
                  ? `${record.faceMatchScore}%`
                  : "--"
              }
              valueColor={
                (record.faceMatchScore ?? 0) >= 80 ? "#16a34a" : "#dc2626"
              }
            />
            <DetailRow
              icon="📱"
              label="Device"
              value={
                record.deviceHash ? `${record.deviceHash.slice(0, 8)}...` : "--"
              }
            />
          </View>
        </SectionCard> */}
      </ScrollView>
    </View>
  );
}
