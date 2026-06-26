import { Text, View } from "react-native";

interface Props {
  presentDays: number;
  absentDays: number;
  lateDays: number;
}

export default function AttendanceStats({
  presentDays,
  absentDays,
  lateDays,
}: Props) {
  return (
    <View className="flex-row gap-3 mb-5">
      <View className="flex-1 justify-center items-center bg-white rounded-2xl p-4">
        <Text className="text-slate-500 text-xs">Present</Text>

        <Text className="text-2xl font-bold text-green-600">{presentDays}</Text>
      </View>

      <View className="flex-1 justify-center items-center bg-white rounded-2xl p-4">
        <Text className="text-slate-500 text-xs">Absent</Text>

        <Text className="text-2xl font-bold text-red-500">{absentDays}</Text>
      </View>

      <View className="flex-1 justify-center items-center bg-white rounded-2xl p-4">
        <Text className="text-slate-500 text-xs">Late</Text>

        <Text className="text-2xl font-bold text-orange-500">{lateDays}</Text>
      </View>
    </View>
  );
}
