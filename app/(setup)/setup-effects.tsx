import { useState } from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';

const PINK = '#c4185c';
const BG = '#130008';

const OPTIONS = [
  { key: 'relaxation',  label: 'Relaxation',  emoji: '😌' },
  { key: 'energy',      label: 'Energy',      emoji: '⚡' },
  { key: 'focus',       label: 'Focus',       emoji: '🎯' },
  { key: 'pain-relief', label: 'Pain Relief', emoji: '💊' },
  { key: 'sleep',       label: 'Sleep',       emoji: '😴' },
  { key: 'creativity',  label: 'Creativity',  emoji: '🎨' },
  { key: 'social',      label: 'Social',      emoji: '🎉' },
];

export default function SetupEffects() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (key: string) =>
    setSelected(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key],
    );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <View />
        <TouchableOpacity onPress={() => router.push('/setup-potency')}>
          <Text style={styles.skip}>Skip</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <Text style={styles.title}>The effects I want to feel...</Text>
        <Text style={styles.subtitle}>Effects</Text>

        <View style={styles.grid}>
          {OPTIONS.map(opt => (
            <TouchableOpacity
              key={opt.key}
              style={[
                styles.card,
                selected.includes(opt.key) && styles.cardSelected,
              ]}
              activeOpacity={0.75}
              onPress={() => toggle(opt.key)}
            >
              <Text style={styles.emoji}>{opt.emoji}</Text>
              <Text style={styles.cardLabel}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.btn, selected.length === 0 && styles.btnMuted]}
          disabled={selected.length === 0}
          activeOpacity={0.85}
          onPress={() => router.push('/setup-potency')}
        >
          <Text style={styles.btnText}>Continue</Text>
        </TouchableOpacity>
      </View>
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
  skip: { color: '#888', fontSize: 14, fontWeight: '500' },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 16 },
  title: { color: '#fff', fontSize: 24, fontWeight: '700', marginBottom: 4 },
  subtitle: { color: '#888', fontSize: 13, marginBottom: 24 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  card: {
    width: '22%',
    aspectRatio: 1,
    backgroundColor: '#1e0d14',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    gap: 4,
  },
  cardSelected: { borderColor: PINK },
  emoji: { fontSize: 26 },
  cardLabel: { color: '#fff', fontSize: 10, fontWeight: '600', textAlign: 'center' },
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
});
