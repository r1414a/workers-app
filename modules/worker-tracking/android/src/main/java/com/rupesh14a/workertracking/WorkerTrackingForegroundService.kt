package com.rupesh14a.workertracking

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.content.pm.ServiceInfo
import android.os.Build
import android.os.IBinder
import android.util.Log
import com.google.android.gms.location.LocationCallback
import com.google.android.gms.location.LocationRequest
import com.google.android.gms.location.LocationResult
import com.google.android.gms.location.LocationServices
import com.google.android.gms.location.Priority

class WorkerTrackingForegroundService : Service() {
  private val fusedClient by lazy { LocationServices.getFusedLocationProviderClient(this) }
  private var session: TrackingSession? = null

  private val locationCallback = object : LocationCallback() {
    override fun onLocationResult(result: LocationResult) {
      val activeSession = session ?: return
      val location = result.lastLocation ?: return

      if (!ShiftUtils.isWithinShift(activeSession.shiftStart, activeSession.shiftEnd)) {
        Log.i(TAG, "Outside shift window, stopping tracking")
        stopTrackingInternal()
        stopSelf()
        return
      }

      LocationUploadClient.upload(activeSession, location)
    }
  }

  override fun onBind(intent: Intent?): IBinder? = null

  override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
    Log.d("WorkerTracking", "Service started")
    
    when (intent?.action) {
      ACTION_STOP -> {
        stopTrackingInternal()
        stopSelf()
        return START_NOT_STICKY
      }

      ACTION_START, null -> {
        val nextSession = intent?.let { readSessionFromIntent(it) }
          ?: TrackingSessionStore.load(this)

        if (nextSession == null || !nextSession.trackingEnabled) {
          stopTrackingInternal()
          stopSelf()
          return START_NOT_STICKY
        }

        if (!ShiftUtils.isWithinShift(nextSession.shiftStart, nextSession.shiftEnd)) {
          TrackingSessionStore.save(this, nextSession.copy(trackingEnabled = false))
          stopTrackingInternal()
          stopSelf()
          return START_NOT_STICKY
        }

        session = nextSession
        TrackingSessionStore.save(this, nextSession.copy(trackingEnabled = true))
        startForegroundInternal()
        requestLocationUpdates()
        isRunning = true
        return START_STICKY
      }

      else -> return START_NOT_STICKY
    }
  }

  override fun onDestroy() {
    stopTrackingInternal()
    super.onDestroy()
  }

  private fun startForegroundInternal() {
    createNotificationChannel()

    val launchIntent = packageManager.getLaunchIntentForPackage(packageName)
    val pendingIntent = PendingIntent.getActivity(
      this,
      0,
      launchIntent,
      PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
    )

    val notification = Notification.Builder(this, CHANNEL_ID)
      .setContentTitle("Iravya Attendance")
      .setContentText("Tracking your location during shift")
      .setSmallIcon(applicationInfo.icon)
      .setOngoing(true)
      .setContentIntent(pendingIntent)
      .setColor(0xFF701A40.toInt())
      .build()

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
      startForeground(
        NOTIFICATION_ID,
        notification,
        ServiceInfo.FOREGROUND_SERVICE_TYPE_LOCATION,
      )
    } else {
      startForeground(NOTIFICATION_ID, notification)
    }
  }

  private fun requestLocationUpdates() {
     Log.d(TAG, "Requesting location updates")
    val request = LocationRequest.Builder(Priority.PRIORITY_HIGH_ACCURACY, UPDATE_INTERVAL_MS)
      .setMinUpdateIntervalMillis(FASTEST_INTERVAL_MS)
      .setMinUpdateDistanceMeters(MIN_DISTANCE_METERS)
      .setWaitForAccurateLocation(false)
      .build()

    try {
      fusedClient.requestLocationUpdates(request, locationCallback, mainLooper)
       Log.d(TAG, "requestLocationUpdates() registered")
    } catch (error: SecurityException) {
      Log.e(TAG, "Missing location permission", error)
      stopTrackingInternal()
      stopSelf()
    }
  }

  private fun stopTrackingInternal() {
    fusedClient.removeLocationUpdates(locationCallback)
    session = null
    isRunning = false
    TrackingSessionStore.setTrackingEnabled(this, false)
  }

  private fun createNotificationChannel() {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return

    val channel = NotificationChannel(
      CHANNEL_ID,
      "Shift location tracking",
      NotificationManager.IMPORTANCE_LOW,
    ).apply {
      description = "Shows when location is tracked during your shift"
      setShowBadge(false)
    }

    val manager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
    manager.createNotificationChannel(channel)
  }

  private fun readSessionFromIntent(intent: Intent): TrackingSession? {
    val workerId = intent.getStringExtra(EXTRA_WORKER_ID) ?: return null
    val siteId = intent.getStringExtra(EXTRA_SITE_ID) ?: return null
    val token = intent.getStringExtra(EXTRA_TOKEN) ?: return null
    val apiBaseUrl = intent.getStringExtra(EXTRA_API_BASE_URL) ?: return null
    val shiftStart = intent.getStringExtra(EXTRA_SHIFT_START) ?: return null
    val shiftEnd = intent.getStringExtra(EXTRA_SHIFT_END) ?: return null

    return TrackingSession(
      workerId = workerId,
      siteId = siteId,
      token = token,
      apiBaseUrl = apiBaseUrl,
      shiftStart = shiftStart,
      shiftEnd = shiftEnd,
      deviceToken = intent.getStringExtra(EXTRA_DEVICE_TOKEN) ?: "",
      trackingEnabled = true,
    )
  }

  companion object {
    private const val TAG = "WorkerTrackingService"
    const val ACTION_START = "com.rupesh14a.workertracking.action.START"
    const val ACTION_STOP = "com.rupesh14a.workertracking.action.STOP"

    const val EXTRA_WORKER_ID = "worker_id"
    const val EXTRA_SITE_ID = "site_id"
    const val EXTRA_TOKEN = "token"
    const val EXTRA_API_BASE_URL = "api_base_url"
    const val EXTRA_SHIFT_START = "shift_start"
    const val EXTRA_SHIFT_END = "shift_end"
    const val EXTRA_DEVICE_TOKEN = "device_token"

    private const val CHANNEL_ID = "worker_tracking"
    private const val NOTIFICATION_ID = 41001
    // private const val UPDATE_INTERVAL_MS = 30_000L
    // private const val FASTEST_INTERVAL_MS = 15_000L
    private const val UPDATE_INTERVAL_MS = 5000L
    private const val FASTEST_INTERVAL_MS = 2000L
    // private const val MIN_DISTANCE_METERS = 25f
    private const val MIN_DISTANCE_METERS = 0f

    @Volatile
    var isRunning: Boolean = false
      private set

    fun start(context: Context, session: TrackingSession) {
      TrackingSessionStore.save(context, session.copy(trackingEnabled = true))

      val intent = Intent(context, WorkerTrackingForegroundService::class.java).apply {
        action = ACTION_START
        putExtra(EXTRA_WORKER_ID, session.workerId)
        putExtra(EXTRA_SITE_ID, session.siteId)
        putExtra(EXTRA_TOKEN, session.token)
        putExtra(EXTRA_API_BASE_URL, session.apiBaseUrl)
        putExtra(EXTRA_SHIFT_START, session.shiftStart)
        putExtra(EXTRA_SHIFT_END, session.shiftEnd)
        putExtra(EXTRA_DEVICE_TOKEN, session.deviceToken)
      }

      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        context.startForegroundService(intent)
      } else {
        context.startService(intent)
      }
    }

    fun stop(context: Context) {
      TrackingSessionStore.clear(context)

      val intent = Intent(context, WorkerTrackingForegroundService::class.java).apply {
        action = ACTION_STOP
      }
      context.startService(intent)
    }
  }
}
