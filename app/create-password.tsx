import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';

const PINK = '#c4185c';
const BG = '#130008';

function Requirement({ met, label }: { met: boolean; label: string }) {
  return (
    <View style={styles.reqRow}>
      <Ionicons
        name={met ? 'checkmark-circle' : 'close-circle-outline'}
        size={18}
        color={met ? '#22c55e' : '#555'}
      />
      <Text style={[styles.reqText, met && styles.reqTextMet]}>{label}</Text>
    </View>
  );
}

export default function CreatePassword() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showCf, setShowCf] = useState(false);
  const [focused, setFocused] = useState<'pw' | 'cf' | null>(null);
  const [loading, setLoading] = useState(false);

  const reqs = {
    length: password.length >= 8,
    upper:  /[A-Z]/.test(password),
    lower:  /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    match:  password.length > 0 && password === confirm,
  };
  const allMet = Object.values(reqs).every(Boolean);

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

        <Text style={styles.title}>Create Password</Text>
        <Text style={styles.subtitle}>Set a secure password for your account</Text>

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
          />
          <TouchableOpacity onPress={() => setShowPw(v => !v)}>
            <Ionicons name={showPw ? 'eye-outline' : 'eye-off-outline'} size={20} color="#888" />
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Confirm Password</Text>
        <View style={[styles.inputRow, focused === 'cf' && styles.inputFocused]}>
          <TextInput
            style={styles.input}
            value={confirm}
            onChangeText={setConfirm}
            secureTextEntry={!showCf}
            placeholder="Confirm your password"
            placeholderTextColor="#555"
            onFocus={() => setFocused('cf')}
            onBlur={() => setFocused(f => f === 'cf' ? null : f)}
          />
          <TouchableOpacity onPress={() => setShowCf(v => !v)}>
            <Ionicons name={showCf ? 'eye-outline' : 'eye-off-outline'} size={20} color="#888" />
          </TouchableOpacity>
        </View>

        {focused !== null && (
          <View style={styles.reqBox}>
            <Text style={styles.reqTitle}>Password Requirements:</Text>
            <Requirement met={reqs.length} label="At least 8 characters" />
            <Requirement met={reqs.upper}  label="One uppercase letter" />
            <Requirement met={reqs.lower}  label="One lowercase letter" />
            <Requirement met={reqs.number} label="One number" />
            <Requirement met={reqs.match}  label="Passwords match" />
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.btn, (!allMet || loading) && styles.btnMuted]}
          disabled={!allMet || loading}
          activeOpacity={0.85}
          onPress={async () => {
            setLoading(true);
            const { data, error } = await supabase.auth.signUp({
              email: email ?? '',
              password,
              options: {
                data: {
                  age_verified: true,
                  age_verified_at: new Date().toISOString(),
                },
              },
            });
            setLoading(false);
            if (error) {
              Alert.alert('Error', error.message);
              return;
            }
            if (data.session) {
              // Email confirmation disabled — user logged in immediately
              router.replace('/onboarding');
            } else {
              // Email confirmation enabled — OTP was sent to email
              router.push({ pathname: '/verify', params: { email: email ?? '' } });
            }
          }}
        >
          <Text style={styles.btnText}>{loading ? 'Creating...' : 'Continue'}</Text>
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
  reqBox: {
    backgroundColor: '#17131a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2f1d2f',
  },
  reqTitle: { color: '#fff', fontWeight: '700', fontSize: 14, marginBottom: 10 },
  reqRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  reqText: { color: '#555', fontSize: 13 },
  reqTextMet: { color: '#22c55e' },
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
  },
  btnMuted: { backgroundColor: '#7a1040' },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
