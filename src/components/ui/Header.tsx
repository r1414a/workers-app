import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SITE_NAME = "Oberoi Realty — Tower C";

export default function Header({ text }: { text: string }) {
  const insets = useSafeAreaInsets();
  return (
    <View
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
        <Text>
          <ArrowLeft color={"white"} />
        </Text>
      </TouchableOpacity>
      <View>
        <Text style={{ color: "#fff", fontWeight: "700", fontSize: 20 }}>
          {text}
        </Text>
        <Text style={{ color: "#f5b041", fontSize: 12 }}>{SITE_NAME}</Text>
      </View>
    </View>
  );
}
