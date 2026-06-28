export function extractTimeToday(isoTime: string, reference = new Date()): Date {
  const source = new Date(isoTime);
  const result = new Date(reference);
  result.setHours(source.getHours(), source.getMinutes(), source.getSeconds(), 0);
  return result;
}

export function isWithinShift(
  startTime: string,
  endTime: string,
  now = new Date(),
): boolean {
  const start = extractTimeToday(startTime, now);
  const end = extractTimeToday(endTime, now);

  if (end <= start) {
    return now >= start || now <= end;
  }

  return now >= start && now <= end;
}

export function formatShiftTime(isoTime: string): string {
  return extractTimeToday(isoTime).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function msUntilShiftStart(
  startTime: string,
  now = new Date(),
): number {
  const start = extractTimeToday(startTime, now);
  const diff = start.getTime() - now.getTime();
  return diff > 0 ? diff : 0;
}

export function msUntilShiftEnd(endTime: string, now = new Date()): number {
  const end = extractTimeToday(endTime, now);
  const diff = end.getTime() - now.getTime();
  return diff > 0 ? diff : 0;
}
