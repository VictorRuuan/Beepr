import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const PINK = '#c4185c';
const BG = '#130008';

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleContinue() {
    if (!email.trim() || loading) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    router.push({ pathname: '/verify', params: { email } });
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar style="light" />

      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.title}>Enter your email</Text>
      <Text style={styles.subtitle}>We'll send you a 6-digit verification code</Text>

      <TextInput
        style={styles.input}
        placeholder="Email Address"
        placeholderTextColor="#555"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <TouchableOpacity
        style={[styles.btn, (!email.trim() || loading) && styles.btnMuted]}
        onPress={handleContinue}
        activeOpacity={0.85}
      >
        <Text style={styles.btnText}>{loading ? 'Sending...' : 'Continue'}</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
    paddingHorizontal: 24,
    paddingTop: 64,
  },
  back: { marginBottom: 36 },
  title: { color: '#fff', fontSize: 28, fontWeight: '700', marginBottom: 8 },
  subtitle: { color: '#888', fontSize: 14, marginBottom: 32, lineHeight: 20 },
  input: {
    backgroundColor: '#17131a',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    color: '#fff',
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#2f1d2f',
  },
  btn: {
    backgroundColor: PINK,
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
  },
  btnMuted: { backgroundColor: '#7a1040' },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
