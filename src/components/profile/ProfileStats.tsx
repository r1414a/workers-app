import { Text, View } from "react-native";

interface Props {
  present: number;
  absent: number;
  late: number;
  attendance: number;
}

export default function ProfileStats({
  present,
  absent,
  late,
  attendance,
}: Props) {
  return (
    <View className="flex-row flex-wrap justify-center gap-3 px-4 mb-4">
      <View className="bg-white border border-gray-200 rounded-2xl p-4 min-w-[44%]">
        <Text className="text-slate-500 text-sm">Present</Text>

        <Text className="text-2xl font-bold text-green-600">{present}</Text>
      </View>

      <View className="bg-white border border-gray-200 rounded-2xl p-4 min-w-[44%]">
        <Text className="text-slate-500 text-sm">Absent</Text>

        <Text className="text-2xl font-bold text-red-500">{absent}</Text>
      </View>

      <View className="bg-white border border-gray-200 rounded-2xl p-4 min-w-[44%]">
        <Text className="text-slate-500 text-sm">Late</Text>

        <Text className="text-2xl font-bold text-orange-500">{late}</Text>
      </View>

      <View className="bg-white border border-gray-200 rounded-2xl p-4 min-w-[44%]">
        <Text className="text-slate-500 text-sm">Attendance</Text>

        <Text className="text-2xl font-bold text-blue-600">{attendance}%</Text>
      </View>
    </View>
  );
}
