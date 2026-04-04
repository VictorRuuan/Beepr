import { useState } from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, SafeAreaView, Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { requestLocationPermissions, startBackgroundLocation } from '../lib/tasks/backgroundLocation';
import { supabase } from '../lib/supabase';

const PINK = '#c4185c';
const BG = '#130008';

type Phase = 'idle' | 'verifying' | 'denied';

export default function SetupLocation() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('idle');

  const handleEnable = async () => {
    if (phase === 'verifying') return;
    setPhase('verifying');

    try {
      // 1. Solicita permissão foreground + background ao OS (iOS/Android)
      const granted = await requestLocationPermissions();

      if (!granted) {
        setPhase('denied');
        Alert.alert(
          'Location Required',
          'Beepr needs background location to find dispensaries near you. Please enable it in Settings.',
          [{ text: 'OK', onPress: () => setPhase('idle') }],
        );
        return;
      }

      // 2. Inicia o rastreamento persistente em background
      await startBackgroundLocation();

      // 3. Captura posição atual para o primeiro cache no Supabase
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = position.coords;

      // 4. Persiste na tabela notification_preferences (mesmo schema do app Capacitor)
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const user = session?.user;
      if (user) {
        const { error } = await supabase
          .from('notification_preferences')
          .upsert(
            {
              user_id: user.id,
              last_location_latitude: latitude,
              last_location_longitude: longitude,
              last_location_updated_at: new Date().toISOString(),
            },
            { onConflict: 'user_id' },
          );

        if (error) {
          throw new Error(error.message);
        }
      }

      router.push('/setup-analyzing');
    } catch (err) {
      console.error('[SetupLocation] Error:', err);
      setPhase('idle');
      Alert.alert('Error', 'Could not retrieve your location. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />

      <View style={styles.container}>
        {/* Pin icon */}
        <View style={styles.iconWrap}>
          <Ionicons name="location-outline" size={64} color={PINK} />
        </View>

        <Text style={styles.title}>Enable Location</Text>
        <Text style={styles.body}>
          Beepr needs your location to verify you're in a legal cannabis jurisdiction and show nearby dispensaries in your area.
        </Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.btn, phase !== 'idle' && styles.btnBusy]}
          activeOpacity={0.85}
          onPress={handleEnable}
          disabled={phase !== 'idle'}
        >
          <Text style={styles.btnText}>
            {phase === 'verifying' ? 'Verifying Location...' : 'Enable Location'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.legal}>
          We verify you're in a legal cannabis area for compliance purposes.
        </Text>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  iconWrap: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: PINK,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  title: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 14,
    textAlign: 'center',
  },
  body: {
    color: '#aaa',
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 12,
    gap: 14,
  },
  btn: {
    backgroundColor: PINK,
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
  },
  btnBusy: { backgroundColor: '#7a1040' },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  legal: {
    color: '#555',
    fontSize: 11,
    textAlign: 'center',
  },
});
