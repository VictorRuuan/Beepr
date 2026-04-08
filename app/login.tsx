import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, Alert, ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';

const PINK = '#c4185c';
const BG = '#130008';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<'email' | 'pw' | null>(null);

  const canSubmit = email.trim().length > 0 && password.length >= 1;

  async function handleSignIn() {
    if (!canSubmit || loading) return;
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);
    if (error) {
      Alert.alert('Sign In Failed', error.message);
      return;
    }
    router.replace('/setup-complete');
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <StatusBar style="light" />

        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Sign in to your account</Text>

        <Text style={styles.label}>Email</Text>
        <View style={[styles.inputRow, focused === 'email' && styles.inputFocused]}>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Email Address"
            placeholderTextColor="#555"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            onFocus={() => setFocused('email')}
            onBlur={() => setFocused(f => f === 'email' ? null : f)}
          />
        </View>

        <Text style={styles.label}>Password</Text>
        <View style={[styles.inputRow, focused === 'pw' && styles.inputFocused]}>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPw}
            placeholder="Password"
            placeholderTextColor="#555"
            onFocus={() => setFocused('pw')}
            onBlur={() => setFocused(f => f === 'pw' ? null : f)}
            onSubmitEditing={handleSignIn}
          />
          <TouchableOpacity onPress={() => setShowPw(v => !v)}>
            <Ionicons name={showPw ? 'eye-outline' : 'eye-off-outline'} size={20} color="#888" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.forgotRow}>
          <Text style={styles.forgotText}>Forgot password?</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.btn, (!canSubmit || loading) && styles.btnMuted]}
          disabled={!canSubmit || loading}
          activeOpacity={0.85}
          onPress={handleSignIn}
        >
          <Text style={styles.btnText}>{loading ? 'Signing in...' : 'Sign In'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/register')} style={styles.createRow}>
          <Text style={styles.createText}>
            Don't have an account?{' '}
            <Text style={{ color: PINK, fontWeight: '600' }}>Create one</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  content: { paddingHorizontal: 24, paddingTop: 64, paddingBottom: 20 },
  back: { marginBottom: 36 },
  title: { color: '#fff', fontSize: 28, fontWeight: '700', marginBottom: 8 },
  subtitle: { color: '#888', fontSize: 14, marginBottom: 32, lineHeight: 20 },
  label: { color: '#ccc', fontSize: 13, fontWeight: '600', marginBottom: 8 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#17131a',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: '#2f1d2f',
  },
  inputFocused: { borderColor: PINK },
  input: { flex: 1, paddingVertical: 16, color: '#fff', fontSize: 16 },
  forgotRow: { alignSelf: 'flex-end', marginTop: -8 },
  forgotText: { color: PINK, fontSize: 13, fontWeight: '500' },
  footer: {
    backgroundColor: BG,
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 12,
  },
  btn: {
    backgroundColor: PINK,
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  btnMuted: { backgroundColor: '#7a1040' },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  createRow: { alignItems: 'center' },
  createText: { color: '#888', fontSize: 13 },
});
