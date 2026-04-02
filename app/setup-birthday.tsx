import { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, Animated,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const PINK = '#c4185c';
const BG = '#130008';

export default function SetupBirthday() {
  const router = useRouter();
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
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

  const isValid = month.length === 2 && year.length === 4;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />

      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Ionicons name="arrow-back" size={22} color="#fff" />
      </TouchableOpacity>

      <View style={styles.container}>
        <Text style={styles.title}>My Birthday...</Text>
        <Text style={styles.subtitle}>
          You must be 21+ or hold a medical card to continue
        </Text>

        <View style={styles.row}>
          <View style={styles.fieldWrap}>
            <Text style={styles.label}>Month (MM)</Text>
            <TextInput
              style={styles.input}
              value={month}
              onChangeText={v => setMonth(v.replace(/\D/g, '').slice(0, 2))}
              placeholder="MM"
              placeholderTextColor="#555"
              keyboardType="number-pad"
              maxLength={2}
            />
          </View>
          <View style={styles.fieldWrap}>
            <Text style={styles.label}>Year (YYYY)</Text>
            <TextInput
              style={styles.input}
              value={year}
              onChangeText={v => setYear(v.replace(/\D/g, '').slice(0, 4))}
              placeholder="YYYY"
              placeholderTextColor="#555"
              keyboardType="number-pad"
              maxLength={4}
            />
          </View>
        </View>

        <View style={styles.hintBox}>
          <Text style={styles.hintText}>
            Enter your birth month and year to verify your age.
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.btn, !isValid && styles.btnMuted]}
          disabled={!isValid}
          activeOpacity={0.85}
          onPress={() => { /* próxima tela */ }}
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
        <Text style={styles.toastText}>Phone number saved!</Text>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },
  back: { paddingHorizontal: 20, paddingTop: 8 },
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 16 },
  title: { color: '#fff', fontSize: 26, fontWeight: '700', marginBottom: 8 },
  subtitle: { color: '#888', fontSize: 13, lineHeight: 19, marginBottom: 28 },
  row: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  fieldWrap: { flex: 1 },
  label: { color: '#ccc', fontSize: 13, fontWeight: '600', marginBottom: 8 },
  input: {
    backgroundColor: '#2a0f1a',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    color: '#fff',
    fontSize: 16,
  },
  hintBox: {
    backgroundColor: '#1e0d14',
    borderRadius: 12,
    padding: 14,
  },
  hintText: { color: '#666', fontSize: 13, lineHeight: 19 },
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
