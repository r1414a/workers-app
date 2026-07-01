package com.rupesh14a.workertracking

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.util.Log

class BootReceiver : BroadcastReceiver() {
  override fun onReceive(context: Context, intent: Intent?) {
    val action = intent?.action ?: return
    if (
      action != Intent.ACTION_BOOT_COMPLETED &&
      action != "android.intent.action.QUICKBOOT_POWERON"
    ) {
      return
    }

    val session = TrackingSessionStore.load(context) ?: return
    if (!session.trackingEnabled) return

    if (!ShiftUtils.isWithinShift(session.shiftStart, session.shiftEnd)) {
      Log.i(TAG, "Boot complete but outside shift, not restarting tracking")
      return
    }

    Log.i(TAG, "Restarting worker tracking after boot")
    WorkerTrackingForegroundService.start(context, session)
  }

  companion object {
    private const val TAG = "WorkerTrackingBoot"
  }
}
