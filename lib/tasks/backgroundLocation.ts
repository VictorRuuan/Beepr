import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { supabase } from '../supabase';

export const BACKGROUND_LOCATION_TASK = 'beepr-background-location';

export interface LocationTaskData {
  locations: Location.LocationObject[];
}

async function getAuthenticatedUserId(): Promise<string | null> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session?.user?.id ?? null;
}

/**
 * Updates the location cache in notification_preferences.
 * This is the same table the Capacitor app uses — no schema changes needed.
 * The TTL is set by the existing location_cache_ttl_hours column (default: 4h).
 */
async function updateLocationCache(lat: number, lon: number): Promise<void> {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    console.warn('[BackgroundLocation] No authenticated session available for location sync.');
    return;
  }

  const { error } = await supabase
    .from('notification_preferences')
    .upsert(
      {
        user_id: userId,
        last_location_latitude: lat,
        last_location_longitude: lon,
        last_location_updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' },
    );

  if (error) {
    console.error('[BackgroundLocation] Failed to update location cache:', error.message);
  }
}

/**
 * Defines the background location task.
 * This must be called at the TOP LEVEL of the app (before any component mounts),
 * which is why it lives in its own file imported from index.js / _layout.tsx.
 */
TaskManager.defineTask(BACKGROUND_LOCATION_TASK, async ({ data, error }) => {
  if (error) {
    console.error('[BackgroundLocation] Task error:', error.message);
    return;
  }
  if (data) {
    const { locations } = data as LocationTaskData;
    const latest = locations[locations.length - 1];
    if (!latest) return;

    const { latitude, longitude } = latest.coords;

    // Persist to notification_preferences (same table as Capacitor app)
    await updateLocationCache(latitude, longitude);
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
