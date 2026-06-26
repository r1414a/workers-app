// import { Text, TouchableOpacity, View } from "react-native";

// export type FilterType = "today" | "week" | "month";

// interface Props {
//   selected: FilterType;
//   onChange: (value: FilterType) => void;
// }

// export default function AttendanceFilter({ selected, onChange }: Props) {
//   const filters: FilterType[] = ["today", "week", "month"];

//   return (
//     <View className="flex-row bg-slate-200 rounded-xl p-1 mb-5">
//       {filters.map((item) => {
//         const active = selected === item;

//         return (
//           <TouchableOpacity
//             key={item}
//             onPress={() => onChange(item)}
//             className={`flex-1 py-2 rounded-lg ${active ? "bg-white" : ""}`}
//           >
//             <Text
//               className={`text-center capitalize ${
//                 active ? "font-bold text-black" : "text-slate-500"
//               }`}
//             >
//               {item}
//             </Text>
//           </TouchableOpacity>
//         );
//       })}
//     </View>
//   );
// }

/**
 * components/history/AttendanceFilters.tsx
 */

import { Text, TouchableOpacity, View } from "react-native";

export type FilterType = "today" | "week" | "month";

const FILTERS: { key: FilterType; label: string; icon: string }[] = [
  { key: "today", label: "Today", icon: "📅" },
  { key: "week", label: "Week", icon: "📆" },
  { key: "month", label: "Month", icon: "🗓️" },
];

interface Props {
  selected: FilterType;
  onChange: (value: FilterType) => void;
}

export default function AttendanceFilter({ selected, onChange }: Props) {
  return (
    <View
      className="flex-row mb-5 rounded-2xl p-1.5"
      style={{
        backgroundColor: "#F1F5F9",
        borderWidth: 1,
        borderColor: "#E2E8F0",
      }}
    >
      {FILTERS.map(({ key, label, icon }) => {
        const active = selected === key;
        return (
          <TouchableOpacity
            key={key}
            onPress={() => onChange(key)}
            activeOpacity={0.75}
            className="flex-1 flex-row items-center justify-center gap-1.5 py-2.5 rounded-xl"
            style={
              active
                ? {
                    backgroundColor: "#f5b041",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 2,
                  }
                : {}
            }
          >
            {/* <Text style={{ fontSize: 12 }}>{icon}</Text> */}
            <Text
              className={`text-sm ${active ? "font-bold text-white" : "font-semibold text-maroon"}`}
              //   style={{
              //     fontSize: 13,
              //     fontWeight: active ? "700" : "500",
              //     color: active ? "#FFFFFF" : "#64748B",
              //   }}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
