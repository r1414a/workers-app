// src/app/(onboarding)/personal-info.tsx

import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useForm } from "react-hook-form";

import { Pressable, ScrollView, Text, View } from "react-native";

import {
  PersonalInfoForm,
  personalInfoSchema,
} from "@/schemas/validation.schemas";

import { FormInput } from "@/components/forms/FormInput";
import { setWorkerProfile } from "@/store/slice/authSlice";
import { useDispatch } from "react-redux";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function PersonalInfoScreen() {
  const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<PersonalInfoForm>({
    resolver: zodResolver(personalInfoSchema),

    defaultValues: {
      fullName: "",
      employeeId: "",
      mobileNumber: "",
      emergencyContact: "",
      bloodGroup: "",
      aadhaarLast4: "",
    },
  });

  const selectedBloodGroup = watch("bloodGroup");

  const onSubmit = (data: PersonalInfoForm) => {
    dispatch(setWorkerProfile(data));

    router.push("/(onboarding)/profile-photo");
  };

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{
        padding: 20,
      }}
    >
      <Text className="text-3xl text-red-600 font-bold">
        Personal Information
      </Text>

      <Text className="mt-2 text-gray-500">
        Complete your profile before attendance registration.
      </Text>

      {/* Full Name */}

      <FormInput
        label="Full Name"
        name="fullName"
        control={control}
        error={errors.fullName?.message}
        placeholder="Ravi Verma"
      />

      {/* Employee ID */}

      <FormInput
        label="Employee ID"
        name="employeeId"
        control={control}
        error={errors.employeeId?.message}
        placeholder="EMP001"
      />

      {/* Mobile */}

      <FormInput
        label="Mobile Number"
        name="mobileNumber"
        keyboardType="phone-pad"
        control={control}
        error={errors.mobileNumber?.message}
        placeholder="9022002202"
      />

      {/* Emergency */}

      <FormInput
        label="Emergency Contact"
        name="emergencyContact"
        keyboardType="phone-pad"
        control={control}
        error={errors.emergencyContact?.message}
        placeholder="9027226662"
      />

      {/* Aadhaar */}

      <FormInput
        label="Aadhaar Last 4 Digits"
        name="aadhaarLast4"
        keyboardType="number-pad"
        control={control}
        error={errors.aadhaarLast4?.message}
        placeholder="4783"
      />

      {/* Blood Group */}

      <Text className="mt-6 mb-2 font-semibold">Blood Group</Text>

      <View className="flex-row flex-wrap gap-2">
        {BLOOD_GROUPS.map((group) => (
          <Pressable
            key={group}
            onPress={() => setValue("bloodGroup", group)}
            className={`rounded-xl border px-4 py-3 ${
              selectedBloodGroup === group
                ? "bg-blue-600 border-blue-600"
                : "border-gray-300"
            }`}
          >
            <Text
              className={`${
                selectedBloodGroup === group ? "text-white" : "text-black"
              }`}
            >
              {group}
            </Text>
          </Pressable>
        ))}
      </View>

      {errors.bloodGroup && (
        <Text className="mt-1 text-red-500">{errors.bloodGroup.message}</Text>
      )}

      <Pressable
        onPress={handleSubmit(onSubmit)}
        className="mt-10 h-14 items-center justify-center rounded-xl bg-blue-600"
      >
        <Text className="font-semibold text-white">Continue</Text>
      </Pressable>
    </ScrollView>
  );
}
