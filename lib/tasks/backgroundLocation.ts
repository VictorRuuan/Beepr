import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

export const BACKGROUND_LOCATION_TASK = 'beepr-background-location';

export interface LocationTaskData {
  locations: Location.LocationObject[];
}

/**
 * Defines the background location task.
 * This must be called at the TOP LEVEL of the app (before any component mounts),
 * which is why it lives in its own file imported from index.js / _layout.tsx.
 */
TaskManager.defineTask(BACKGROUND_LOCATION_TASK, ({ data, error }) => {
  if (error) {
    console.error('[BackgroundLocation] Task error:', error.message);
    return;
  }
  if (data) {
    const { locations } = data as LocationTaskData;
    const latest = locations[locations.length - 1];
    if (!latest) return;

    // TODO: send to Supabase / trigger geofence check
    // e.g.: supabase.functions.invoke('verify-location', { body: { lat, lng } })
    console.log('[BackgroundLocation] New position:', {
      lat: latest.coords.latitude,
      lng: latest.coords.longitude,
      accuracy: latest.coords.accuracy,
      timestamp: new Date(latest.timestamp).toISOString(),
    });
  }
});

/** Requests foreground + background location permissions */
export async function requestLocationPermissions(): Promise<boolean> {
  const { status: fgStatus } = await Location.requestForegroundPermissionsAsync();
  if (fgStatus !== 'granted') return false;

  const { status: bgStatus } = await Location.requestBackgroundPermissionsAsync();
  return bgStatus === 'granted';
}

/** Starts the persistent background location task */
export async function startBackgroundLocation(): Promise<void> {
  const isRunning = await Location.hasStartedLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);
  if (isRunning) return;

  await Location.startLocationUpdatesAsync(BACKGROUND_LOCATION_TASK, {
    accuracy: Location.Accuracy.Balanced,
    timeInterval: 60_000,       // update every 60 seconds
    distanceInterval: 50,        // or every 50 meters — whichever comes first
    deferredUpdatesInterval: 60_000,
    deferredUpdatesDistance: 50,
    showsBackgroundLocationIndicator: true, // iOS – blue status bar pill
    foregroundService: {
      // Android – persistent notification required by OS
      notificationTitle: 'Beepr está ativo',
      notificationBody: 'Monitorando dispensaries próximas...',
      notificationColor: '#c4185c',
    },
    pausesUpdatesAutomatically: false,
  });
}

/** Stops background tracking (call on logout / permission revoke) */
export async function stopBackgroundLocation(): Promise<void> {
  const isRunning = await Location.hasStartedLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);
  if (isRunning) {
    await Location.stopLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);
  }
}
