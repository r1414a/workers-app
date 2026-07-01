package com.rupesh14a.workertracking

import android.content.Context
import androidx.security.crypto.EncryptedSharedPreferences
import androidx.security.crypto.MasterKey

data class TrackingSession(
  val workerId: String,
  val siteId: String,
  val token: String,
  val apiBaseUrl: String,
  val shiftStart: String,
  val shiftEnd: String,
  val deviceToken: String,
  val trackingEnabled: Boolean = true,
)

object TrackingSessionStore {
  private const val PREFS_NAME = "worker_tracking_secure"

  private const val KEY_WORKER_ID = "worker_id"
  private const val KEY_SITE_ID = "site_id"
  private const val KEY_TOKEN = "token"
  private const val KEY_API_BASE_URL = "api_base_url"
  private const val KEY_SHIFT_START = "shift_start"
  private const val KEY_SHIFT_END = "shift_end"
  private const val KEY_DEVICE_TOKEN = "device_token"
  private const val KEY_TRACKING_ENABLED = "tracking_enabled"

  private fun prefs(context: Context) =
    EncryptedSharedPreferences.create(
      context,
      PREFS_NAME,
      MasterKey.Builder(context)
        .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
        .build(),
      EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
      EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM,
    )

  fun save(context: Context, session: TrackingSession) {
    prefs(context).edit()
      .putString(KEY_WORKER_ID, session.workerId)
      .putString(KEY_SITE_ID, session.siteId)
      .putString(KEY_TOKEN, session.token)
      .putString(KEY_API_BASE_URL, session.apiBaseUrl)
      .putString(KEY_SHIFT_START, session.shiftStart)
      .putString(KEY_SHIFT_END, session.shiftEnd)
      .putString(KEY_DEVICE_TOKEN, session.deviceToken)
      .putBoolean(KEY_TRACKING_ENABLED, session.trackingEnabled)
      .apply()
  }

  fun load(context: Context): TrackingSession? {
    val store = prefs(context)
    val workerId = store.getString(KEY_WORKER_ID, null) ?: return null
    val siteId = store.getString(KEY_SITE_ID, null) ?: return null
    val token = store.getString(KEY_TOKEN, null) ?: return null
    val apiBaseUrl = store.getString(KEY_API_BASE_URL, null) ?: return null
    val shiftStart = store.getString(KEY_SHIFT_START, null) ?: return null
    val shiftEnd = store.getString(KEY_SHIFT_END, null) ?: return null

    return TrackingSession(
      workerId = workerId,
      siteId = siteId,
      token = token,
      apiBaseUrl = apiBaseUrl,
      shiftStart = shiftStart,
      shiftEnd = shiftEnd,
      deviceToken = store.getString(KEY_DEVICE_TOKEN, "") ?: "",
      trackingEnabled = store.getBoolean(KEY_TRACKING_ENABLED, false),
    )
  }

  fun clear(context: Context) {
    prefs(context).edit().clear().apply()
  }

  fun setTrackingEnabled(context: Context, enabled: Boolean) {
    prefs(context).edit().putBoolean(KEY_TRACKING_ENABLED, enabled).apply()
  }
}
