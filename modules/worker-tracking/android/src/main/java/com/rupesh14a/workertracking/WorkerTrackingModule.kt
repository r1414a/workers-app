package com.rupesh14a.workertracking

import android.content.Context
import expo.modules.kotlin.exception.Exceptions
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import android.util.Log

class WorkerTrackingModule : Module() {
  private val context: Context
    get() = appContext.reactContext ?: throw Exceptions.ReactContextLost()

  override fun definition() = ModuleDefinition {
    Name("WorkerTracking")

    AsyncFunction("startTracking") { options: Map<String, Any?> ->
      Log.d("WorkerTracking", "startTracking called")
    Log.d("WorkerTracking", options.toString())
      
      val workerId = options["workerId"] as? String
        ?: throw IllegalArgumentException("workerId is required")
      val siteId = options["siteId"] as? String
        ?: throw IllegalArgumentException("siteId is required")
      val token = options["token"] as? String
        ?: throw IllegalArgumentException("token is required")
      val apiBaseUrl = options["apiBaseUrl"] as? String
        ?: throw IllegalArgumentException("apiBaseUrl is required")
      val shiftStart = options["shiftStart"] as? String
        ?: throw IllegalArgumentException("shiftStart is required")
      val shiftEnd = options["shiftEnd"] as? String
        ?: throw IllegalArgumentException("shiftEnd is required")
      val deviceToken = options["deviceToken"] as? String ?: ""

      val session = TrackingSession(
        workerId = workerId,
        siteId = siteId,
        token = token,
        apiBaseUrl = apiBaseUrl,
        shiftStart = shiftStart,
        shiftEnd = shiftEnd,
        deviceToken = deviceToken,
        trackingEnabled = true,
      )

      WorkerTrackingForegroundService.start(context, session)
    }

    AsyncFunction("stopTracking") {
      WorkerTrackingForegroundService.stop(context)
    }

    AsyncFunction("isTracking") {
      WorkerTrackingForegroundService.isRunning ||
        (TrackingSessionStore.load(context)?.trackingEnabled == true)
    }
  }
}
