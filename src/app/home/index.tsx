// /**
//  * app/(tabs)/index.tsx — Home Dashboard
//  * Construction Workforce Attendance App
//  */

// import { selectUser } from "@/store/slice/authSlice";
// import { selectDevice } from "@/store/slice/deviceSlice";
// import { router } from "expo-router";
// import React, { useCallback } from "react";
// import {
//   RefreshControl,
//   ScrollView,
//   StatusBar,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import { useSelector } from "react-redux";

// // ─── Types ────────────────────────────────────────────────────────────────────
// type AttendanceStatus = "checked_in" | "checked_out" | "absent";

// interface WorkerProfile {
//   fullName: string;
//   employeeId: string;
//   siteName: string;
//   siteDistanceMeters: number;
// }

// interface AttendanceSummary {
//   presentDays: number;
//   absentDays: number;
//   lateDays: number;
//   totalWorkingDays: number;
// }

// interface TodayRecord {
//   status: AttendanceStatus;
//   checkInTime: string | null;
//   checkOutTime: string | null;
//   hoursWorked: number | null;
// }

// // ─── Mock data (replace with Redux selectors) ─────────────────────────────────
// const MOCK_WORKER: WorkerProfile = {
//   fullName: "Rajesh Kumar",
//   employeeId: "EMP-2847",
//   siteName: "Oberoi Realty — Tower C",
//   siteDistanceMeters: 142,
// };

// const MOCK_TODAY: TodayRecord = {
//   status: "checked_in",
//   checkInTime: "08:47 AM",
//   checkOutTime: null,
//   hoursWorked: 3.5,
// };

// const MOCK_SUMMARY: AttendanceSummary = {
//   presentDays: 18,
//   absentDays: 1,
//   lateDays: 2,
//   totalWorkingDays: 21,
// };

// // ─── Helpers ──────────────────────────────────────────────────────────────────
// function getGreeting(): string {
//   const h = new Date().getHours();
//   if (h < 12) return "Good morning";
//   if (h < 17) return "Good afternoon";
//   return "Good evening";
// }

// function formatDistance(meters: number): string {
//   if (meters < 1000) return `${meters} m away`;
//   return `${(meters / 1000).toFixed(1)} km away`;
// }

// function formatHours(h: number): string {
//   const hrs = Math.floor(h);
//   const mins = Math.round((h - hrs) * 60);
//   return `${hrs}h ${mins}m`;
// }

// function getInitials(name: string): string {
//   return name
//     .split(" ")
//     .map((n) => n[0])
//     .join("")
//     .toUpperCase()
//     .slice(0, 2);
// }

// // ─── Sub-components ───────────────────────────────────────────────────────────

// interface StatusConfig {
//   label: string;
//   color: string;
//   bg: string;
//   dotColor: string;
//   canCheckIn: boolean;
//   canCheckOut: boolean;
// }

// function getStatusConfig(status: AttendanceStatus): StatusConfig {
//   switch (status) {
//     case "checked_in":
//       return {
//         label: "Checked in",
//         color: "#16A34A",
//         bg: "#F0FDF4",
//         dotColor: "#22C55E",
//         canCheckIn: false,
//         canCheckOut: true,
//       };
//     case "checked_out":
//       return {
//         label: "Checked out",
//         color: "#2563EB",
//         bg: "#EFF6FF",
//         dotColor: "#3B82F6",
//         canCheckIn: false,
//         canCheckOut: false,
//       };
//     case "absent":
//       return {
//         label: "Not checked in",
//         color: "#DC2626",
//         bg: "#FEF2F2",
//         dotColor: "#EF4444",
//         canCheckIn: true,
//         canCheckOut: false,
//       };
//   }
// }

// // Status card
// function AttendanceStatusCard({ record }: { record: TodayRecord }) {
//   const cfg = getStatusConfig(record.status);
//   return (
//     <View
//       style={{
//         backgroundColor: cfg.bg,
//         borderRadius: 16,
//         padding: 20,
//         marginBottom: 12,
//         borderWidth: 1,
//         borderColor: cfg.color + "22",
//       }}
//     >
//       <View
//         style={{ flexDirection: "row", alignItems: "center", marginBottom: 14 }}
//       >
//         {/* Pulsing dot */}
//         <View
//           style={{
//             width: 10,
//             height: 10,
//             borderRadius: 5,
//             backgroundColor: cfg.dotColor,
//             marginRight: 8,
//           }}
//         />
//         <Text style={{ fontSize: 13, color: cfg.color, fontWeight: "600" }}>
//           {cfg.label}
//         </Text>
//         <Text style={{ marginLeft: "auto", fontSize: 12, color: "#6B7280" }}>
//           Today
//         </Text>
//       </View>

//       <View style={{ flexDirection: "row", gap: 24 }}>
//         {record.checkInTime && (
//           <View>
//             <Text style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 2 }}>
//               Check-in
//             </Text>
//             <Text style={{ fontSize: 20, fontWeight: "700", color: "#111827" }}>
//               {record.checkInTime}
//             </Text>
//           </View>
//         )}
//         {record.checkOutTime && (
//           <View>
//             <Text style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 2 }}>
//               Check-out
//             </Text>
//             <Text style={{ fontSize: 20, fontWeight: "700", color: "#111827" }}>
//               {record.checkOutTime}
//             </Text>
//           </View>
//         )}
//         {record.hoursWorked !== null && (
//           <View style={{ marginLeft: "auto" }}>
//             <Text style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 2 }}>
//               Hours today
//             </Text>
//             <Text style={{ fontSize: 20, fontWeight: "700", color: "#111827" }}>
//               {formatHours(record.hoursWorked)}
//             </Text>
//           </View>
//         )}
//       </View>
//     </View>
//   );
// }

// // Site card
// function SiteCard({ worker }: { worker: WorkerProfile }) {
//   const onSite = worker.siteDistanceMeters < 200;
//   return (
//     <View
//       style={{
//         backgroundColor: "#FFFFFF",
//         borderRadius: 16,
//         padding: 18,
//         marginBottom: 12,
//         borderWidth: 1,
//         borderColor: "#F3F4F6",
//         shadowColor: "#000",
//         shadowOffset: { width: 0, height: 1 },
//         shadowOpacity: 0.05,
//         shadowRadius: 4,
//         elevation: 2,
//       }}
//     >
//       <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
//         {/* Site icon */}
//         <View
//           style={{
//             width: 44,
//             height: 44,
//             borderRadius: 12,
//             backgroundColor: "#F59E0B" + "18",
//             alignItems: "center",
//             justifyContent: "center",
//             marginRight: 14,
//           }}
//         >
//           <Text style={{ fontSize: 22 }}>🏗️</Text>
//         </View>
//         <View style={{ flex: 1 }}>
//           <Text style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 3 }}>
//             Assigned site
//           </Text>
//           <Text
//             style={{
//               fontSize: 15,
//               fontWeight: "600",
//               color: "#111827",
//               marginBottom: 4,
//             }}
//             numberOfLines={1}
//           >
//             {worker.siteName}
//           </Text>
//           <View style={{ flexDirection: "row", alignItems: "center" }}>
//             <View
//               style={{
//                 width: 6,
//                 height: 6,
//                 borderRadius: 3,
//                 backgroundColor: onSite ? "#22C55E" : "#F59E0B",
//                 marginRight: 6,
//               }}
//             />
//             <Text
//               style={{
//                 fontSize: 12,
//                 color: onSite ? "#16A34A" : "#D97706",
//                 fontWeight: "500",
//               }}
//             >
//               {onSite
//                 ? "You are on site"
//                 : formatDistance(worker.siteDistanceMeters)}
//             </Text>
//           </View>
//         </View>
//       </View>
//     </View>
//   );
// }

// // Summary KPI row
// function SummaryRow({ summary }: { summary: AttendanceSummary }) {
//   const pct = Math.round(
//     (summary.presentDays / summary.totalWorkingDays) * 100,
//   );
//   const stats = [
//     {
//       label: "Present",
//       value: summary.presentDays,
//       color: "#16A34A",
//       bg: "#F0FDF4",
//     },
//     {
//       label: "Absent",
//       value: summary.absentDays,
//       color: "#DC2626",
//       bg: "#FEF2F2",
//     },
//     { label: "Late", value: summary.lateDays, color: "#D97706", bg: "#FFFBEB" },
//   ];
//   return (
//     <View style={{ marginBottom: 12 }}>
//       <View
//         style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}
//       >
//         <Text
//           style={{ fontSize: 14, fontWeight: "600", color: "#111827", flex: 1 }}
//         >
//           This month
//         </Text>
//         <Text style={{ fontSize: 13, color: "#6B7280" }}>
//           {pct}% attendance
//         </Text>
//       </View>
//       {/* Progress bar */}
//       <View
//         style={{
//           height: 6,
//           backgroundColor: "#F3F4F6",
//           borderRadius: 3,
//           marginBottom: 14,
//           overflow: "hidden",
//         }}
//       >
//         <View
//           style={{
//             height: 6,
//             width: `${pct}%`,
//             backgroundColor:
//               pct >= 90 ? "#22C55E" : pct >= 75 ? "#F59E0B" : "#EF4444",
//             borderRadius: 3,
//           }}
//         />
//       </View>
//       <View style={{ flexDirection: "row", gap: 10 }}>
//         {stats.map((s) => (
//           <View
//             key={s.label}
//             style={{
//               flex: 1,
//               backgroundColor: s.bg,
//               borderRadius: 12,
//               padding: 14,
//               alignItems: "center",
//             }}
//           >
//             <Text style={{ fontSize: 26, fontWeight: "700", color: s.color }}>
//               {s.value}
//             </Text>
//             <Text style={{ fontSize: 11, color: s.color + "AA", marginTop: 2 }}>
//               {s.label}
//             </Text>
//           </View>
//         ))}
//       </View>
//     </View>
//   );
// }

// // Quick action button
// function QuickAction({
//   icon,
//   label,
//   sublabel,
//   onPress,
//   variant = "default",
//   disabled = false,
// }: {
//   icon: string;
//   label: string;
//   sublabel?: string;
//   onPress: () => void;
//   variant?: "primary" | "danger" | "default";
//   disabled?: boolean;
// }) {
//   const bgMap = {
//     primary: "#1D4ED8",
//     danger: "#DC2626",
//     default: "#FFFFFF",
//   };
//   const textMap = {
//     primary: "#FFFFFF",
//     danger: "#FFFFFF",
//     default: "#111827",
//   };
//   const bg = disabled ? "#F3F4F6" : bgMap[variant];
//   const textColor = disabled ? "#9CA3AF" : textMap[variant];

//   return (
//     <TouchableOpacity
//       onPress={onPress}
//       disabled={disabled}
//       activeOpacity={0.75}
//       style={{
//         flex: 1,
//         backgroundColor: bg,
//         borderRadius: 16,
//         padding: 18,
//         alignItems: "center",
//         borderWidth: variant === "default" ? 1 : 0,
//         borderColor: "#F3F4F6",
//         shadowColor: variant !== "default" ? bg : "#000",
//         shadowOffset: { width: 0, height: variant !== "default" ? 4 : 1 },
//         shadowOpacity: variant !== "default" ? 0.25 : 0.05,
//         shadowRadius: variant !== "default" ? 10 : 4,
//         elevation: variant !== "default" ? 4 : 2,
//         opacity: disabled ? 0.5 : 1,
//       }}
//     >
//       <Text style={{ fontSize: 28, marginBottom: 8 }}>{icon}</Text>
//       <Text style={{ fontSize: 14, fontWeight: "600", color: textColor }}>
//         {label}
//       </Text>
//       {sublabel && (
//         <Text
//           style={{
//             fontSize: 11,
//             color: variant !== "default" ? "#FFFFFF88" : "#9CA3AF",
//             marginTop: 3,
//           }}
//         >
//           {sublabel}
//         </Text>
//       )}
//     </TouchableOpacity>
//   );
// }

// // Sync indicator
// function SyncBadge({ pendingCount }: { pendingCount: number }) {
//   if (pendingCount === 0) return null;
//   return (
//     <TouchableOpacity
//       style={{
//         flexDirection: "row",
//         alignItems: "center",
//         backgroundColor: "#FEF3C7",
//         borderRadius: 20,
//         paddingHorizontal: 12,
//         paddingVertical: 6,
//         marginBottom: 16,
//         alignSelf: "flex-start",
//       }}
//     >
//       <Text style={{ fontSize: 12, marginRight: 4 }}>⏳</Text>
//       <Text style={{ fontSize: 12, color: "#92400E", fontWeight: "500" }}>
//         {pendingCount} record{pendingCount > 1 ? "s" : ""} pending sync
//       </Text>
//     </TouchableOpacity>
//   );
// }

// // ─── Main Screen ──────────────────────────────────────────────────────────────
// export default function HomeDashboard() {
//   const user = useSelector(selectUser);
//   const device = useSelector(selectDevice);
//   console.log(user, device);

//   const insets = useSafeAreaInsets();
//   const [refreshing, setRefreshing] = React.useState(false);
//   const [pendingSync] = React.useState(0);

//   // Replace with actual Redux selectors:
//   const worker = MOCK_WORKER;
//   const today = MOCK_TODAY;
//   const summary = MOCK_SUMMARY;
//   const statusConfig = getStatusConfig(today.status);

//   const onRefresh = useCallback(async () => {
//     setRefreshing(true);
//     // dispatch(fetchTodayAttendance());
//     await new Promise((r) => setTimeout(r, 1200));
//     setRefreshing(false);
//   }, []);

//   const handleCheckIn = () => router.push("/check-in/index");
//   const handleCheckOut = () => router.push("/check-out/index");

//   return (
//     <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
//       <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

//       {/* Header */}
//       <View
//         style={{
//           paddingTop: insets.top + 12,
//           paddingHorizontal: 20,
//           paddingBottom: 16,
//           backgroundColor: "#FFFFFF",
//           borderBottomWidth: 1,
//           borderBottomColor: "#F3F4F6",
//         }}
//       >
//         <View style={{ flexDirection: "row", alignItems: "center" }}>
//           <View style={{ flex: 1 }}>
//             <Text style={{ fontSize: 13, color: "#9CA3AF", marginBottom: 2 }}>
//               {getGreeting()}
//             </Text>
//             <Text style={{ fontSize: 20, fontWeight: "700", color: "#111827" }}>
//               {worker.fullName.split(" ")[0]} 👋
//             </Text>
//           </View>
//           {/* Avatar */}
//           <TouchableOpacity
//             onPress={() => router.push("/(tabs)/profile")}
//             style={{
//               width: 42,
//               height: 42,
//               borderRadius: 21,
//               backgroundColor: "#1D4ED8",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             <Text style={{ color: "#FFFFFF", fontWeight: "700", fontSize: 15 }}>
//               {getInitials(worker.fullName)}
//             </Text>
//           </TouchableOpacity>
//         </View>

//         {/* Employee ID pill */}
//         <View
//           style={{
//             flexDirection: "row",
//             alignItems: "center",
//             marginTop: 8,
//           }}
//         >
//           <View
//             style={{
//               backgroundColor: "#EFF6FF",
//               borderRadius: 20,
//               paddingHorizontal: 10,
//               paddingVertical: 4,
//               flexDirection: "row",
//               alignItems: "center",
//             }}
//           >
//             <Text style={{ fontSize: 12, color: "#1D4ED8", fontWeight: "500" }}>
//               {worker.employeeId}
//             </Text>
//           </View>
//           <Text style={{ fontSize: 12, color: "#9CA3AF", marginLeft: 10 }}>
//             {new Date().toLocaleDateString("en-IN", {
//               weekday: "long",
//               day: "numeric",
//               month: "short",
//             })}
//           </Text>
//         </View>
//       </View>

//       <ScrollView
//         contentContainerStyle={{
//           padding: 16,
//           paddingBottom: insets.bottom + 80,
//         }}
//         showsVerticalScrollIndicator={false}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             tintColor="#1D4ED8"
//           />
//         }
//       >
//         <SyncBadge pendingCount={pendingSync} />

//         {/* Today's status */}
//         <Text
//           style={{
//             fontSize: 13,
//             fontWeight: "600",
//             color: "#6B7280",
//             marginBottom: 8,
//             textTransform: "uppercase",
//             letterSpacing: 0.5,
//           }}
//         >
//           Today's status
//         </Text>
//         <AttendanceStatusCard record={today} />

//         {/* Site */}
//         <SiteCard worker={worker} />

//         {/* Quick actions */}
//         <Text
//           style={{
//             fontSize: 13,
//             fontWeight: "600",
//             color: "#6B7280",
//             marginTop: 4,
//             marginBottom: 10,
//             textTransform: "uppercase",
//             letterSpacing: 0.5,
//           }}
//         >
//           Actions
//         </Text>
//         <View style={{ flexDirection: "row", gap: 10, marginBottom: 20 }}>
//           <QuickAction
//             icon="📍"
//             label="Check in"
//             sublabel={
//               statusConfig.canCheckIn
//                 ? "Tap to mark attendance"
//                 : "Already checked in"
//             }
//             onPress={handleCheckIn}
//             variant="primary"
//             disabled={!statusConfig.canCheckIn}
//           />
//           <QuickAction
//             icon="🚪"
//             label="Check out"
//             sublabel={statusConfig.canCheckOut ? "End your shift" : undefined}
//             onPress={handleCheckOut}
//             variant="danger"
//             disabled={!statusConfig.canCheckOut}
//           />
//         </View>

//         {/* Secondary actions */}
//         <View style={{ flexDirection: "row", gap: 10, marginBottom: 24 }}>
//           <QuickAction
//             icon="📋"
//             label="History"
//             onPress={() => router.push("/(tabs)/history")}
//           />
//           <QuickAction
//             icon="👤"
//             label="Profile"
//             onPress={() => router.push("/(tabs)/profile")}
//           />
//         </View>

//         {/* Monthly summary */}
//         <Text
//           style={{
//             fontSize: 13,
//             fontWeight: "600",
//             color: "#6B7280",
//             marginBottom: 10,
//             textTransform: "uppercase",
//             letterSpacing: 0.5,
//           }}
//         >
//           Monthly summary
//         </Text>
//         <View
//           style={{
//             backgroundColor: "#FFFFFF",
//             borderRadius: 16,
//             padding: 16,
//             borderWidth: 1,
//             borderColor: "#F3F4F6",
//           }}
//         >
//           <SummaryRow summary={summary} />
//         </View>

//         {/* Last sync */}
//         <Text
//           style={{
//             textAlign: "center",
//             fontSize: 11,
//             color: "#9CA3AF",
//             marginTop: 16,
//           }}
//         >
//           Last synced{" "}
//           {new Date().toLocaleTimeString("en-IN", {
//             hour: "2-digit",
//             minute: "2-digit",
//           })}
//         </Text>
//       </ScrollView>
//     </View>
//   );
// }

/**
 * app/(tabs)/index.tsx — Combined Home + Attendance Dashboard
 * Construction Workforce Attendance App
 * Uses NativeWind (Tailwind CSS) for styling
 */

import type {
  MonthAttendanceStats,
  WorkerSite,
  WeekAttendanceRecord,
} from "@/types/api.types";
import { useGetWorkerMeQuery } from "@/store/api/workerApi";
import {
  selectUser,
  setAssignedSite,
  setWorkerProfile,
} from "@/store/slice/authSlice";
import type {
  AttendanceRecord,
  AttendanceStatus,
} from "@/types/attendance.types";
import { buildWeekCalendarData } from "@/utils/home-attendance";
import { formatShiftTime, isWithinShift } from "@/utils/shift";
import { router } from "expo-router";
import { History, User } from "lucide-react-native";
import React, { useCallback, useEffect } from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { mapVerifiedWorkerToProfile } from "@/utils/auth-session";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function formatDistance(meters: number): string {
  if (meters < 1000) return `${meters} m away`;
  return `${(meters / 1000).toFixed(1)} km away`;
}

function formatHours(h: number): string {
  const hrs = Math.floor(h);
  const mins = Math.round((h - hrs) * 60);
  return `${hrs}h ${mins}m`;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getTodayDateStr(): string {
  return new Date().toISOString().split("T")[0];
}

function getLiveTimer(checkInTime: string): string {
  const [time, meridiem] = checkInTime.split(" ");
  const [hStr, mStr] = time.split(":");
  let hours = parseInt(hStr);
  const minutes = parseInt(mStr);
  if (meridiem === "PM" && hours !== 12) hours += 12;
  if (meridiem === "AM" && hours === 12) hours = 0;
  const start = new Date();
  start.setHours(hours, minutes, 0, 0);
  const diffMs = Date.now() - start.getTime();
  const diffH = Math.floor(diffMs / 3600000);
  const diffM = Math.floor((diffMs % 3600000) / 60000);
  return `${String(diffH).padStart(2, "0")}:${String(diffM).padStart(2, "0")}`;
}

// ─── Status config ─────────────────────────────────────────────────────────────

type StatusCfg = {
  label: string;
  subLabel: string;
  textColor: string;
  bgClass: string;
  borderClass: string;
  dotColor: string;
  emoji: string;
  canCheckIn: boolean;
  canCheckOut: boolean;
};

function getStatusCfg(status: AttendanceStatus | "absent"): StatusCfg {
  switch (status) {
    case "checked_in":
      return {
        label: "Checked in",
        subLabel: "Shift is live",
        textColor: "#16A34A",
        bgClass: "bg-green-50",
        borderClass: "border-green-200",
        dotColor: "#22C55E",
        emoji: "🟢",
        canCheckIn: false,
        canCheckOut: true,
      };
    case "checked_out":
      return {
        label: "Shift complete",
        subLabel: "Good work today!",
        textColor: "#2563EB",
        bgClass: "bg-blue-50",
        borderClass: "border-blue-200",
        dotColor: "#3B82F6",
        emoji: "✅",
        canCheckIn: false,
        canCheckOut: false,
      };
    case "late":
      return {
        label: "Checked in late",
        subLabel: "Marked as late arrival",
        textColor: "#D97706",
        bgClass: "bg-amber-50",
        borderClass: "border-amber-200",
        dotColor: "#F59E0B",
        emoji: "🕐",
        canCheckIn: false,
        canCheckOut: true,
      };
    case "absent":
    default:
      return {
        label: "Not checked in",
        subLabel: "No attendance today",
        textColor: "#DC2626",
        bgClass: "bg-red-50",
        borderClass: "border-red-200",
        dotColor: "#EF4444",
        emoji: "⭕",
        canCheckIn: true,
        canCheckOut: false,
      };
  }
}

// ─── Today's Attendance Hero Card ─────────────────────────────────────────────

function TodayAttendanceCard({
  record,
  selfieUri,
  onCheckIn,
  onCheckOut,
}: {
  record: AttendanceRecord | null;
  selfieUri: string | null;
  onCheckIn: () => void;
  onCheckOut: () => void;
}) {
  const status: AttendanceStatus | "absent" = record?.status ?? "absent";
  const cfg = getStatusCfg(status);
  const [liveTimer, setLiveTimer] = React.useState("00:00");

  React.useEffect(() => {
    if (status !== "checked_in" || !record?.checkInTime) return;
    const tick = () => setLiveTimer(getLiveTimer(record.checkInTime!));
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, [status, record?.checkInTime]);

  return (
    <View
      className={`${cfg.bgClass} rounded-2xl border ${cfg.borderClass} p-5 mb-3`}
    >
      {/* Status header */}
      <View className="flex-row items-center mb-4">
        <View
          className="w-2.5 h-2.5 rounded-full mr-2"
          style={{ backgroundColor: cfg.dotColor }}
        />
        <Text
          className="text-base font-bold flex-1"
          style={{ color: cfg.textColor }}
        >
          {cfg.label}
        </Text>
        <Text className="text-xl">{cfg.emoji}</Text>
      </View>

      {/* Time info */}
      {record?.checkInTime ? (
        <View className="flex-row gap-3 mb-4">
          {/* Check-in time */}
          <View className="flex-1 bg-white rounded-xl p-3">
            <Text className="text-xs text-gray-400 mb-1">Check-in</Text>
            <Text className="text-xl font-extrabold text-gray-900">
              {record.checkInTime}
            </Text>
            {record.isLate && (
              <Text className="text-xs text-amber-600 mt-0.5">
                +{record.lateByMinutes} min late
              </Text>
            )}
          </View>

          {/* Live timer or check-out */}
          <View className="flex-1 bg-white rounded-xl p-3">
            {status === "checked_in" ? (
              <>
                <Text className="text-xs text-gray-400 mb-1">Live hours</Text>
                <Text
                  className="text-xl font-extrabold"
                  style={{ color: cfg.textColor }}
                >
                  {liveTimer}
                </Text>
                <Text
                  className="text-xs mt-0.5"
                  style={{ color: cfg.textColor }}
                >
                  Running…
                </Text>
              </>
            ) : (
              <>
                <Text className="text-xs text-gray-400 mb-1">Check-out</Text>
                <Text className="text-xl font-extrabold text-gray-900">
                  {record.checkOutTime ?? "—"}
                </Text>
                {record.hoursWorked != null && (
                  <Text className="text-xs text-gray-500 mt-0.5">
                    {formatHours(record.hoursWorked)} total
                  </Text>
                )}
              </>
            )}
          </View>
        </View>
      ) : null}

      {/* Selfie + proof row */}
      {record?.checkInTime && (
        <View className="flex-row gap-3 mb-4">
          <View className="w-16 h-16 rounded-xl bg-gray-200 items-center justify-center overflow-hidden">
            {selfieUri ? (
              <Image
                source={{ uri: selfieUri }}
                className="w-16 h-16"
                resizeMode="cover"
              />
            ) : (
              <Text className="text-3xl">🤳</Text>
            )}
          </View>
          <View className="flex-1 justify-center">
            <View className="flex-row items-center mb-1">
              <Text className="text-xs font-semibold text-green-600">
                ✓ Face verified
              </Text>
              {record.faceMatchScore && (
                <Text className="text-xs text-gray-400 ml-1.5">
                  {record.faceMatchScore}% match
                </Text>
              )}
            </View>
            <Text className="text-xs font-semibold text-green-600 mb-1">
              ✓ On site confirmed
            </Text>
            <Text className="text-xs text-gray-500" numberOfLines={1}>
              📍 {record.checkInGps?.latitude.toFixed(4)}°N{" "}
              {record.checkInGps?.longitude.toFixed(4)}°E
            </Text>
          </View>
        </View>
      )}

      {/* Action buttons */}
      <View className="flex-row gap-3">
        <TouchableOpacity
          onPress={onCheckIn}
          disabled={!cfg.canCheckIn}
          activeOpacity={0.75}
          className={`flex-1 rounded-xl py-3.5 items-center ${
            cfg.canCheckIn ? "bg-green-600" : "bg-gray-200"
          }`}
        >
          <Text
            className={`font-bold text-sm ${cfg.canCheckIn ? "text-white" : "text-gray-400"}`}
          >
            📍 Check in
          </Text>
          {cfg.canCheckIn && (
            <Text className="text-xs text-blue-200 mt-0.5">
              Tap to mark attendance
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onCheckOut}
          disabled={!cfg.canCheckOut}
          activeOpacity={0.75}
          className={`flex-1 rounded-xl py-3.5 items-center ${
            cfg.canCheckOut ? "bg-red-600" : "bg-gray-200"
          }`}
        >
          <Text
            className={`font-bold text-sm ${cfg.canCheckOut ? "text-white" : "text-gray-400"}`}
          >
            🚪 Check out
          </Text>
          {cfg.canCheckOut && (
            <Text className="text-xs text-red-200 mt-0.5">End your shift</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Site Card ────────────────────────────────────────────────────────────────

function SiteCard({ site }: { site: WorkerSite | null | undefined }) {
  const inShift = site ? isWithinShift(site.startTime, site.endTime) : false;

  if (!site) {
    return (
      <View className="bg-white border border-gray-200 rounded-2xl p-4 mb-3">
        <Text className="text-sm text-gray-500">No site assigned yet</Text>
      </View>
    );
  }

  return (
    <View className="bg-white border border-gray-200 rounded-2xl p-4 mb-3">
      <Text className="text-base font-bold text-black mb-2">
        {site.name}
      </Text>
      <View className="flex-row flex justify-between mb-2">
        <View>
          <Text className="text-xs text-gray-500">Shift</Text>
          <Text className="text-sm text-slate-900 font-medium">
            {formatShiftTime(site.startTime)} –{" "}
            {formatShiftTime(site.endTime)}
          </Text>
        </View>
        <View>
          <Text className="text-xs text-gray-500">Geofence</Text>
          <Text className="text-sm text-slate-900 font-medium">
            {site.geofenceRadius}m radius
          </Text>
        </View>
      </View>
      <View className="flex-row items-center mt-1">
        <View
          className="w-1.5 h-1.5 rounded-full mr-1.5"
          style={{ backgroundColor: inShift ? "#22C55E" : "#F59E0B" }}
        />
        <Text
          className="text-xs font-medium"
          style={{ color: inShift ? "#22C55E" : "#F59E0B" }}
        >
          {inShift
            ? "Shift active — location tracking on"
            : "Outside shift hours — tracking paused"}
        </Text>
      </View>
    </View>
  );
}

// ─── Week Calendar Strip ───────────────────────────────────────────────────────

function WeekCalendar({
  weekAttendance = [],
}: {
  weekAttendance?: WeekAttendanceRecord[];
}) {
  const weekData = buildWeekCalendarData(weekAttendance);

  const dotColor: Record<string, string> = {
    checked_out: "#16A34A",
    checked_in: "#3B82F6",
    late: "#F59E0B",
    absent: "#EF4444",
    future: "#D1D5DB",
    today: "#1D4ED8",
  };

  const bgClass: Record<string, string> = {
    checked_out: "bg-green-50",
    checked_in: "bg-blue-50",
    late: "bg-amber-50",
    absent: "bg-red-50",
    future: "bg-gray-50",
    today: "bg-blue-50",
  };

  const label: Record<string, string> = {
    checked_out: "P",
    checked_in: "→",
    late: "L",
    absent: "A",
    future: "·",
    today: "→",
  };

  return (
    <View className="mb-1">
      {/* <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2.5">
        This week
      </Text> */}
      <View className="flex-row gap-1.5">
        {weekData.map(({ day, status }: { day: string; status: string }) => (
          <View
            key={day}
            className={`flex-1  rounded-xl py-2.5 items-center border ${
              status === "today" ? "border-maroon border" : "border-gray-200"
            }`}
          >
            <Text className="text-xs text-gray-400 mb-1">{day}</Text>
            <Text
              className="text-base font-bold"
              style={{ color: dotColor[status] }}
            >
              {label[status]}
            </Text>
          </View>
        ))}
      </View>
      <View className="flex-row gap-3.5 mt-2 flex-wrap">
        {[
          { label: "Present", color: "#16A34A" },
          { label: "Late", color: "#F59E0B" },
          { label: "Absent", color: "#EF4444" },
        ].map(({ label, color }) => (
          <View key={label} className="flex-row items-center">
            <View
              className="w-1.5 h-1.5 rounded-full mr-1"
              style={{ backgroundColor: color }}
            />
            <Text className="text-xs text-gray-500">{label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── Monthly Stats ─────────────────────────────────────────────────────────────

function MonthlyStats({
  stats,
}: {
  stats: MonthAttendanceStats | undefined;
}) {
  if (!stats) {
    return (
      <View className="bg-white rounded-2xl p-4 border border-gray-200 mb-3">
        <Text className="text-sm text-gray-500">No monthly data yet</Text>
      </View>
    );
  }

  const pct = stats.attendancePercentage;
  // const pct = 90;
  const barColor = pct >= 90 ? "#22C55E" : pct >= 75 ? "#F59E0B" : "#EF4444";
  const pctColor =
    pct >= 90
      ? "text-green-600"
      : pct >= 75
        ? "text-amber-600"
        : "text-red-600";

  return (
    <View className="bg-white rounded-2xl p-4 border border-gray-200 mb-3">
      <View className="flex-row items-center mb-2.5">
        <Text className="text-sm font-semibold text-gray-900 flex-1">
          This month
        </Text>
        <Text className={`text-sm font-bold ${pctColor}`}>
          {pct}% attendance
        </Text>
      </View>

      {/* Progress bar */}
      <View className="h-1.5 bg-gray-100 rounded-full mb-3.5 overflow-hidden">
        <View
          className="h-1.5 rounded-full"
          style={{ width: `${pct}%`, backgroundColor: barColor }}
        />
      </View>

      {/* KPI boxes */}
      <View className="flex-row gap-2">
        {[
          {
            label: "Present",
            value: stats.present,
            colorClass: "text-green-600",
          },
          {
            label: "Absent",
            value: stats.absent,
            colorClass: "text-red-600",
          },
          {
            label: "Late",
            value: stats.late,
            colorClass: "text-amber-600",
          },
          {
            label: "Days",
            value: stats.totalDays,
            colorClass: "text-maroon",
          },
        ].map(({ label, value, colorClass }) => (
          <View key={label} className={`flex-1 rounded-xl p-2.5 items-center`}>
            <Text className={`text-2xl font-extrabold ${colorClass}`}>
              {value}
            </Text>
            <Text
              className={`text-xs mt-0.5 text-center ${colorClass} opacity-70`}
            >
              {label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── Sync Badge ───────────────────────────────────────────────────────────────

function SyncBadge({ pendingCount }: { pendingCount: number }) {
  if (pendingCount === 0) return null;
  return (
    <TouchableOpacity className="flex-row items-center bg-amber-50 rounded-full px-3 py-1.5 mb-4 self-start">
      <Text className="text-xs mr-1">⏳</Text>
      <Text className="text-xs text-amber-800 font-medium">
        {pendingCount} record{pendingCount > 1 ? "s" : ""} pending sync
      </Text>
    </TouchableOpacity>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function HomeDashboard() {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector(selectUser);

  const {
    data: meResponse,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useGetWorkerMeQuery(undefined, { skip: !isLoggedIn });

  const worker = meResponse?.data.worker;

  useEffect(() => {
    if (!worker) return;
    dispatch(setAssignedSite(worker.site));
    dispatch(setWorkerProfile(mapVerifiedWorkerToProfile(worker)));
  }, [dispatch, worker]);

  const insets = useSafeAreaInsets();
  const [pendingSync] = React.useState(0);

  const workerName = worker
    ? [worker.firstName, worker.lastName].filter(Boolean).join(" ")
    : "Worker";

  const onRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F8FAFC]">
        <ActivityIndicator size="large" color="#701a40" />
      </View>
    );
  }

  if (isError || !worker) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F8FAFC] px-6">
        <Text className="text-gray-600 text-center mb-4">
          Could not load your dashboard. Pull to refresh or try again.
        </Text>
        <TouchableOpacity
          onPress={() => refetch()}
          className="bg-maroon rounded-xl px-6 py-3"
        >
          <Text className="text-white font-semibold">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#F8FAFC]">
      {/* <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" /> */}

      {/* ── Header ── */}
      <View
        className="bg-maroon border-b border-gray-200 px-5 pb-4"
        style={{ paddingTop: insets.top + 12 }}
      >
        <View className="flex-row items-center">
          <View className="flex-1">
            <Text className="text-sm text-gold mb-0.5">{getGreeting()}</Text>
            <Text className="text-xl font-bold text-white">
              {workerName.split(" ")[0]} 👋
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => router.push("/profile")}
            className="w-11 h-11 rounded-full bg-gold items-center justify-center"
          >
            <Text className="text-white font-bold text-base">
              {getInitials(workerName)}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center mt-2">
          {/* <View className="bg-white/15 rounded-full px-2.5 py-1 flex-row items-center mr-2.5">
            <Text className="text-xs text-white font-medium">{employeeId}</Text>
          </View> */}
          <Text className="text-xs text-gold">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "short",
            })}
          </Text>

          <View className="ml-auto flex-row items-center bg-white/15 rounded-full px-2.5 py-1">
            <View className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1" />
            <Text className="text-xs text-white font-medium">Synced</Text>
          </View>
        </View>
      </View>
      {/* <AppHeader
        title={`${workerName.split(" ")[0]} 👋`}
        subtitle={getGreeting()}
        employeeId={employeeId}
        userName={workerName}
      /> */}

      {/* ── Content ── */}
      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingBottom: insets.bottom + 90,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={onRefresh}
            tintColor="#1D4ED8"
          />
        }
      >
        <SyncBadge pendingCount={pendingSync} />

        {/* Site info */}
        <Text className="text-xs font-semibold text-maroon uppercase tracking-wide mb-2">
          Assigned site
        </Text>
        <SiteCard site={worker.site} />

        {/* Week strip */}
        <Text className="text-xs font-semibold text-maroon uppercase tracking-wide mb-2">
          This Week
        </Text>
        <View className="bg-white rounded-2xl p-4 border border-gray-200 mb-3">
          <WeekCalendar weekAttendance={worker.current_week_attendance} />
        </View>

        {/* Monthly summary */}
        <Text className="text-xs font-semibold text-maroon uppercase tracking-wide mb-2">
          Monthly summary
        </Text>
        <MonthlyStats stats={worker.current_month_attendance} />

        {/* Secondary quick links */}
        <View className="flex-row gap-2.5 mb-4">
          <TouchableOpacity
            onPress={() => router.push("/history")}
            activeOpacity={0.75}
            className="flex-1 bg-white rounded-2xl p-4 items-center border border-gray-200"
          >
            <Text className="text-2xl mb-2">
              <History color={"gray"} />
            </Text>
            <Text className="text-sm font-semibold text-gray-900">History</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/profile")}
            activeOpacity={0.75}
            className="flex-1 bg-white rounded-2xl p-4 items-center border border-gray-200"
          >
            <Text className="text-2xl mb-2">
              <User color={"gray"} />
            </Text>
            <Text className="text-sm font-semibold text-gray-900">Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Last sync */}
        <Text className="text-center text-xs text-gray-400 mt-2">
          Last synced{" "}
          {new Date().toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </ScrollView>
    </View>
  );
}
