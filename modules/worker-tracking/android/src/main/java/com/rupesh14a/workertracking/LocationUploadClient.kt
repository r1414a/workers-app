package com.rupesh14a.workertracking

import android.location.Location
import android.os.Build
import android.util.Log
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL

object LocationUploadClient {
  private const val TAG = "WorkerTrackingUpload"

  fun upload(session: TrackingSession, location: Location) {
    val endpoint = session.apiBaseUrl.trimEnd('/') + "/worker/location"
    val connection = (URL(endpoint).openConnection() as HttpURLConnection).apply {
      requestMethod = "POST"
      connectTimeout = 15_000
      readTimeout = 15_000
      doOutput = true
      setRequestProperty("Content-Type", "application/json")
      setRequestProperty("Authorization", "Bearer ${session.token}")
    }

    val body = JSONObject().apply {
      put("workerId", session.workerId)
      put("siteId", session.siteId)
      put("latitude", location.latitude)
      put("longitude", location.longitude)
      put("timestamp", location.time)
      put("isMocked", isMockLocation(location))
      put("isVpn", false)
      put("gps", true)
      put("deviceToken", session.deviceToken)
    }

    try {
      connection.outputStream.use { stream ->
        stream.write(body.toString().toByteArray(Charsets.UTF_8))
      }

      val code = connection.responseCode
      if (code !in 200..299) {
        Log.w(TAG, "Upload failed with status $code")
      }
    } catch (error: Exception) {
      Log.e(TAG, "Upload error", error)
    } finally {
      connection.disconnect()
    }
  }

  private fun isMockLocation(location: Location): Boolean {
    return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
      location.isMock
    } else {
      @Suppress("DEPRECATION")
      location.isFromMockProvider
    }
  }
}
