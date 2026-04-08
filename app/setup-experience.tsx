import { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, SafeAreaView, Animated,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const PINK = '#c4185c';
const BG = '#130008';

const OPTIONS = [
  { key: 'beginner',     label: 'Beginner',     emoji: '🌱' },
  { key: 'intermediate', label: 'Intermediate', emoji: '🌿' },
  { key: 'advanced',     label: 'Advanced',     emoji: '🪴' },
  { key: 'expert',       label: 'Expert',       emoji: '🌳' },
];

export default function SetupExperience() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const toastAnim = useRef(new Animated.Value(40)).current;
  const toastOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(toastAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
      Animated.timing(toastOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start(() => {
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(toastAnim, { toValue: 40, duration: 250, useNativeDriver: true }),
          Animated.timing(toastOpacity, { toValue: 0, duration: 250, useNativeDriver: true }),
        ]).start();
      }, 3000);
    });
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.step}>1 of 6</Text>
      </View>

      <View style={styles.container}>
        <Text style={styles.title}>My experience level...</Text>
        <Text style={styles.subtitle}>Experience</Text>

        <View style={styles.grid}>
          {OPTIONS.map(opt => (
            <TouchableOpacity
              key={opt.key}
              style={[styles.card, selected === opt.key && styles.cardSelected]}
              activeOpacity={0.8}
              onPress={() => setSelected(opt.key)}
            >
              <Text style={styles.emoji}>{opt.emoji}</Text>
              <Text style={styles.cardLabel}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.btn, !selected && styles.btnMuted]}
          disabled={!selected}
          activeOpacity={0.85}
          onPress={() => router.push('/setup-format')}
        >
          <Text style={styles.btnText}>Continue</Text>
        </TouchableOpacity>
      </View>

      {/* Toast */}
      <Animated.View
        style={[
          styles.toast,
          { transform: [{ translateY: toastAnim }], opacity: toastOpacity },
        ]}
      >
        <Ionicons name="checkmark-circle" size={18} color="#22c55e" />
        <Text style={styles.toastText}>Age verified successfully!</Text>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
  },
  step: { color: '#888', fontSize: 13 },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 16 },
  title: { color: '#fff', fontSize: 24, fontWeight: '700', marginBottom: 4 },
  subtitle: { color: '#888', fontSize: 13, marginBottom: 24 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    width: '47%',
    backgroundColor: '#17131a',
    borderRadius: 14,
    paddingVertical: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    gap: 10,
  },
  cardSelected: { borderColor: PINK, backgroundColor: '#5c1030' },
  emoji: { fontSize: 36 },
  cardLabel: { color: '#fff', fontSize: 15, fontWeight: '600' },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 12,
  },
  btn: {
    backgroundColor: PINK,
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
  },
  btnMuted: { backgroundColor: '#7a1040' },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 15 },
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
