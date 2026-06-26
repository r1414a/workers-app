// app/(onboarding)/profile-photo.tsx

import { router } from "expo-router";
import { useRef, useState } from "react";

import { CameraView, useCameraPermissions } from "expo-camera";

import { Image, Pressable, Text, View } from "react-native";

import { Camera } from "lucide-react-native";

import { updateProfilePhoto } from "@/store/slice/authSlice";
import { useDispatch } from "react-redux";

export default function ProfilePhotoScreen() {
  const dispatch = useDispatch();

  const [permission, requestPermission] = useCameraPermissions();

  const [photoUri, setPhotoUri] = useState<string | null>(null);

  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    return null;
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Text className="mb-4 text-center text-lg font-semibold">
          Camera permission required
        </Text>

        <Pressable
          onPress={requestPermission}
          className="rounded-xl bg-blue-600 px-6 py-3"
        >
          <Text className="text-white">Grant Permission</Text>
        </Pressable>
      </View>
    );
  }

  const takePhoto = async () => {
    if (!cameraRef.current) return;

    const photo = await cameraRef.current.takePictureAsync({
      quality: 0.7,
    });

    setPhotoUri(photo.uri);
  };

  const saveAndContinue = () => {
    if (!photoUri) return;

    dispatch(updateProfilePhoto(photoUri));

    router.push("/(auth)/device-registration");
  };

  if (photoUri) {
    return (
      <View className="flex-1 bg-white p-6">
        <Text className="mt-10 text-3xl font-bold">Selfie Preview</Text>

        <Image
          source={{ uri: photoUri }}
          className="mt-8 h-[450px] w-full rounded-3xl"
        />

        <View className="mt-auto gap-3">
          <Pressable
            onPress={() => setPhotoUri(null)}
            className="h-14 items-center justify-center rounded-xl border"
          >
            <Text>Retake Photo</Text>
          </Pressable>

          <Pressable
            onPress={saveAndContinue}
            className="h-14 items-center justify-center rounded-xl bg-green-600"
          >
            <Text className="font-semibold text-white">Continue</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <CameraView ref={cameraRef} style={{ flex: 1 }} facing="front" />

      <View className="absolute bottom-10 w-full items-center">
        <Pressable
          onPress={takePhoto}
          className="h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-white/20"
        >
          <Camera color="white" size={32} />
        </Pressable>
      </View>
    </View>
  );
}
