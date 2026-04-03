import { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, ScrollView, Animated,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const PINK = '#c4185c';
const BG = '#130008';

const DEFAULT_FLAVORS = [
  'Citrus', 'Earthy', 'Pine', 'Sweet',
  'Diesel', 'Berry', 'Floral', 'Spicy',
  'Herbal', 'Tropical', 'Sour', 'Vanilla',
  'Mint',
];

export default function SetupFlavors() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [flavors, setFlavors] = useState<string[]>(DEFAULT_FLAVORS);
  const [custom, setCustom] = useState('');
  const [loading, setLoading] = useState(false);
  const toastAnim = useRef(new Animated.Value(40)).current;
  const toastOpacity = useRef(new Animated.Value(0)).current;

  const toggle = (f: string) =>
    setSelected(prev =>
      prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f],
    );

  const addCustom = () => {
    const trimmed = custom.trim();
    if (!trimmed || flavors.includes(trimmed)) return;
    setFlavors(prev => [...prev, trimmed]);
    setSelected(prev => [...prev, trimmed]);
    setCustom('');
  };

  const showToast = (message: string) => {
    toastAnim.setValue(40);
    toastOpacity.setValue(0);
    Animated.parallel([
      Animated.timing(toastAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
      Animated.timing(toastOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start(() => {
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(toastAnim, { toValue: 40, duration: 250, useNativeDriver: true }),
          Animated.timing(toastOpacity, { toValue: 0, duration: 250, useNativeDriver: true }),
        ]).start();
      }, 2500);
    });
  };

  const handleComplete = () => {
    if (loading) return;
    setLoading(true);
    showToast('Survey complete!');
    setTimeout(() => {
      router.push('/setup-location');
    }, 1200);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <View />
        <TouchableOpacity onPress={() => router.push('/setup-location')}>
          <Text style={styles.skip}>Skip</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>My favorite flavors...</Text>
        <Text style={styles.subtitle}>Flavor</Text>

        {/* Custom flavor input */}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Add custom flavor..."
            placeholderTextColor="#555"
            value={custom}
            onChangeText={setCustom}
            onSubmitEditing={addCustom}
            returnKeyType="done"
          />
          <TouchableOpacity style={styles.addBtn} onPress={addCustom} activeOpacity={0.8}>
            <Ionicons name="add" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Flavor pills */}
        <View style={styles.pills}>
          {flavors.map(f => (
            <TouchableOpacity
              key={f}
              style={[styles.pill, selected.includes(f) && styles.pillSelected]}
              activeOpacity={0.75}
              onPress={() => toggle(f)}
            >
              <Text style={[styles.pillText, selected.includes(f) && styles.pillTextSelected]}>
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.btn, loading && styles.btnLoading]}
          activeOpacity={0.85}
          onPress={handleComplete}
          disabled={loading}
        >
          <Text style={styles.btnText}>{loading ? 'Saving...' : 'Complete'}</Text>
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
        <Text style={styles.toastText}>Survey complete!</Text>
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
  skip: { color: '#888', fontSize: 14, fontWeight: '500' },
  scroll: { flex: 1 },
  container: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20 },
  title: { color: '#fff', fontSize: 24, fontWeight: '700', marginBottom: 4 },
  subtitle: { color: '#888', fontSize: 13, marginBottom: 20 },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: '#1e0d14',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#fff',
    fontSize: 14,
  },
  addBtn: {
    backgroundColor: PINK,
    borderRadius: 12,
    width: 46,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  pill: {
    backgroundColor: '#1e0d14',
    borderRadius: 50,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  pillSelected: { borderColor: PINK, backgroundColor: '#2a0520' },
  pillText: { color: '#ccc', fontSize: 13, fontWeight: '500' },
  pillTextSelected: { color: '#fff' },
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
  btnLoading: { backgroundColor: '#7a1040' },
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
