import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import { Stack } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { supabase } from '../lib/supabase';

// Background task must be imported at the top level so TaskManager registers it
// before any component renders — this is a Expo requirement.
import '../lib/tasks/backgroundLocation';
import {
  registerForPushNotifications,
  handleNotificationResponse,
} from '../lib/push-notifications';

async function savePushToken(token: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return; // not authenticated yet — token will be saved on next login

  const { error } = await supabase
    .from('user_push_tokens')
    .upsert(
      {
        user_id: user.id,
        token,
        platform: Platform.OS, // 'ios' | 'android'
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'user_id,token', // unique constraint on the table
        ignoreDuplicates: false,
      },
    );

  if (error) {
    console.error('[PushNotifications] Failed to save token:', error.message);
  } else {
    console.log('[PushNotifications] Token saved for user:', user.id);
  }
}

export default function RootLayout() {
  const notificationListener = useRef<Notifications.EventSubscription>();
  const responseListener = useRef<Notifications.EventSubscription>();

  useEffect(() => {
    // Register device and persist Expo push token to user_push_tokens table
    registerForPushNotifications().then((token) => {
      if (token) savePushToken(token);
    });

    // Foreground notification listener
    notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log('[PushNotifications] Received in foreground:', notification);
      },
    );

    // Tap handler — deep links to the correct screen
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      handleNotificationResponse,
    );

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
