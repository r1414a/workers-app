import { format } from "date-fns";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

import type { AttendanceRecord } from "@/types/attendance.types";

interface Props {
  item: AttendanceRecord;
}

function getStatusColor(status: AttendanceRecord["status"]) {
  switch (status) {
    case "checked_out":
      return "bg-green-100 text-green-700";

    case "checked_in":
      return "bg-blue-100 text-blue-700";

    case "late":
      return "bg-orange-100 text-orange-700";

    case "absent":
      return "bg-red-100 text-red-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
}

export default function AttendanceCard({ item }: Props) {
  return (
    <TouchableOpacity
      onPress={() => router.push(`/history/${item.id}`)}
      className="bg-white rounded-2xl p-5 mb-4 border border-slate-100"
    >
      <View className="flex-row justify-between items-center">
        <View>
          <Text className="text-lg font-bold text-slate-900">
            {format(new Date(item.date), "dd MMM yyyy")}
          </Text>

          <Text className="text-xs text-slate-500 mt-1">
            {format(new Date(item.date), "EEEE")}
          </Text>
        </View>

        <View
          className={`px-3 py-2 rounded-full ${
            item.status === "checked_out"
              ? "bg-green-100"
              : item.status === "absent"
                ? "bg-red-100"
                : item.isLate
                  ? "bg-orange-100"
                  : "bg-blue-100"
          }`}
        >
          <Text
            className={`text-xs font-bold ${
              item.status === "checked_out"
                ? "text-green-700"
                : item.status === "absent"
                  ? "text-red-700"
                  : item.isLate
                    ? "text-orange-700"
                    : "text-blue-700"
            }`}
          >
            {item.status.replace("_", " ").toUpperCase()}
          </Text>
        </View>
      </View>

      <View className="h-px bg-slate-100 my-4" />

      <View className="flex-row justify-between">
        <View>
          <Text className="text-xs text-slate-500">Check In</Text>

          <Text className="font-bold text-slate-900 mt-1">
            {item.checkInTime ?? "--"}
          </Text>
        </View>

        <View>
          <Text className="text-xs text-slate-500">Check Out</Text>

          <Text className="font-bold text-slate-900 mt-1">
            {item.checkOutTime ?? "--"}
          </Text>
        </View>

        <View>
          <Text className="text-xs text-slate-500">Hours</Text>

          <Text className="font-bold text-slate-900 mt-1">
            {item.hoursWorked?.toFixed(1) ?? "--"}h
          </Text>
        </View>
      </View>

      {item.isLate && (
        <View className="w-fit mt-4 bg-orange-50 rounded-xl p-3">
          <Text className="text-orange-700 text-xs font-semibold">
            Late by {item.lateByMinutes} minutes
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
