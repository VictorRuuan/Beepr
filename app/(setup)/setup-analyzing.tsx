import { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Animated, Easing,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const PINK = '#c4185c';
const BG = '#130008';

export default function SetupAnalyzing() {
  const router = useRouter();
  const spin = useRef(new Animated.Value(0)).current;
  const toastAnim = useRef(new Animated.Value(40)).current;
  const toastOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Spin the arc indefinitely
    Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 900,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();

    // After a short delay show the toast
    const toastTimer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(toastAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.timing(toastOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start();
    }, 1200);

    // Navigate to the next step after analysis
    const navTimer = setTimeout(() => {
      router.replace('/setup-range');
    }, 3500);

    return () => {
      clearTimeout(toastTimer);
      clearTimeout(navTimer);
    };
  }, []);

  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Spinning arc */}
      <Animated.View style={[styles.spinner, { transform: [{ rotate }] }]} />

      <Text style={styles.label}>Analyzing your area...</Text>

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: 'transparent',
    borderTopColor: PINK,
    borderRightColor: `${PINK}44`,
    marginBottom: 20,
  },
  label: {
    color: '#888',
    fontSize: 15,
    fontWeight: '500',
  },
  toast: {
    position: 'absolute',
    bottom: 48,
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
