const { withAndroidManifest } = require("@expo/config-plugins");

const PERMISSIONS = [
  "android.permission.ACCESS_FINE_LOCATION",
  "android.permission.ACCESS_COARSE_LOCATION",
  "android.permission.ACCESS_BACKGROUND_LOCATION",
  "android.permission.FOREGROUND_SERVICE",
  "android.permission.FOREGROUND_SERVICE_LOCATION",
  "android.permission.POST_NOTIFICATIONS",
  "android.permission.RECEIVE_BOOT_COMPLETED",
];

function addPermissions(androidManifest) {
  const manifest = androidManifest.manifest;
  if (!manifest["uses-permission"]) {
    manifest["uses-permission"] = [];
  }

  const existing = new Set(
    manifest["uses-permission"].map((item) => item.$["android:name"]),
  );

  for (const permission of PERMISSIONS) {
    if (!existing.has(permission)) {
      manifest["uses-permission"].push({
        $: { "android:name": permission },
      });
    }
  }

  return androidManifest;
}

function withWorkerTracking(config) {
  return withAndroidManifest(config, (config) => {
    config.modResults = addPermissions(config.modResults);
    return config;
  });
}

module.exports = withWorkerTracking;
