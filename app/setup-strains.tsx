import { useState } from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';

const PINK = '#c4185c';
const BG = '#130008';
const CARD = '#17131a';
const OPTIONS = [
  {
    key: 'indica',
    label: 'Indica',
    tag: 'Relaxing',
    emoji: '🌙',
    circleBg: '#1a0d30',
  },
  {
    key: 'sativa',
    label: 'Sativa',
    tag: 'Energizing',
    emoji: '☀️',
    circleBg: '#2a1a00',
  },
  {
    key: 'indica-hybrid',
    label: 'Indica-Dominant Hybrid',
    tag: '',
    emoji: '🌙',
    circleBg: '#1a1a20',
  },
  {
    key: 'sativa-hybrid',
    label: 'Sativa-Dominant Hybrid',
    tag: '',
    emoji: '☀️',
    circleBg: '#1e1a10',
  },
  {
    key: 'balanced-hybrid',
    label: 'Balanced Hybrid',
    tag: 'Perfect Balance',
    emoji: '🌿',
    circleBg: '#0d1a10',
    fullWidth: true,
  },
];

export default function SetupStrains() {
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
        <TouchableOpacity onPress={() => router.push('/setup-flavors')}>
          <Text style={styles.skip}>Skip</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <Text style={styles.title}>My favorite strains...</Text>
        <Text style={styles.subtitle}>Preferences</Text>

        <View style={styles.grid}>
          {OPTIONS.filter(o => !o.fullWidth).map(opt => {
            const isSelected = selected.includes(opt.key);
            return (
              <TouchableOpacity
                key={opt.key}
                style={[
                  styles.card,
                  {
                    backgroundColor: isSelected ? '#5c1030' : CARD,
                    borderColor: isSelected ? PINK : 'transparent',
                  },
                ]}
                activeOpacity={0.75}
                onPress={() => toggle(opt.key)}
              >
                <View style={[styles.emojiCircle, { backgroundColor: opt.circleBg }]}>
                  <Text style={styles.emoji}>{opt.emoji}</Text>
                </View>
                <Text style={styles.cardLabel}>{opt.label}</Text>
                {opt.tag ? <Text style={styles.cardTag}>{opt.tag}</Text> : null}
              </TouchableOpacity>
            );
          })}

          {/* Balanced Hybrid — full width */}
          {OPTIONS.filter(o => o.fullWidth).map(opt => {
            const isSelected = selected.includes(opt.key);
            return (
              <TouchableOpacity
                key={opt.key}
                style={[
                  styles.card,
                  styles.cardFull,
                  {
                    backgroundColor: isSelected ? '#5c1030' : CARD,
                    borderColor: isSelected ? PINK : 'transparent',
                  },
                ]}
                activeOpacity={0.75}
                onPress={() => toggle(opt.key)}
              >
                <View style={[styles.emojiCircle, { backgroundColor: opt.circleBg }]}>
                  <Text style={styles.emoji}>{opt.emoji}</Text>
                </View>
                <Text style={styles.cardLabel}>{opt.label}</Text>
                {opt.tag ? <Text style={styles.cardTag}>{opt.tag}</Text> : null}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.btn, selected.length === 0 && styles.btnMuted]}
          disabled={selected.length === 0}
          activeOpacity={0.85}
          onPress={() => router.push('/setup-flavors')}
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
    gap: 12,
  },
  card: {
    width: '47%',
    paddingVertical: 28,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: CARD,
    borderWidth: 2,
    borderColor: 'transparent',
    gap: 6,
  },
  cardFull: {
    width: '100%',
    paddingVertical: 28,
  },
  cardSelected: { borderColor: PINK, backgroundColor: '#2a0520' },
  emojiCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  emoji: { fontSize: 28 },
  cardLabel: { color: '#fff', fontSize: 13, fontWeight: '700', textAlign: 'center' },
  cardTag: { color: '#888', fontSize: 11, textAlign: 'center' },
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
