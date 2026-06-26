/**
 * app/check-in/success.tsx
 * Check-in Success Screen — animated confirmation with attendance proof card
 * Demo-ready, reads from Redux todayRecord + selfieUri
 */

import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
    Animated,
    Dimensions,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

import { DEMO_WORKER } from "@/constants/demoData";
import {
    selectSelfieUri,
    selectTodayRecord,
} from "@/store/slice/attendanceSlice";

const { width: SCREEN_W } = Dimensions.get("window");

// ─── Confetti particle ────────────────────────────────────────────────────────

const CONFETTI_COLORS = [
  "#1D4ED8",
  "#16A34A",
  "#F59E0B",
  "#EC4899",
  "#8B5CF6",
  "#06B6D4",
];

function ConfettiParticle({ delay, x }: { delay: number; x: number }) {
  const translateY = useRef(new Animated.Value(-20)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const color =
    CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
  const size = 6 + Math.random() * 8;
  const drift = (Math.random() - 0.5) * 80;

  useEffect(() => {
    const anim = Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 500,
          duration: 2000 + Math.random() * 1000,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: drift,
          duration: 2000 + Math.random() * 1000,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.delay(1400),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(rotate, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    ]);
    anim.start();
    return () => anim.stop();
  }, []);

  const spin = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "720deg"],
  });

  return (
    <Animated.View
      style={{
        position: "absolute",
        top: 0,
        left: x,
        width: size,
        height: size,
        borderRadius: Math.random() > 0.5 ? size / 2 : 2,
        backgroundColor: color,
        transform: [{ translateY }, { translateX }, { rotate: spin }],
        opacity,
      }}
    />
  );
}

function ConfettiBurst() {
  const particles = Array.from({ length: 28 }, (_, i) => ({
    id: i,
    x: Math.random() * SCREEN_W,
    delay: Math.random() * 400,
  }));

  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 400,
        pointerEvents: "none",
      }}
    >
      {particles.map((p) => (
        <ConfettiParticle key={p.id} x={p.x} delay={p.delay} />
      ))}
    </View>
  );
}

// ─── Check icon animation ─────────────────────────────────────────────────────

function AnimatedCheck() {
  const scale = useRef(new Animated.Value(0)).current;
  const ring = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(200),
      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(ring, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(ring, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const ringScale = ring.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.5],
  });
  const ringOpacity = ring.interpolate({
    inputRange: [0, 0.6, 1],
    outputRange: [0.5, 0.2, 0],
  });

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        height: 120,
        marginBottom: 4,
      }}
    >
      {/* Pulsing ring */}
      <Animated.View
        style={{
          position: "absolute",
          width: 96,
          height: 96,
          borderRadius: 48,
          borderWidth: 3,
          borderColor: "#22C55E",
          transform: [{ scale: ringScale }],
          opacity: ringOpacity,
        }}
      />
      {/* Icon circle */}
      <Animated.View
        style={{
          width: 88,
          height: 88,
          borderRadius: 44,
          backgroundColor: "#16A34A",
          alignItems: "center",
          justifyContent: "center",
          transform: [{ scale }],
          shadowColor: "#16A34A",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.4,
          shadowRadius: 16,
          elevation: 8,
        }}
      >
        <Text style={{ fontSize: 40 }}>✓</Text>
      </Animated.View>
    </View>
  );
}

// ─── Slide-up card animation ──────────────────────────────────────────────────

function SlideCard({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const translateY = useRef(new Animated.Value(40)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ transform: [{ translateY }], opacity }}>
      {children}
    </Animated.View>
  );
}

// ─── Proof detail row ─────────────────────────────────────────────────────────

function ProofRow({
  icon,
  label,
  value,
  valueColor,
}: {
  icon: string;
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#F3F4F6",
      }}
    >
      <Text style={{ fontSize: 16, marginRight: 12, width: 24 }}>{icon}</Text>
      <Text style={{ fontSize: 13, color: "#6B7280", flex: 1 }}>{label}</Text>
      <Text
        style={{
          fontSize: 13,
          fontWeight: "600",
          color: valueColor ?? "#111827",
          maxWidth: 180,
          textAlign: "right",
        }}
        numberOfLines={1}
      >
        {value}
      </Text>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function CheckInSuccessScreen() {
  const insets = useSafeAreaInsets();
  const todayRecord = useSelector(selectTodayRecord);
  const selfieUri = useSelector(selectSelfieUri);

  // Fallback for demo if accessed directly
  const checkInTime =
    todayRecord?.checkInTime ??
    new Date().toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  const siteName = todayRecord?.siteName ?? DEMO_WORKER.siteName;
  const lat = todayRecord?.checkInGps?.latitude ?? 19.076;
  const lng = todayRecord?.checkInGps?.longitude ?? 72.8777;
  const faceScore = todayRecord?.faceMatchScore ?? 94;
  const isLate = todayRecord?.isLate ?? false;
  const lateBy = todayRecord?.lateByMinutes ?? 0;
  const dateStr =
    todayRecord?.date ??
    new Date().toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  const statusLabel = isLate ? "Late check-in" : "On time";
  const statusColor = isLate ? "#D97706" : "#16A34A";

  const handleDone = () => {
    router.replace("/(tabs)");
  };

  const handleViewAttendance = () => {
    router.replace("/(tabs)/attendance");
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      <ConfettiBurst />

      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 24,
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 100,
          alignItems: "center",
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Animated check icon */}
        <AnimatedCheck />

        {/* Heading */}
        <SlideCard delay={300}>
          <Text
            style={{
              fontSize: 26,
              fontWeight: "800",
              color: "#111827",
              textAlign: "center",
              marginBottom: 6,
            }}
          >
            Attendance marked!
          </Text>
          <Text
            style={{
              fontSize: 15,
              color: "#6B7280",
              textAlign: "center",
              marginBottom: 6,
            }}
          >
            {dateStr}
          </Text>
          <View style={{ alignItems: "center", marginBottom: 28 }}>
            <View
              style={{
                backgroundColor: statusColor + "18",
                borderRadius: 20,
                paddingHorizontal: 16,
                paddingVertical: 6,
              }}
            >
              <Text
                style={{ fontSize: 13, color: statusColor, fontWeight: "700" }}
              >
                {isLate
                  ? `⏰ ${statusLabel} by ${lateBy} min`
                  : `✓ ${statusLabel}`}
              </Text>
            </View>
          </View>
        </SlideCard>

        {/* Selfie + time banner */}
        <SlideCard delay={450}>
          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 20,
              overflow: "hidden",
              width: SCREEN_W - 40,
              marginBottom: 14,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.08,
              shadowRadius: 12,
              elevation: 4,
            }}
          >
            {/* Selfie */}
            <View
              style={{
                height: 200,
                backgroundColor: "#E5E7EB",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {selfieUri ? (
                <Image
                  source={{ uri: selfieUri }}
                  style={{ width: "100%", height: 200 }}
                  contentFit="cover"
                />
              ) : (
                <Text style={{ fontSize: 64 }}>🤳</Text>
              )}
              {/* Overlay badge */}
              <View
                style={{
                  position: "absolute",
                  bottom: 12,
                  left: 12,
                  backgroundColor: "#00000088",
                  borderRadius: 10,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                }}
              >
                <Text
                  style={{ color: "#FFFFFF", fontSize: 13, fontWeight: "700" }}
                >
                  {checkInTime}
                </Text>
                <Text style={{ color: "#94A3B8", fontSize: 10 }}>
                  Check-in selfie
                </Text>
              </View>
            </View>

            {/* Time hero */}
            <View
              style={{
                paddingVertical: 20,
                alignItems: "center",
                borderBottomWidth: 1,
                borderBottomColor: "#F3F4F6",
              }}
            >
              <Text style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 4 }}>
                Check-in time
              </Text>
              <Text
                style={{ fontSize: 40, fontWeight: "800", color: "#111827" }}
              >
                {checkInTime}
              </Text>
            </View>

            {/* Proof rows */}
            <View style={{ padding: 16 }}>
              <ProofRow icon="🏗️" label="Site" value={siteName} />
              <ProofRow
                icon="📍"
                label="GPS"
                value={`${lat.toFixed(5)}°N  ${lng.toFixed(5)}°E`}
              />
              <ProofRow
                icon="🤖"
                label="Face match"
                value={`${faceScore}% confidence`}
                valueColor="#16A34A"
              />
              <ProofRow
                icon="📱"
                label="Device"
                value={`${DEMO_WORKER.deviceModel}`}
              />
              <ProofRow
                icon="🛡️"
                label="Mock GPS"
                value="Not detected"
                valueColor="#16A34A"
              />
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 10,
                }}
              >
                <Text style={{ fontSize: 16, marginRight: 12, width: 24 }}>
                  ☁️
                </Text>
                <Text style={{ fontSize: 13, color: "#6B7280", flex: 1 }}>
                  Sync status
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#F0FDF4",
                    borderRadius: 20,
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                  }}
                >
                  <View
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: "#22C55E",
                      marginRight: 5,
                    }}
                  />
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#16A34A",
                      fontWeight: "600",
                    }}
                  >
                    Synced
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </SlideCard>

        {/* Shift info */}
        <SlideCard delay={600}>
          <View
            style={{
              backgroundColor: "#1E3A5F",
              borderRadius: 16,
              padding: 16,
              width: SCREEN_W - 40,
              marginBottom: 14,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 11, color: "#64748B", marginBottom: 4 }}>
                SHIFT
              </Text>
              <Text
                style={{ fontSize: 14, color: "#CBD5E1", fontWeight: "600" }}
              >
                {DEMO_WORKER.shiftStart} – {DEMO_WORKER.shiftEnd}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 11, color: "#64748B", marginBottom: 4 }}>
                SUPERVISOR
              </Text>
              <Text
                style={{ fontSize: 14, color: "#CBD5E1", fontWeight: "600" }}
              >
                {DEMO_WORKER.supervisorName}
              </Text>
            </View>
          </View>
        </SlideCard>
      </ScrollView>

      {/* Fixed bottom buttons */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          paddingBottom: insets.bottom + 16,
          paddingTop: 16,
          paddingHorizontal: 20,
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#F3F4F6",
          flexDirection: "row",
          gap: 12,
        }}
      >
        <TouchableOpacity
          onPress={handleViewAttendance}
          style={{
            flex: 1,
            backgroundColor: "#F3F4F6",
            borderRadius: 14,
            paddingVertical: 15,
            alignItems: "center",
          }}
          activeOpacity={0.8}
        >
          <Text style={{ color: "#374151", fontSize: 14, fontWeight: "600" }}>
            View attendance
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleDone}
          style={{
            flex: 1,
            backgroundColor: "#1D4ED8",
            borderRadius: 14,
            paddingVertical: 15,
            alignItems: "center",
            shadowColor: "#1D4ED8",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 10,
            elevation: 4,
          }}
          activeOpacity={0.85}
        >
          <Text style={{ color: "#FFFFFF", fontSize: 14, fontWeight: "700" }}>
            Done →
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
