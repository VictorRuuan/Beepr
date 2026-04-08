import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { router } from 'expo-router';

// ─── Notification display behaviour (runs before any UI renders) ──────────────
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// ─── Types ────────────────────────────────────────────────────────────────────
export interface PushNotificationData {
  screen?: string;   // e.g. "/product/abc-123"
  type?: 'product_match' | 'deal_alert' | 'order_update' | 'new_product';
  payload?: Record<string, string>;
}

// ─── Register for push token ──────────────────────────────────────────────────
export async function registerForPushNotifications(): Promise<string | null> {
  if (!Device.isDevice) {
    console.warn('[PushNotifications] Must use a physical device for push tokens.');
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.warn('[PushNotifications] Permission not granted.');
    return null;
  }

  // Android requires a notification channel
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Beepr Alerts',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#c4185c',
      sound: 'default',
    });

    await Notifications.setNotificationChannelAsync('deals', {
      name: 'Deal Alerts',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#c4185c',
      sound: 'default',
    });

    await Notifications.setNotificationChannelAsync('orders', {
      name: 'Order Updates',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 500, 250, 500],
      lightColor: '#c4185c',
      sound: 'default',
    });
  }

  try {
    const tokenData = await Notifications.getExpoPushTokenAsync();
    return tokenData.data;
  } catch (e) {
    console.error('[PushNotifications] Failed to get push token:', e);
    return null;
  }
}

// ─── Deep-link handler (notification tap → route) ────────────────────────────
export function handleNotificationResponse(
  response: Notifications.NotificationResponse,
): void {
  const data = response.notification.request.content.data as PushNotificationData;
  if (!data?.screen) return;

  // Wait one tick so the navigator is mounted
  setTimeout(() => {
    router.push(data.screen as any);
  }, 100);
}

// ─── Deep link map ────────────────────────────────────────────────────────────
// Notification type  →  Expo Router path
// product_match      →  /product/[id]
// deal_alert         →  /deals/[id]
// order_update       →  /orders/[id]
// new_product        →  /product/[id]
//
// To trigger a deep link externally:
//   beepr://product/abc-123
//   beepr://deals/xyz-456
//   https://beepr.com.br/product/abc-123  (universal link)
