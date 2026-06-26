import { DeviceBindingService } from "@/services/DeviceBindingService";
import { registerDevice } from "@/store/slice/deviceSlice";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";

export default function VerifyOtpScreen() {
  const [otp, setOtp] = useState("");
  const [seconds, setSeconds] = useState(30);
  const dispatch = useDispatch();

  useEffect(() => {
    if (seconds === 0) return;

    const timer = setTimeout(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [seconds]);

  const handleVerifyOtp = async () => {
    try {
      const fingerprint = await DeviceBindingService.getFingerprint();

      await DeviceBindingService.saveRegistered(fingerprint);

      dispatch(registerDevice(fingerprint));
      router.push("/(onboarding)/permissions");
    } catch (error) {
      console.log(error);
    }
  };

  const handleResendOtp = () => {
    setSeconds(30);
  };

  return (
    <SafeAreaView className="flex-1 bg-maroon">
      <StatusBar barStyle="light-content" />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View className="flex-1 justify-start pt-8 px-5">
          {/* Card */}
          <View className="bg-white rounded-[32px] px-6 py-8">
            <Text className="text-center text-3xl font-bold text-slate-900">
              Verify OTP
            </Text>

            <Text className="text-center text-slate-500 mt-2">
              Enter the 6-digit code sent to your mobile number
            </Text>

            {/* OTP Input */}
            <View className="mt-8">
              <Text className="text-slate-700 mb-2 font-medium">OTP Code</Text>

              <TextInput
                value={otp}
                onChangeText={setOtp}
                keyboardType="number-pad"
                maxLength={6}
                placeholder="123456"
                placeholderTextColor="#94A3B8"
                className="
                  border
                  border-slate-200
                  rounded-xl
                  bg-slate-50
                  text-center
                  text-2xl
                  tracking-[10px]
                  py-3
                  text-slate-900
                "
              />
            </View>

            {/* Verify Button */}
            <TouchableOpacity
              onPress={handleVerifyOtp}
              disabled={otp.length !== 6}
              className={`rounded-xl py-3 mt-4 items-center ${
                otp.length === 6 ? "bg-maroon" : "bg-slate-300"
              }`}
            >
              <Text className="text-white font-bold text-base">Verify OTP</Text>
            </TouchableOpacity>

            {/* Resend */}
            <View className="items-center mt-4">
              {seconds > 0 ? (
                <Text className="text-slate-500">
                  Resend OTP in{" "}
                  <Text className="font-bold text-maroon">{seconds}s</Text>
                </Text>
              ) : (
                <TouchableOpacity onPress={handleResendOtp}>
                  <Text className="font-semibold text-maroon">Resend OTP</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Security Notice */}
            {/* <View className="mt-8 bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <Text className="font-semibold text-amber-900">
                Device Registration Required
              </Text>

              <Text className="text-xs text-amber-700 mt-1">
                After verification, this device will be linked to your account
                and used for attendance tracking.
              </Text>
            </View> */}
          </View>

          {/* Footer */}
          <View className="items-center mt-8">
            <Text className="text-white/70 text-xs">Need help?</Text>

            <Text className="text-gold text-sm font-semibold mt-1">
              Contact your Site Manager
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
