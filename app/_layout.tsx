import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { supabase } from '../lib/supabase';

// Background task must be imported at the top level so TaskManager registers it
// before any component renders - this is a Expo requirement.
import '../lib/tasks/backgroundLocation';
import {
  registerForPushNotifications,
  handleNotificationResponse,
} from '../lib/push-notifications';

async function savePushToken(token: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase
    .from('user_push_tokens')
    .upsert(
      {
        user_id: user.id,
        token,
        platform: Platform.OS,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'user_id,token',
        ignoreDuplicates: false,
      },
    );

  if (error) {
    console.error('[PushNotifications] Failed to save token:', error.message);
  } else {
    console.log('[PushNotifications] Token saved for user:', user.id);
  }
}

// Screens that do not require authentication
const PUBLIC_ROUTES = ['index', 'register', 'login', 'verify', 'create-password', 'onboarding'];

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const notificationListener = useRef<Notifications.EventSubscription | null>(null);
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // Only redirect on explicit sign-in, never on session restore at app load
      if (event !== 'SIGNED_IN') return;

      const currentRoute = segments[segments.length - 1] ?? 'index';

      // Only redirect from the welcome screen or login — registration flow
      // screens (create-password, verify) handle their own navigation after signUp
      const REDIRECT_ROUTES = ['index', 'login'];
      if (session && REDIRECT_ROUTES.includes(currentRoute)) {
        router.replace('/setup-complete');
      }
    });

    return () => subscription.unsubscribe();
  }, [segments]);

  useEffect(() => {
    registerForPushNotifications().then((token) => {
      if (token) savePushToken(token);
    });

    notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log('[PushNotifications] Received in foreground:', notification);
      },
    );

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