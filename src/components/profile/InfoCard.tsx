import { Text, View } from "react-native";

interface Row {
  label: string;
  value: string;
}

interface Props {
  title: string;
  rows: Row[];
}

export default function InfoCard({ title, rows }: Props) {
  return (
    <View className="bg-white border border-gray-200 rounded-2xl p-5 mx-4 mb-4">
      <Text className="font-bold text-lg mb-4 text-maroon border-b border-gray-300 pb-2">
        {title}
      </Text>

      {rows.map((row) => (
        <View key={row.label} className="flex-row justify-between py-2">
          <Text className="text-slate-500">{row.label}</Text>

          <Text className="font-medium">{row.value}</Text>
        </View>
      ))}
    </View>
  );
}
