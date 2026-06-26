// import {
//   ScrollView,
//   StatusBar,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { useSelector } from "react-redux";

// import AttendanceCard from "@/components/history/AttendanceCard";
// import AttendanceFilter, {
//   FilterType,
// } from "@/components/history/AttendanceFilters";
// import AttendanceStats from "@/components/history/AttendanceStats";
// import { DEMO_HISTORY } from "@/constants/demoData";
// import { selectHistory } from "@/store/slice/attendanceSlice";
// import { router } from "expo-router";
// import { useMemo, useState } from "react";
// import { useSafeAreaInsets } from "react-native-safe-area-context";

// const SITE_NAME = "Oberoi Realty — Tower C";

// export default function HistoryScreen() {
//   const insets = useSafeAreaInsets();
//   const [filter, setFilter] = useState<FilterType>("month");
//   const history = useSelector(selectHistory);
//   const records = history.length > 0 ? history : DEMO_HISTORY;

//   const filteredRecords = useMemo(() => {
//     const now = new Date();

//     switch (filter) {
//       case "today":
//         return records.filter((item) => {
//           const d = new Date(item.date);

//           return d.toDateString() === now.toDateString();
//         });

//       case "week":
//         return records.slice(0, 7);

//       default:
//         return records;
//     }
//   }, [filter, records]);

//   const presentDays = filteredRecords.filter(
//     (r) => r.status === "checked_out",
//   ).length;

//   const absentDays = filteredRecords.filter(
//     (r) => r.status === "absent",
//   ).length;

//   const lateDays = filteredRecords.filter((r) => r.isLate).length;
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
//             Attendance History
//           </Text>
//           <Text className="text-gold text-xs">{SITE_NAME}</Text>
//         </View>
//       </View>
//       <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
//         {/* <Text className="text-2xl font-bold mb-5">Attendance History</Text> */}

//         <AttendanceStats
//           presentDays={presentDays}
//           absentDays={absentDays}
//           lateDays={lateDays}
//         />

//         <AttendanceFilter selected={filter} onChange={setFilter} />

//         {/* <View className="flex-row gap-3 mb-6">
//         <View className="flex-1 bg-white rounded-2xl p-4">
//           <Text className="text-slate-500">Present</Text>

//           <Text className="text-2xl font-bold">{presentDays}</Text>
//         </View>

//         <View className="flex-1 bg-white rounded-2xl p-4">
//           <Text className="text-slate-500">Absent</Text>

//           <Text className="text-2xl font-bold">{absentDays}</Text>
//         </View>

//         <View className="flex-1 bg-white rounded-2xl p-4">
//           <Text className="text-slate-500">Late</Text>

//           <Text className="text-2xl font-bold">{lateDays}</Text>
//         </View>
//       </View> */}

//         {filteredRecords.map((item) => (
//           <AttendanceCard key={item.id} item={item} />
//         ))}
//       </ScrollView>
//     </View>
//   );
// }

import { useMemo, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";

import Header from "@/components/ui/Header";
import { DEMO_HISTORY } from "@/constants/demoData";
import { selectHistory } from "@/store/slice/attendanceSlice";
import type { AttendanceRecord } from "@/types/attendance.types";
import { router } from "expo-router";
import { ArrowLeft, ArrowRight } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SITE_NAME = "Oberoi Realty — Tower C";

const DAYS_OF_WEEK = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function getStatusForDate(
  records: AttendanceRecord[],
  year: number,
  month: number,
  day: number,
): "present" | "absent" | "late" | null {
  const match = records.find((r) => {
    const d = new Date(r.date);
    return (
      d.getFullYear() === year && d.getMonth() === month && d.getDate() === day
    );
  });
  if (!match) return null;
  if (match.status === "absent") return "absent";
  if (match.isLate) return "late";
  return "present";
}

function getRecordForDate(
  records: AttendanceRecord[],
  year: number,
  month: number,
  day: number,
): AttendanceRecord | undefined {
  return records.find((r) => {
    const d = new Date(r.date);
    return (
      d.getFullYear() === year && d.getMonth() === month && d.getDate() === day
    );
  });
}

const STATUS_COLORS = {
  present: {
    bg: "#06b922", // light green
    border: "#86EFAC",
  },
  absent: {
    bg: "#ff3636", // light red
    border: "#FCA5A5",
  },
  late: {
    bg: "#e1b400", // light amber
    border: "#FCD34D",
  },
};

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const history = useSelector(selectHistory);
  const records: AttendanceRecord[] =
    history.length > 0 ? history : DEMO_HISTORY;

  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const calendarDays = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    return { firstDay, daysInMonth };
  }, [viewYear, viewMonth]);

  const monthStats = useMemo(() => {
    const monthRecords = records.filter((r) => {
      const d = new Date(r.date);
      return d.getFullYear() === viewYear && d.getMonth() === viewMonth;
    });
    return {
      present: monthRecords.filter((r) => r.status !== "absent" && !r.isLate)
        .length,
      absent: monthRecords.filter((r) => r.status === "absent").length,
      late: monthRecords.filter((r) => r.isLate).length,
    };
  }, [records, viewYear, viewMonth]);

  function prevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  }

  function nextMonth() {
    const isCurrentOrFuture =
      viewYear > today.getFullYear() ||
      (viewYear === today.getFullYear() && viewMonth >= today.getMonth());
    if (isCurrentOrFuture) return;
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  }

  const isAtPresent =
    viewYear > today.getFullYear() ||
    (viewYear === today.getFullYear() && viewMonth >= today.getMonth());

  const cells: (number | null)[] = [
    ...Array(calendarDays.firstDay).fill(null),
    ...Array.from({ length: calendarDays.daysInMonth }, (_, i) => i + 1),
  ];

  // Pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <View style={{ flex: 1, backgroundColor: "#f8f4f6" }}>
      {/* <StatusBar barStyle="light-content" /> */}

      {/* Header */}
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
            ←
          </Text>
        </TouchableOpacity>
        <View>
          <Text style={{ color: "#fff", fontWeight: "700", fontSize: 20 }}>
            Attendance History
          </Text>
          <Text style={{ color: "#f5b041", fontSize: 12 }}>{SITE_NAME}</Text>
        </View>
      </View> */}

      <Header text={"Attendance History"} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
      >
        {/* Stats Row */}
        <View style={{ flexDirection: "row", gap: 10, marginBottom: 16 }}>
          {[
            {
              label: "Present",
              value: monthStats.present,
              color: "#16a34a",
              // bg: "#dcfce7",
            },
            {
              label: "Absent",
              value: monthStats.absent,
              color: "#dc2626",
              // bg: "#fee2e2",
            },
            {
              label: "Late",
              value: monthStats.late,
              color: "#d97706",
              // bg: "#fef3c7",
            },
          ].map((stat) => (
            <View
              key={stat.label}
              className="border border-gray-200 rounded-2xl"
              style={{
                flex: 1,
                backgroundColor: "white",
                paddingVertical: 12,
                paddingHorizontal: 8,
                alignItems: "center",
              }}
            >
              <Text
                style={{ color: stat.color, fontSize: 22, fontWeight: "700" }}
              >
                {stat.value}
              </Text>
              <Text
                style={{
                  color: stat.color,
                  fontSize: 11,
                  marginTop: 2,
                  opacity: 0.85,
                }}
              >
                {stat.label}
              </Text>
            </View>
          ))}
        </View>

        {/* Calendar Card */}
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 18,
            padding: 16,
            shadowColor: "#701a40",
            shadowOpacity: 0.07,
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          {/* Month Navigator */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <TouchableOpacity
              onPress={prevMonth}
              className="bg-gray-100"
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{ color: "#701a40", fontSize: 16, fontWeight: "700" }}
              >
                <ArrowLeft />
              </Text>
            </TouchableOpacity>

            <View style={{ alignItems: "center" }}>
              <Text
                className="text-lg"
                // style={{ color: "#701a40", fontWeight: "700", fontSize: 16 }}
              >
                {MONTH_NAMES[viewMonth]}
              </Text>
              <Text
                className="text-sm"
                // style={{ color: "#9d6b82", fontSize: 12 }}
              >
                {viewYear}
              </Text>
            </View>

            <TouchableOpacity
              onPress={nextMonth}
              disabled={isAtPresent}
              className={`${isAtPresent ? "#f0f0f0" : "bg-gray-100"}`}
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                // backgroundColor: isAtPresent ? "#f0f0f0" : "#f5e6ed",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: isAtPresent ? "#ccc" : "#701a40",
                  fontSize: 16,
                  fontWeight: "700",
                }}
              >
                <ArrowRight />
              </Text>
            </TouchableOpacity>
          </View>

          {/* Day Labels */}
          <View style={{ flexDirection: "row", marginBottom: 6 }}>
            {DAYS_OF_WEEK.map((d) => (
              <View key={d} style={{ flex: 1, alignItems: "center" }}>
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: "600",
                    color: d === "Su" || d === "Sa" ? "#d97706" : "#9d6b82",
                  }}
                >
                  {d}
                </Text>
              </View>
            ))}
          </View>

          {/* Calendar Grid */}
          {Array.from({ length: cells.length / 7 }, (_, rowIdx) => (
            <View
              key={rowIdx}
              style={{ flexDirection: "row", marginBottom: 6 }}
            >
              {cells.slice(rowIdx * 7, rowIdx * 7 + 7).map((day, colIdx) => {
                if (!day) {
                  return <View key={colIdx} style={{ flex: 1, height: 42 }} />;
                }

                const status = getStatusForDate(
                  records,
                  viewYear,
                  viewMonth,
                  day,
                );
                const record = getRecordForDate(
                  records,
                  viewYear,
                  viewMonth,
                  day,
                );
                const isToday =
                  today.getFullYear() === viewYear &&
                  today.getMonth() === viewMonth &&
                  today.getDate() === day;
                const isFuture = new Date(viewYear, viewMonth, day) > today;

                const colors = status ? STATUS_COLORS[status] : null;

                return (
                  <TouchableOpacity
                    key={colIdx}
                    disabled={!record}
                    onPress={() =>
                      record && router.push(`/history/${record.id}`)
                    }
                    style={{
                      flex: 1,
                      height: 42,
                      alignItems: "center",
                      justifyContent: "center",
                      margin: 1,
                    }}
                    activeOpacity={0.7}
                  >
                    <View
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 10,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: colors ? colors.bg : "transparent",
                        borderWidth: isToday ? 2 : 0,
                        borderColor: isToday ? "#701a40" : "transparent",
                        opacity: isFuture ? 0.3 : 1,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: isToday ? "700" : "500",
                          color: colors ? "#fff" : isToday ? "#701a40" : "#444",
                        }}
                      >
                        {day}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}

          {/* Legend */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              gap: 16,
              marginTop: 12,
              paddingTop: 12,
              borderTopWidth: 1,
              borderTopColor: "#f0e8ec",
            }}
          >
            {[
              { label: "Present", color: "#16a34a" },
              { label: "Absent", color: "#dc2626" },
              { label: "Late", color: "#d97706" },
            ].map((item) => (
              <View
                key={item.label}
                style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
              >
                <View
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 3,
                    backgroundColor: item.color,
                  }}
                />
                <Text style={{ fontSize: 11, color: "#777" }}>
                  {item.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Tap hint */}
        <Text
          style={{
            textAlign: "center",
            color: "#b08090",
            fontSize: 12,
            marginTop: 12,
          }}
        >
          Tap a marked date to view details
        </Text>
      </ScrollView>
    </View>
  );
}
