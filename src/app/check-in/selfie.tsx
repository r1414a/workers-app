/**
 * app/check-in/selfie.tsx
 * Selfie Capture Screen — full-screen front camera with oval guide + preview
 * Demo-ready: camera works via expo-camera, preview shows captured photo
 */

import { CameraView, useCameraPermissions } from "expo-camera";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Platform,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";

import { DEMO_GPS, DEMO_WORKER } from "@/constants/demoData";
import { setSelfie, setTodayRecord } from "@/store/slice/attendanceSlice";
import type { AttendanceRecord } from "@/types/attendance.types";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");
const OVAL_W = SCREEN_W * 0.65;
const OVAL_H = OVAL_W * 1.25;

// ─── Liveness prompts (shown one at a time during capture) ───────────────────

const LIVENESS_PROMPTS = [
  "Look straight at the camera",
  "Blink twice slowly",
  "Slightly tilt your head right",
  "Look straight again",
];

// ─── Oval face guide ──────────────────────────────────────────────────────────

function FaceOval({ scanning }: { scanning: boolean }) {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (scanning) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, {
            toValue: 1.04,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(pulse, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      pulse.stopAnimation();
      pulse.setValue(1);
    }
  }, [scanning]);

  return (
    <Animated.View
      style={{
        width: OVAL_W,
        height: OVAL_H,
        borderRadius: OVAL_W / 2,
        borderWidth: 3,
        borderColor: scanning ? "#4ADE80" : "#FFFFFF88",
        transform: [{ scale: pulse }],
        // Cut-out illusion — dark overlay handles this via absolute positioned views
      }}
    />
  );
}

// ─── Scanning overlay (4 corner brackets) ─────────────────────────────────────

function ScanBrackets({ active }: { active: boolean }) {
  const color = active ? "#4ADE80" : "#FFFFFF55";
  const size = 24;
  const thickness = 3;
  const corners = [
    { top: -thickness, left: -thickness, rotate: "0deg" },
    { top: -thickness, right: -thickness, rotate: "90deg" },
    { bottom: -thickness, right: -thickness, rotate: "180deg" },
    { bottom: -thickness, left: -thickness, rotate: "270deg" },
  ] as const;

  return (
    <>
      {corners.map((c, i) => (
        <View
          key={i}
          style={{
            position: "absolute",
            ...c,
            width: size,
            height: size,
            borderTopWidth: thickness,
            borderLeftWidth: thickness,
            borderColor: color,
          }}
        />
      ))}
    </>
  );
}

// ─── Dark overlay around oval ─────────────────────────────────────────────────

function DarkMask() {
  const ovalTop = (SCREEN_H - OVAL_H) / 2 - 40;
  const ovalLeft = (SCREEN_W - OVAL_W) / 2;

  return (
    <>
      {/* Top */}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: ovalTop,
          backgroundColor: "#000000BB",
        }}
      />
      {/* Bottom */}
      <View
        style={{
          position: "absolute",
          top: ovalTop + OVAL_H,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "#000000BB",
        }}
      />
      {/* Left */}
      <View
        style={{
          position: "absolute",
          top: ovalTop,
          left: 0,
          width: ovalLeft,
          height: OVAL_H,
          backgroundColor: "#000000BB",
        }}
      />
      {/* Right */}
      <View
        style={{
          position: "absolute",
          top: ovalTop,
          right: 0,
          left: ovalLeft + OVAL_W,
          height: OVAL_H,
          backgroundColor: "#000000BB",
        }}
      />
    </>
  );
}

// ─── Preview screen (after photo taken) ───────────────────────────────────────

function PreviewScreen({
  uri,
  onRetake,
  onUse,
  isSubmitting,
}: {
  uri: string;
  onRetake: () => void;
  onUse: () => void;
  isSubmitting: boolean;
}) {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: "#000000" }}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      {/* Full-screen photo */}
      <Image source={{ uri }} style={{ flex: 1 }} contentFit="cover" />

      {/* Top info bar */}
      <View
        style={{
          position: "absolute",
          top: insets.top + 12,
          left: 20,
          right: 20,
        }}
      >
        <View
          style={{
            backgroundColor: "#00000088",
            borderRadius: 12,
            padding: 14,
          }}
        >
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 14,
              fontWeight: "700",
              marginBottom: 6,
            }}
          >
            Preview — does this look good?
          </Text>
          <Text style={{ color: "#94A3B8", fontSize: 12, marginBottom: 4 }}>
            📍 {DEMO_GPS.latitude.toFixed(6)}°N {DEMO_GPS.longitude.toFixed(6)}
            °E
          </Text>
          <Text style={{ color: "#94A3B8", fontSize: 12 }}>
            🕐{" "}
            {new Date().toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </Text>
        </View>
      </View>

      {/* Info badges */}
      <View
        style={{
          position: "absolute",
          bottom: insets.bottom + 130,
          left: 20,
          flexDirection: "row",
          gap: 8,
        }}
      >
        <View
          style={{
            backgroundColor: "#16A34A",
            borderRadius: 20,
            paddingHorizontal: 12,
            paddingVertical: 5,
          }}
        >
          <Text style={{ color: "#FFFFFF", fontSize: 11, fontWeight: "600" }}>
            ✓ Front camera
          </Text>
        </View>
        <View
          style={{
            backgroundColor: "#2563EB",
            borderRadius: 20,
            paddingHorizontal: 12,
            paddingVertical: 5,
          }}
        >
          <Text style={{ color: "#FFFFFF", fontSize: 11, fontWeight: "600" }}>
            ✓ Live capture
          </Text>
        </View>
      </View>

      {/* Bottom action buttons */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          paddingBottom: insets.bottom + 20,
          paddingTop: 20,
          paddingHorizontal: 20,
          backgroundColor: "#000000CC",
          flexDirection: "row",
          gap: 12,
        }}
      >
        <TouchableOpacity
          onPress={onRetake}
          disabled={isSubmitting}
          style={{
            flex: 1,
            backgroundColor: "#374151",
            borderRadius: 14,
            paddingVertical: 16,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#FFFFFF", fontSize: 15, fontWeight: "600" }}>
            ↺ Retake
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onUse}
          disabled={isSubmitting}
          style={{
            flex: 2,
            backgroundColor: isSubmitting ? "#15803D" : "#16A34A",
            borderRadius: 14,
            paddingVertical: 16,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
            gap: 8,
            shadowColor: "#16A34A",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.4,
            shadowRadius: 10,
            elevation: 5,
          }}
        >
          {isSubmitting ? (
            <>
              <ActivityIndicator size="small" color="#FFFFFF" />
              <Text
                style={{ color: "#FFFFFF", fontSize: 15, fontWeight: "700" }}
              >
                Submitting…
              </Text>
            </>
          ) : (
            <Text style={{ color: "#FFFFFF", fontSize: 15, fontWeight: "700" }}>
              ✓ Use this photo
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function SelfieCaptureScreen() {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();

  const [capturedUri, setCapturedUri] = useState<string | null>(null);
  const [promptIdx, setPromptIdx] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const promptOpacity = useRef(new Animated.Value(1)).current;

  // Cycle through liveness prompts every 2.5s
  useEffect(() => {
    if (capturedUri) return;
    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(promptOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(promptOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
      setPromptIdx((i) => (i + 1) % LIVENESS_PROMPTS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [capturedUri]);

  const handleCapture = async () => {
    if (!cameraRef.current || isCapturing) return;
    setIsCapturing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
        skipProcessing: Platform.OS === "android",
      });
      if (photo?.uri) setCapturedUri(photo.uri);
    } catch (e) {
      console.error("Capture error", e);
    } finally {
      setIsCapturing(false);
    }
  };

  const handleRetake = () => {
    setCapturedUri(null);
    setPromptIdx(0);
  };

  const handleUsePhoto = async () => {
    if (!capturedUri || isSubmitting) return;
    setIsSubmitting(true);

    // Simulate face verification API call (replace with real FaceVerificationService)
    await new Promise((r) => setTimeout(r, 1400));

    // Save selfie URI to Redux
    dispatch(setSelfie(capturedUri));

    // Build today's attendance record (demo)
    const now = new Date();
    const checkInTime = now.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    const shiftStartHour = 8; // 08:00 AM
    const isLate =
      now.getHours() > shiftStartHour ||
      (now.getHours() === shiftStartHour && now.getMinutes() > 10);
    const lateByMinutes = isLate
      ? (now.getHours() - shiftStartHour) * 60 + now.getMinutes() - 10
      : 0;

    const record: AttendanceRecord = {
      id: `ATT-${Date.now()}`,
      workerId: DEMO_WORKER.id,
      siteId: DEMO_WORKER.siteId,
      siteName: DEMO_WORKER.siteName,
      date: now.toISOString().split("T")[0],
      checkInTime,
      checkOutTime: null,
      checkInGps: {
        latitude: DEMO_GPS.latitude,
        longitude: DEMO_GPS.longitude,
        accuracy: DEMO_GPS.accuracy,
        timestamp: now.getTime(),
      },
      checkOutGps: null,
      checkInSelfiePath: capturedUri,
      checkOutSelfiePath: null,
      faceMatchScore: 94,
      isMockLocation: false,
      deviceHash: DEMO_WORKER.deviceId,
      hoursWorked: null,
      status: isLate ? "late" : "checked_in",
      syncStatus: "synced",
      isLate,
      lateByMinutes,
    };

    dispatch(setTodayRecord(record));
    setIsSubmitting(false);

    // Navigate to success screen
    router.replace("/check-in/success");
  };

  // ── Permission not granted ─────────────────────────────────────────────────
  if (!permission?.granted) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#000",
          alignItems: "center",
          justifyContent: "center",
          padding: 32,
        }}
      >
        <Text style={{ fontSize: 48, marginBottom: 20 }}>📷</Text>
        <Text
          style={{
            color: "#FFFFFF",
            fontSize: 18,
            fontWeight: "700",
            marginBottom: 10,
            textAlign: "center",
          }}
        >
          Camera permission required
        </Text>
        <Text
          style={{
            color: "#94A3B8",
            fontSize: 14,
            textAlign: "center",
            marginBottom: 24,
          }}
        >
          We need camera access to take your attendance selfie.
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          className="bg-maroon"
          style={{
            // backgroundColor: "#1D4ED8",
            borderRadius: 12,
            paddingVertical: 14,
            paddingHorizontal: 32,
          }}
        >
          <Text className="font-bold text-md text-white">Grant permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── Preview mode ───────────────────────────────────────────────────────────
  if (capturedUri) {
    return (
      <PreviewScreen
        uri={capturedUri}
        onRetake={handleRetake}
        onUse={handleUsePhoto}
        isSubmitting={isSubmitting}
      />
    );
  }

  // ── Camera mode ────────────────────────────────────────────────────────────
  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Camera */}
      <CameraView
        ref={cameraRef}
        style={{ flex: 1 }}
        facing="front"
        onCameraReady={() => setIsReady(true)}
      >
        {/* Dark mask around oval */}
        <DarkMask />

        {/* Oval + brackets */}
        <View
          style={{
            position: "absolute",
            top: (SCREEN_H - OVAL_H) / 2 - 40,
            left: (SCREEN_W - OVAL_W) / 2,
            width: OVAL_W,
            height: OVAL_H,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FaceOval scanning={isReady} />
          <ScanBrackets active={isReady} />
        </View>

        {/* Top bar */}
        <View
          style={{
            position: "absolute",
            top: insets.top + 10,
            left: 0,
            right: 0,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              width: 38,
              height: 38,
              borderRadius: 19,
              backgroundColor: "#00000055",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "#FFFFFF", fontSize: 18 }}>←</Text>
          </TouchableOpacity>
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 16,
              fontWeight: "700",
              marginLeft: 14,
            }}
          >
            Take selfie
          </Text>
        </View>

        {/* Liveness prompt */}
        <Animated.View
          style={{
            position: "absolute",
            top: (SCREEN_H - OVAL_H) / 2 - 40 - 56,
            left: 20,
            right: 20,
            opacity: promptOpacity,
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "#00000088",
              borderRadius: 24,
              paddingHorizontal: 20,
              paddingVertical: 10,
            }}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 14,
                fontWeight: "600",
                textAlign: "center",
              }}
            >
              {LIVENESS_PROMPTS[promptIdx]}
            </Text>
          </View>
        </Animated.View>

        {/* Instruction below oval */}
        <View
          style={{
            position: "absolute",
            top: (SCREEN_H - OVAL_H) / 2 - 40 + OVAL_H + 24,
            left: 20,
            right: 20,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#94A3B8", fontSize: 13, textAlign: "center" }}>
            Position your face in the oval and follow the prompts
          </Text>
        </View>

        {/* GPS tag */}
        <View
          style={{
            position: "absolute",
            bottom: insets.bottom + 140,
            left: 20,
            backgroundColor: "#00000077",
            borderRadius: 20,
            paddingHorizontal: 14,
            paddingVertical: 6,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 12, color: "#4ADE80", fontWeight: "600" }}>
            📍 On site · ±{DEMO_GPS.accuracy} m
          </Text>
        </View>

        {/* Capture button */}
        <View
          style={{
            position: "absolute",
            bottom: insets.bottom + 40,
            left: 0,
            right: 0,
            alignItems: "center",
          }}
        >
          {/* Outer ring */}
          <TouchableOpacity
            onPress={handleCapture}
            disabled={!isReady || isCapturing}
            activeOpacity={0.85}
            style={{
              width: 82,
              height: 82,
              borderRadius: 41,
              borderWidth: 4,
              borderColor: isReady ? "#FFFFFF" : "#FFFFFF44",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Inner circle */}
            {isCapturing ? (
              <ActivityIndicator size="large" color="#FFFFFF" />
            ) : (
              <View
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  backgroundColor: isReady ? "#FFFFFF" : "#FFFFFF44",
                }}
              />
            )}
          </TouchableOpacity>
          <Text style={{ color: "#94A3B8", fontSize: 12, marginTop: 10 }}>
            {isReady ? "Tap to capture" : "Camera loading…"}
          </Text>
        </View>
      </CameraView>
    </View>
  );
}
