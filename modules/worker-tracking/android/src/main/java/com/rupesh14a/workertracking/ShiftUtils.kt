package com.rupesh14a.workertracking

import java.time.Instant
import java.time.OffsetDateTime
import java.time.ZoneId
import java.util.Calendar
import java.util.Date

object ShiftUtils {
  fun isWithinShift(shiftStart: String, shiftEnd: String, now: Date = Date()): Boolean {
    val start = extractTimeToday(shiftStart, now)
    val end = extractTimeToday(shiftEnd, now)

    if (end <= start) {
      return now >= start || now <= end
    }

    return now >= start && now <= end
  }

  private fun extractTimeToday(isoTime: String, reference: Date): Date {
    val source = parseInstant(isoTime).atZone(ZoneId.systemDefault())
    val calendar = Calendar.getInstance().apply {
      time = reference
      set(Calendar.HOUR_OF_DAY, source.hour)
      set(Calendar.MINUTE, source.minute)
      set(Calendar.SECOND, source.second)
      set(Calendar.MILLISECOND, 0)
    }
    return calendar.time
  }

  private fun parseInstant(isoTime: String): Instant {
    return try {
      Instant.parse(isoTime)
    } catch (_: Exception) {
      try {
        OffsetDateTime.parse(isoTime).toInstant()
      } catch (_: Exception) {
        Instant.parse("${isoTime.substring(0, 19)}Z")
      }
    }
  }
}
