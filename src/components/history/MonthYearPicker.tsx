import { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

interface Props {
  visible: boolean;
  year: number;
  month: number;
  minYear?: number;
  maxYear?: number;
  onClose: () => void;
  onApply: (year: number, month: number) => void;
}

export default function MonthYearPicker({
  visible,
  year,
  month,
  minYear,
  maxYear,
  onClose,
  onApply,
}: Props) {
  const today = new Date();
  const resolvedMaxYear = maxYear ?? today.getFullYear();
  const resolvedMinYear = minYear ?? resolvedMaxYear - 5;

  const [draftYear, setDraftYear] = useState(year);
  const [draftMonth, setDraftMonth] = useState(month);

  useEffect(() => {
    if (!visible) return;
    setDraftYear(year);
    setDraftMonth(month);
  }, [visible, year, month]);

  const years = Array.from(
    { length: resolvedMaxYear - resolvedMinYear + 1 },
    (_, i) => resolvedMaxYear - i,
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 justify-end"
        style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
        onPress={onClose}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={{
            backgroundColor: "#fff",
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: 28,
          }}
        >
          <View
            style={{
              width: 40,
              height: 4,
              borderRadius: 2,
              backgroundColor: "#E2E8F0",
              alignSelf: "center",
              marginBottom: 16,
            }}
          />

          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: "#701a40",
              marginBottom: 16,
              textAlign: "center",
            }}
          >
            Select month & year
          </Text>

          <View style={{ flexDirection: "row", gap: 12, height: 220 }}>
            <ScrollView
              style={{ flex: 1 }}
              showsVerticalScrollIndicator={false}
            >
              {MONTH_NAMES.map((name, index) => {
                const selected = draftMonth === index;
                const isFutureMonth =
                  draftYear > today.getFullYear() ||
                  (draftYear === today.getFullYear() &&
                    index > today.getMonth());

                return (
                  <TouchableOpacity
                    key={name}
                    disabled={isFutureMonth}
                    onPress={() => setDraftMonth(index)}
                    style={{
                      paddingVertical: 10,
                      paddingHorizontal: 12,
                      borderRadius: 12,
                      marginBottom: 4,
                      backgroundColor: selected ? "#701a40" : "transparent",
                      opacity: isFutureMonth ? 0.35 : 1,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: selected ? "700" : "500",
                        color: selected ? "#fff" : "#444",
                        textAlign: "center",
                      }}
                    >
                      {name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <ScrollView
              style={{ flex: 0.55 }}
              showsVerticalScrollIndicator={false}
            >
              {years.map((y) => {
                const selected = draftYear === y;
                return (
                  <TouchableOpacity
                    key={y}
                    onPress={() => {
                      setDraftYear(y);
                      if (
                        y === today.getFullYear() &&
                        draftMonth > today.getMonth()
                      ) {
                        setDraftMonth(today.getMonth());
                      }
                    }}
                    style={{
                      paddingVertical: 10,
                      paddingHorizontal: 12,
                      borderRadius: 12,
                      marginBottom: 4,
                      backgroundColor: selected ? "#701a40" : "transparent",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: selected ? "700" : "500",
                        color: selected ? "#fff" : "#444",
                        textAlign: "center",
                      }}
                    >
                      {y}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          <View style={{ flexDirection: "row", gap: 10, marginTop: 16 }}>
            <TouchableOpacity
              onPress={onClose}
              style={{
                flex: 1,
                paddingVertical: 14,
                borderRadius: 14,
                backgroundColor: "#F1F5F9",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#64748B", fontWeight: "600" }}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                onApply(draftYear, draftMonth);
                onClose();
              }}
              style={{
                flex: 1,
                paddingVertical: 14,
                borderRadius: 14,
                backgroundColor: "#701a40",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "700" }}>Apply</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
