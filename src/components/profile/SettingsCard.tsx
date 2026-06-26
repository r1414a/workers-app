import { Text, TouchableOpacity, View } from "react-native";

export default function SettingsCard() {
  const options = [
    "Change Password",
    "Help & Support",
    "Privacy Policy",
    "Logout",
  ];

  return (
    <View className="bg-white rounded-2xl p-5 mx-4 mb-6">
      <Text className="font-bold text-lg mb-4 text-maroon border-b border-gray-300 pb-2">
        Settings
      </Text>

      {options.map((item) => (
        <TouchableOpacity key={item} className="py-3 border-b border-slate-100">
          <Text>{item}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
