/**
 * app/check-in/index.tsx — Check-in Flow Orchestrator
 * Handles: device binding → GPS verify → geofence → selfie → submit
 */

import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ─── Types ────────────────────────────────────────────────────────────────────

type CheckInStep =
  | "idle"
  | "security"
  | "device"
  | "gps"
  | "geofence"
  | "ready"
  | "error";

interface StepResult {
  step: CheckInStep;
  passed: boolean;
  detail: string;
}

interface GpsCoords {
  latitude: number;
  longitude: number;
  accuracy: number;
}

// ─── Mock / stub services ─────────────────────────────────────────────────────
// Replace these with actual service imports

async function runSecurityCheck(): Promise<{
  passed: boolean;
  reason?: string;
}> {
  await new Promise((r) => setTimeout(r, 700));
  return { passed: true };
}

async function runDeviceCheck(): Promise<{ passed: boolean; reason?: string }> {
  await new Promise((r) => setTimeout(r, 600));
  return { passed: true };
}

async function getLocation(): Promise<GpsCoords> {
  await new Promise((r) => setTimeout(r, 900));
  // Replace with actual expo-location call:
  // const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
  return { latitude: 19.076, longitude: 72.8777, accuracy: 8.4 };
}

async function checkGeofence(
  coords: GpsCoords,
): Promise<{ inside: boolean; distanceMeters: number }> {
  await new Promise((r) => setTimeout(r, 400));
  // Replace with GeofenceService.isInsideSite()
  const SITE_LAT = 19.0762;
  const SITE_LNG = 72.878;
  const R = 6371000;
  const dLat = ((coords.latitude - SITE_LAT) * Math.PI) / 180;
  const dLng = ((coords.longitude - SITE_LNG) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((SITE_LAT * Math.PI) / 180) *
      Math.cos((coords.latitude * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  const distance = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return { inside: distance <= 250, distanceMeters: Math.round(distance) };
}

// ─── Step config ──────────────────────────────────────────────────────────────

const STEP_META: Record<
  string,
  { icon: string; title: string; description: string }
> = {
  security: {
    icon: "🛡️",
    title: "Security check",
    description: "Checking for mock location or rooted device",
  },
  device: {
    icon: "📱",
    title: "Device verification",
    description: "Confirming this is your registered device",
  },
  gps: {
    icon: "📡",
    title: "Getting location",
    description: "Acquiring GPS signal — stay outdoors",
  },
  geofence: {
    icon: "📍",
    title: "Site boundary check",
    description: "Verifying you are within the site boundary",
  },
};

// ─── Step row component ───────────────────────────────────────────────────────

function StepRow({
  id,
  meta,
  status,
  detail,
}: {
  id: string;
  meta: (typeof STEP_META)[string];
  status: "pending" | "running" | "passed" | "failed";
  detail?: string;
}) {
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (status === "running") {
      Animated.loop(
        Animated.timing(spin, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ).start();
    } else {
      spin.stopAnimation();
      spin.setValue(0);
    }
  }, [status]);

  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const iconMap = {
    pending: "⬜",
    running: null,
    passed: "✅",
    failed: "❌",
  };

  const bgMap = {
    pending: "#F9FAFB",
    running: "#EFF6FF",
    passed: "#F0FDF4",
    failed: "#FEF2F2",
  };

  const borderMap = {
    pending: "#E5E7EB",
    running: "#BFDBFE",
    passed: "#BBF7D0",
    failed: "#FECACA",
  };

  return (
    <View
      style={{
        backgroundColor: bgMap[status],
        borderWidth: 1,
        borderColor: borderMap[status],
        borderRadius: 14,
        padding: 16,
        marginBottom: 10,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 24, marginRight: 14 }}>{meta.icon}</Text>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: "600",
            color: status === "pending" ? "#9CA3AF" : "#111827",
            marginBottom: 2,
          }}
        >
          {meta.title}
        </Text>
        <Text style={{ fontSize: 12, color: "#6B7280" }}>
          {status === "running" ? meta.description : detail || meta.description}
        </Text>
      </View>
      <View style={{ width: 28, alignItems: "center" }}>
        {status === "running" ? (
          <Animated.View style={{ transform: [{ rotate }] }}>
            <ActivityIndicator size="small" color="#2563EB" />
          </Animated.View>
        ) : (
          <Text style={{ fontSize: 20 }}>{iconMap[status]}</Text>
        )}
      </View>
    </View>
  );
}

// ─── GPS info card ────────────────────────────────────────────────────────────

function GpsInfoCard({
  coords,
  distance,
  siteName,
}: {
  coords: GpsCoords;
  distance: number;
  siteName: string;
}) {
  return (
    <View className="bg-maroon p-4 rounded-xl">
      <Text
        className="text-sm text-gold"
        style={{
          marginBottom: 10,
        }}
      >
        📍 Confirmed location
      </Text>
      <View style={{ flexDirection: "row", gap: 20, marginBottom: 10 }}>
        <View>
          <Text className="text-gold text-xs">Latitude</Text>
          <Text style={{ fontSize: 16, fontWeight: "700", color: "#FFFFFF" }}>
            {coords.latitude.toFixed(6)}
          </Text>
        </View>
        <View>
          <Text className="text-gold text-xs">Longitude</Text>
          <Text style={{ fontSize: 16, fontWeight: "700", color: "#FFFFFF" }}>
            {coords.longitude.toFixed(6)}
          </Text>
        </View>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text className="text-gold text-sm">
          Accuracy: ±{coords.accuracy.toFixed(1)} m
        </Text>
        <Text
          className="text-sm"
          style={{ color: "#4ADE80", fontWeight: "600" }}
        >
          {distance < 200 ? "✓ On site" : `${distance} m from site`}
        </Text>
      </View>
    </View>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function CheckInScreen() {
  const insets = useSafeAreaInsets();
  const [currentStep, setCurrentStep] = useState<CheckInStep>("idle");
  const [results, setResults] = useState<StepResult[]>([]);
  const [gpsCoords, setGpsCoords] = useState<GpsCoords | null>(null);
  const [siteDistance, setSiteDistance] = useState<number | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const SITE_NAME = "Oberoi Realty — Tower C";

  const getStepStatus = (
    stepId: CheckInStep,
  ): "pending" | "running" | "passed" | "failed" => {
    if (currentStep === stepId) return "running";
    const r = results.find((r) => r.step === stepId);
    if (!r) return "pending";
    return r.passed ? "passed" : "failed";
  };

  const getStepDetail = (stepId: CheckInStep): string | undefined => {
    const r = results.find((r) => r.step === stepId);
    return r?.detail;
  };

  const runChecks = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setResults([]);
    setGlobalError(null);
    setGpsCoords(null);
    setSiteDistance(null);

    const addResult = (step: CheckInStep, passed: boolean, detail: string) => {
      setResults((prev) => [...prev, { step, passed, detail }]);
    };

    try {
      // Step 1: Security
      setCurrentStep("security");
      const sec = await runSecurityCheck();
      addResult(
        "security",
        sec.passed,
        sec.passed
          ? "No threats detected"
          : sec.reason || "Security check failed",
      );
      if (!sec.passed) {
        setGlobalError(
          sec.reason ||
            "Security check failed. Please disable mock location apps.",
        );
        setCurrentStep("error");
        return;
      }

      // Step 2: Device
      setCurrentStep("device");
      const dev = await runDeviceCheck();
      addResult(
        "device",
        dev.passed,
        dev.passed
          ? "This device is verified"
          : dev.reason || "Device mismatch",
      );
      if (!dev.passed) {
        setGlobalError(
          "This device is not registered to your account. Contact your supervisor.",
        );
        setCurrentStep("error");
        return;
      }

      // Step 3: GPS
      setCurrentStep("gps");
      const coords = await getLocation();
      setGpsCoords(coords);
      addResult("gps", true, `±${coords.accuracy.toFixed(0)} m accuracy`);

      // Step 4: Geofence
      setCurrentStep("geofence");
      const fence = await checkGeofence(coords);
      setSiteDistance(fence.distanceMeters);
      addResult(
        "geofence",
        fence.inside,
        fence.inside
          ? `${fence.distanceMeters} m from site centre`
          : `${fence.distanceMeters} m from boundary — too far`,
      );
      if (!fence.inside) {
        setGlobalError(
          `You are ${fence.distanceMeters} m from the site boundary. Move closer to check in.`,
        );
        setCurrentStep("error");
        return;
      }

      setCurrentStep("ready");
    } catch (e: any) {
      setGlobalError(e.message || "Unexpected error. Please try again.");
      setCurrentStep("error");
    } finally {
      setIsRunning(false);
    }
  };

  const proceedToSelfie = () => {
    router.push("/check-in/selfie");
  };

  const steps: CheckInStep[] = ["security", "device", "gps", "geofence"];

  return (
    <View className="flex-1">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View
        className="border-b border-gray-200 bg-maroon"
        style={{
          paddingTop: insets.top + 8,
          paddingHorizontal: 20,
          paddingBottom: 16,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-gold"
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 14,
          }}
        >
          <Text className="text-white text-xl">←</Text>
        </TouchableOpacity>
        <View>
          <Text className="text-white font-bold text-xl">Check in</Text>
          <Text className="text-gold text-xs">{SITE_NAME}</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{
          padding: 20,
          paddingBottom: insets.bottom + 100,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Intro block (idle state) */}
        {currentStep === "idle" && (
          <View className="flex justify-center items-center border border-gray-200 bg-white rounded-2xl p-4">
            <Text style={{ fontSize: 32, marginBottom: 12 }}>📍</Text>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: "#1E3A8A",
                marginBottom: 8,
                textAlign: "center",
              }}
            >
              Ready to check in?
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "#3B82F6",
                textAlign: "center",
                lineHeight: 20,
              }}
            >
              We'll verify your device, confirm your location, and take a quick
              selfie. This takes about 10 seconds.
            </Text>
          </View>
        )}

        {/* Verification steps */}
        {currentStep !== "idle" &&
          steps.map((stepId) => (
            <StepRow
              key={stepId}
              id={stepId}
              meta={STEP_META[stepId]}
              status={getStepStatus(stepId)}
              detail={getStepDetail(stepId)}
            />
          ))}

        {/* GPS info card (shown when geofence passed) */}
        {gpsCoords && siteDistance !== null && currentStep !== "error" && (
          <GpsInfoCard
            coords={gpsCoords}
            distance={siteDistance}
            siteName={SITE_NAME}
          />
        )}

        {/* Error message */}
        {globalError && (
          <View
            style={{
              backgroundColor: "#FEF2F2",
              borderWidth: 1,
              borderColor: "#FECACA",
              borderRadius: 14,
              padding: 16,
              marginTop: 8,
              flexDirection: "row",
              alignItems: "flex-start",
            }}
          >
            <Text style={{ fontSize: 20, marginRight: 12 }}>⚠️</Text>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#991B1B",
                  marginBottom: 4,
                }}
              >
                Check-in blocked
              </Text>
              <Text style={{ fontSize: 13, color: "#B91C1C", lineHeight: 18 }}>
                {globalError}
              </Text>
            </View>
          </View>
        )}

        {/* Ready — selfie prompt */}
        {currentStep === "ready" && (
          <View
            style={{
              backgroundColor: "#F0FDF4",
              borderWidth: 1,
              borderColor: "#BBF7D0",
              borderRadius: 16,
              padding: 20,
              marginTop: 8,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 36, marginBottom: 10 }}>🤳</Text>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: "#14532D",
                marginBottom: 6,
                textAlign: "center",
              }}
            >
              All checks passed
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: "#16A34A",
                textAlign: "center",
                lineHeight: 18,
              }}
            >
              One last step — take a quick selfie to confirm it's you.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom CTA */}
      <View
        className="border-t border-gray-300"
        style={{
          //   position: "absolute",
          //   bottom: 0,
          //   left: 0,
          //   right: 0,
          padding: 20,
          paddingBottom: insets.bottom + 16,
          backgroundColor: "#FFFFFF",
        }}
      >
        {currentStep === "idle" && (
          <TouchableOpacity
            onPress={runChecks}
            className="shadow-sm"
            style={{
              backgroundColor: "#1D4ED8",
              borderRadius: 14,
              paddingVertical: 16,
              alignItems: "center",
              elevation: 4,
            }}
            activeOpacity={0.85}
          >
            <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "700" }}>
              Start verification
            </Text>
          </TouchableOpacity>
        )}

        {currentStep === "ready" && (
          <TouchableOpacity
            onPress={proceedToSelfie}
            className="shadow-sm"
            style={{
              backgroundColor: "#16A34A",
              borderRadius: 14,
              paddingVertical: 16,
              alignItems: "center",
              elevation: 4,
            }}
            activeOpacity={0.85}
          >
            <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "700" }}>
              Take selfie →
            </Text>
          </TouchableOpacity>
        )}

        {currentStep === "error" && (
          <TouchableOpacity
            onPress={runChecks}
            style={{
              backgroundColor: "#F3F4F6",
              borderRadius: 14,
              paddingVertical: 16,
              alignItems: "center",
            }}
            activeOpacity={0.85}
          >
            <Text style={{ color: "#374151", fontSize: 16, fontWeight: "600" }}>
              Try again
            </Text>
          </TouchableOpacity>
        )}

        {isRunning && (
          <View style={{ alignItems: "center", paddingVertical: 10 }}>
            <Text style={{ fontSize: 13, color: "#6B7280" }}>Verifying…</Text>
          </View>
        )}
      </View>
    </View>
  );
}
