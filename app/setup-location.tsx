import { useState, useRef } from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, SafeAreaView, Animated,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const PINK = '#c4185c';
const BG = '#130008';

type Phase = 'idle' | 'verifying';

export default function SetupLocation() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('idle');
  const toastAnim = useRef(new Animated.Value(40)).current;
  const toastOpacity = useRef(new Animated.Value(0)).current;

  const showToast = () => {
    toastAnim.setValue(40);
    toastOpacity.setValue(0);
    Animated.parallel([
      Animated.timing(toastAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
      Animated.timing(toastOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
  };

  const handleEnable = () => {
    if (phase === 'verifying') return;
    setPhase('verifying');
    showToast();
    // Simulate location + verification delay, then go to analyzing screen
    setTimeout(() => {
      router.push('/setup-analyzing');
    }, 2500);
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
          style={[styles.btn, phase === 'verifying' && styles.btnVerifying]}
          activeOpacity={0.85}
          onPress={handleEnable}
          disabled={phase === 'verifying'}
        >
          <Text style={styles.btnText}>
            {phase === 'verifying' ? 'Verifying Location...' : 'Enable Location'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.legal}>
          We verify you're in a legal cannabis area for compliance purposes.
        </Text>
      </View>

      {/* Toast */}
      <Animated.View
        style={[
          styles.toast,
          { transform: [{ translateY: toastAnim }], opacity: toastOpacity },
        ]}
      >
        <Ionicons name="checkmark-circle" size={18} color="#22c55e" />
        <Text style={styles.toastText}>Location verified! Loading your personalized feed...</Text>
      </Animated.View>
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
  btnVerifying: { backgroundColor: '#7a1040' },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  legal: {
    color: '#555',
    fontSize: 11,
    textAlign: 'center',
  },
  toast: {
    position: 'absolute',
    bottom: 110,
    left: 24,
    right: 24,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  toastText: { color: '#fff', fontSize: 13, fontWeight: '500' },
});
