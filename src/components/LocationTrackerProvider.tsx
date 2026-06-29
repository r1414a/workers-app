import { useLocationTracker } from "@/hooks/use-location-tracker";

export function LocationTrackerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useLocationTracker();
  return <>{children}</>;
}
