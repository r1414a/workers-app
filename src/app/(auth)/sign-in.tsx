import { router } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";

import {
  mobileVerifySchema,
  type MobileVerifyForm,
} from "@/schemas/validation.schemas";
import { DeviceBindingService } from "@/services/DeviceBindingService";
import {
  useLoginWorkerMutation,
  useVerifyWorkerMutation,
} from "@/store/api/workerApi";
import { loginSuccess, setDeviceRegistered } from "@/store/slice/authSlice";
import { registerDevice } from "@/store/slice/deviceSlice";
import { getApiErrorMessage } from "@/utils/api-error";
import { persistAuthSession } from "@/utils/auth-session";
import { hasAllPermissions } from "@/utils/permissions";
import { showErrorToast, showSuccessToast } from "@/utils/toast";

export default function SignInScreen() {
  const dispatch = useDispatch();
  const [verifyWorker, { isLoading: isRegistering }] = useVerifyWorkerMutation();
  const [loginWorker, { isLoading: isLoggingIn }] = useLoginWorkerMutation();
  const isLoading = isRegistering || isLoggingIn;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<MobileVerifyForm>({
    resolver: zodResolver(mobileVerifySchema),
    defaultValues: { mobile: "" },
  });

  const onSubmit = async ({ mobile }: MobileVerifyForm) => {
    try {
      const payload = await DeviceBindingService.getVerifyPayload(mobile);
      const binding = await DeviceBindingService.validate();
      console.log("binding",binding);

      if (!binding.isRegistered) {
        const registerResponse = await verifyWorker(payload).unwrap();
        const fingerprint = await DeviceBindingService.getFingerprint();
        await DeviceBindingService.saveRegistered(fingerprint);
        dispatch(registerDevice(fingerprint));
        dispatch(setDeviceRegistered(true));

        showSuccessToast(
          registerResponse.message || "Device registered successfully",
          "Device Registered",
        );
      }

      const loginResponse = await loginWorker({
        phone: mobile,
        fingerprint: payload.fingerprint,
      }).unwrap();

      const { token, worker } = loginResponse.data;
      await persistAuthSession(token, worker);
      dispatch(loginSuccess({ token, worker }));

      showSuccessToast(loginResponse.message || "Welcome back", "Logged In");

      const permissionsGranted = await hasAllPermissions();
      router.replace(
        permissionsGranted ? "/home" : "/(onboarding)/permissions",
      );
    } catch (error) {
      showErrorToast(
        getApiErrorMessage(error, "Sign in failed. Please try again."),
        "Sign In Failed",
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-maroon">
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
          <View className="items-center pt-8 pb-6">
            <Text className="text-white text-3xl font-bold mt-6">
              Iravya Attendance
            </Text>

            <Text className="text-gold text-xs tracking-[2px] mt-2">
              WORKFORCE TRACKING
            </Text>
          </View>

          <View className="mx-5 bg-white rounded-[32px] px-6 py-8">
            <View>
              <Text className="text-slate-700 mb-2 font-medium">
                Mobile Number
              </Text>

              <View className="flex-row items-center border border-slate-200 rounded-2xl bg-slate-50 px-4">
                <Text className="text-slate-500 text-base font-semibold mr-2">
                  +91
                </Text>

                <Controller
                  control={control}
                  name="mobile"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      keyboardType="phone-pad"
                      maxLength={10}
                      placeholder="9876543210"
                      placeholderTextColor="#94A3B8"
                      className="flex-1 py-3 text-slate-900"
                      editable={!isLoading}
                    />
                  )}
                />
              </View>

              {errors.mobile && (
                <Text className="text-red-500 text-sm mt-1">
                  {errors.mobile.message}
                </Text>
              )}
            </View>

            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading}
              className={`bg-maroon rounded-2xl py-3 mt-8 items-center ${
                isLoading ? "opacity-70" : ""
              }`}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-bold text-base">Sign In</Text>
              )}
            </TouchableOpacity>
          </View>

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
