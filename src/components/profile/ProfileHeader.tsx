import { Text, View } from "react-native";

interface Props {
  fullName: string;
  employeeId: string;
}

export default function ProfileHeader({ fullName, employeeId }: Props) {
  const initials = fullName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2);

  return (
    <View className="items-center py-6">
      {/* <View className="h-28 w-28 rounded-full bg-green-600 items-center justify-center">
        <Text className="text-white text-4xl font-bold">{initials}</Text>
      </View> */}

      <Text className="text-3xl font-bold mt-4">{fullName}</Text>

      <Text className="text-slate-500">{employeeId}</Text>
    </View>
  );
}
