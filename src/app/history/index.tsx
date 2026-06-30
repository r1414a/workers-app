import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";

import MonthYearPicker from "@/components/history/MonthYearPicker";
import Header from "@/components/ui/Header";
import { DEMO_HISTORY } from "@/constants/demoData";
import { useGetAttendanceHistoryQuery } from "@/store/api/workerApi";
import { selectUser } from "@/store/slice/authSlice";
import type { AttendanceRecord } from "@/types/attendance.types";
import { mapAttendanceHistory } from "@/utils/attendance-history";
import { router } from "expo-router";
import { ArrowLeft, ArrowRight, CalendarDays } from "lucide-react-native";

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
    bg: "#06b922",
    border: "#86EFAC",
  },
  absent: {
    bg: "#ff3636",
    border: "#FCA5A5",
  },
  late: {
    bg: "#e1b400",
    border: "#FCD34D",
  },
};

export default function HistoryScreen() {
  const { isLoggedIn } = useSelector(selectUser);

  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [pickerVisible, setPickerVisible] = useState(false);

  const {
    data: historyResponse,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetAttendanceHistoryQuery(
    { year: viewYear, month: viewMonth + 1 },
    { skip: !isLoggedIn },
  );

  console.log(isLoggedIn,historyResponse);
  

  const apiRecords = useMemo(
    () =>
      historyResponse?.data.attendance
        ? mapAttendanceHistory(historyResponse.data.attendance)
        : [],
    [historyResponse],
  );

  const records: AttendanceRecord[] = isLoggedIn ? apiRecords : DEMO_HISTORY;

  const monthStats = useMemo(() => {
    if (isLoggedIn && historyResponse?.data) {
      return {
        present: historyResponse.data.present,
        absent: historyResponse.data.absent,
        late: historyResponse.data.late,
      };
    }

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
  }, [records, viewYear, viewMonth, isLoggedIn, historyResponse]);

  const calendarDays = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    return { firstDay, daysInMonth };
  }, [viewYear, viewMonth]);

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

  function applyMonthYear(year: number, month: number) {
    setViewYear(year);
    setViewMonth(month);
  }

  const isAtPresent =
    viewYear > today.getFullYear() ||
    (viewYear === today.getFullYear() && viewMonth >= today.getMonth());

  const cells: (number | null)[] = [
    ...Array(calendarDays.firstDay).fill(null),
    ...Array.from({ length: calendarDays.daysInMonth }, (_, i) => i + 1),
  ];

  while (cells.length % 7 !== 0) cells.push(null);

  const showInitialLoader = isLoggedIn && isLoading && !historyResponse;

  return (
    <View style={{ flex: 1, backgroundColor: "#f8f4f6" }}>
      <Header text={"Attendance History"} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
      >
        <View style={{ flexDirection: "row", gap: 10, marginBottom: 16 }}>
          {[
            {
              label: "Present",
              value: monthStats.present,
              color: "#16a34a",
            },
            {
              label: "Absent",
              value: monthStats.absent,
              color: "#dc2626",
            },
            {
              label: "Late",
              value: monthStats.late,
              color: "#d97706",
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

        {isLoggedIn && isError && (
          <TouchableOpacity
            onPress={() => refetch()}
            style={{
              backgroundColor: "#fee2e2",
              borderRadius: 12,
              padding: 12,
              marginBottom: 12,
            }}
          >
            <Text style={{ color: "#b91c1c", textAlign: "center" }}>
              Could not load attendance. Tap to retry.
            </Text>
          </TouchableOpacity>
        )}

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
              <ArrowLeft color="#701a40" size={18} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setPickerVisible(true)}
              style={{ alignItems: "center", flexDirection: "row", gap: 6 }}
              activeOpacity={0.7}
            >
              <View style={{ alignItems: "center" }}>
                <Text className="text-lg">{MONTH_NAMES[viewMonth]}</Text>
                <Text className="text-sm">{viewYear}</Text>
              </View>
              <CalendarDays color="#701a40" size={16} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={nextMonth}
              disabled={isAtPresent}
              className={`${isAtPresent ? "#f0f0f0" : "bg-gray-100"}`}
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                alignItems: "center",
                justifyContent: "center",
                opacity: isAtPresent ? 0.4 : 1,
              }}
            >
              <ArrowRight color={isAtPresent ? "#ccc" : "#701a40"} size={18} />
            </TouchableOpacity>
          </View>

          {showInitialLoader ? (
            <View style={{ paddingVertical: 48, alignItems: "center" }}>
              <ActivityIndicator size="large" color="#701a40" />
            </View>
          ) : (
            <>
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

              {Array.from({ length: cells.length / 7 }, (_, rowIdx) => (
                <View
                  key={rowIdx}
                  style={{ flexDirection: "row", marginBottom: 6 }}
                >
                  {cells.slice(rowIdx * 7, rowIdx * 7 + 7).map((day, colIdx) => {
                    if (!day) {
                      return (
                        <View key={colIdx} style={{ flex: 1, height: 42 }} />
                      );
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
                              color: colors
                                ? "#fff"
                                : isToday
                                  ? "#701a40"
                                  : "#444",
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

              {isFetching && !showInitialLoader && (
                <Text
                  style={{
                    textAlign: "center",
                    color: "#9d6b82",
                    fontSize: 11,
                    marginTop: 8,
                  }}
                >
                  Updating…
                </Text>
              )}
            </>
          )}

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

      <MonthYearPicker
        visible={pickerVisible}
        year={viewYear}
        month={viewMonth}
        onClose={() => setPickerVisible(false)}
        onApply={applyMonthYear}
      />
    </View>
  );
}
