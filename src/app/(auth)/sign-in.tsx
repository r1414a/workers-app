import { router } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignInScreen() {
  const [mobile, setMobile] = useState("");

  const handleSendOtp = () => {
    router.push("/permissions");
  };
  return (
    <SafeAreaView className="flex-1 bg-maroon">
      {/* <StatusBar barStyle="light-content" /> */}

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            paddingVertical: 20,
          }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View className="items-center pt-8 pb-6">
            {/* <View className="h-20 w-20 rounded-3xl bg-gold items-center justify-center">
              <Text className="text-maroon text-4xl font-bold">I</Text>
            </View> */}

            <Text className="text-white text-3xl font-bold mt-6">
              Iravya Attendance
            </Text>

            <Text className="text-gold text-xs tracking-[2px] mt-2">
              WORKFORCE TRACKING
            </Text>
          </View>

          {/* Login Card */}
          <View className="mx-5 bg-white rounded-[32px] px-6 py-8">
            {/* <Text className="text-center text-3xl font-bold text-slate-900">
              Welcome
            </Text> */}

            {/* <Text className="text-center text-sm text-slate-500 mt-2">
              Enter your mobile number to continue
            </Text> */}

            {/* Mobile Number */}
            <View className="">
              <Text className="text-slate-700 mb-2 font-medium">
                Mobile Number
              </Text>

              <View className="flex-row items-center border border-slate-200 rounded-2xl bg-slate-50 px-4">
                <Text className="text-slate-500 text-base font-semibold mr-2">
                  +91
                </Text>

                <TextInput
                  value={mobile}
                  onChangeText={setMobile}
                  keyboardType="phone-pad"
                  maxLength={10}
                  placeholder="9876543210"
                  placeholderTextColor="#94A3B8"
                  className="flex-1 py-3 text-slate-900"
                />
              </View>
            </View>

            {/* Send OTP */}
            <TouchableOpacity
              onPress={handleSendOtp}
              className="bg-maroon rounded-2xl py-3 mt-8 items-center"
            >
              <Text className="text-white font-bold text-base">Verify</Text>
            </TouchableOpacity>

            {/* Info Box */}
            {/* <View className="mt-6 bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <Text className="font-semibold text-amber-900">
                Device Binding Enabled
              </Text>

              <Text className="text-xs text-amber-700 mt-1">
                Your account can only be activated on one registered device.
              </Text>
            </View> */}

            {/* Help */}
            {/* <View className="mt-8 items-center">
              <Text className="text-slate-500 text-sm">Don't have access?</Text>

              <Text className="text-maroon font-semibold mt-1">
                Contact your Site Manager
              </Text>
            </View> */}
          </View>
          {/* Footer */}
          <View className="items-center mt-8">
            <Text className="text-white/70 text-xs">
              © 2026 Iravya Workforce Attendance
            </Text>

            <Text className="text-gold text-xs mt-1">Version 1.0.0</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// src/app/(auth)/sign-in.tsx

// import { router } from "expo-router";
// import { Pressable, Text, View } from "react-native";

// export default function SignInScreen() {
//   return (
//     <View className="flex-1 items-center justify-center bg-white px-6">
//       <Text className="mb-10 text-3xl font-bold">Sign In</Text>

//       <Pressable
//         className="rounded-xl bg-blue-600 px-8 py-4"
//         onPress={() => {
//           router.replace("/(onboarding)/permissions");
//         }}
//       >
//         <Text className="text-white">Demo Login</Text>
//       </Pressable>
//     </View>
//   );
// }
