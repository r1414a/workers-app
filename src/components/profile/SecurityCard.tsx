import { Text, View } from "react-native";

export default function SecurityCard() {
  const items = [
    // "Face Verified",
    "Device Bound",
    "GPS Enabled",
    "Background Tracking",
    "Notifications Enabled",
  ];

  return (
    <View className="bg-white rounded-2xl p-5 mx-4 mb-4">
      <Text className="font-bold text-lg mb-4 text-maroon border-b border-gray-300 pb-2">
        Security
      </Text>

      {items.map((item) => (
        <View key={item} className="flex-row justify-between py-2">
          <Text>{item}</Text>

          <Text className="text-green-600 font-bold">✓</Text>
        </View>
      ))}
    </View>
  );
}
