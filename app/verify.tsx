import { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Animated, Dimensions, SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const SCREEN_WIDTH = Dimensions.get('window').width;
// 6 boxes, 24px padding each side, 8px gap between = 5 gaps
const BOX_SIZE = Math.floor((SCREEN_WIDTH - 48 - 40) / 6);

const PINK = '#c4185c';
const BG = '#130008';

export default function Verify() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [seconds, setSeconds] = useState(59);
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const toastOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const hide = setTimeout(() => {
      Animated.timing(toastOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, 4000);

    const tick = setInterval(() => {
      setSeconds(s => (s > 0 ? s - 1 : 0));
    }, 1000);

    return () => { clearTimeout(hide); clearInterval(tick); };
  }, []);

  function handleChange(value: string, index: number) {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...code];
    next[index] = digit;
    setCode(next);
    if (digit && index < 5) inputRefs.current[index + 1]?.focus();
  }

  function handleKeyPress(key: string, index: number) {
    if (key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  async function handleVerify() {
    if (loading) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    router.push('/create-password');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />

      {/* Toast — positioned relative to safe area, above content */}
      <Animated.View style={[styles.toast, { opacity: toastOpacity }]}>
        <Text style={styles.toastTitle}>Code Sent!</Text>
        <Text style={styles.toastSub}>
          We've sent a 6-digit code to {email || 'your email'}
        </Text>
      </Animated.View>

      <View style={styles.container}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.title}>Verification</Text>
        <Text style={styles.subtitle}>
          Enter the 6-digit verification code sent to your email
        </Text>

        <View style={styles.codeRow}>
          {code.map((digit, i) => (
            <TextInput
              key={i}
              ref={r => { inputRefs.current[i] = r; }}
              style={styles.codeBox}
              value={digit}
              onChangeText={v => handleChange(v, i)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, i)}
              keyboardType="number-pad"
              maxLength={1}
              textAlign="center"
              selectionColor={PINK}
            />
          ))}
        </View>

        <TouchableOpacity
          style={[styles.btn, loading && styles.btnMuted]}
          onPress={handleVerify}
          disabled={loading}
          activeOpacity={0.85}
        >
          <Text style={styles.btnText}>{loading ? 'Verifying...' : 'Verify'}</Text>
        </TouchableOpacity>

        <Text style={styles.resend}>
          Didn't receive your code yet? Try again in{' '}
          <Text style={styles.timer}>0:{seconds.toString().padStart(2, '0')}</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BG,
  },
  toast: {
    backgroundColor: '#1e0d16',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#3a1025',
  },
  toastTitle: { color: '#fff', fontWeight: '700', fontSize: 14, marginBottom: 2 },
  toastSub: { color: '#aaa', fontSize: 13 },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  back: { marginBottom: 32 },
  title: { color: '#fff', fontSize: 28, fontWeight: '700', marginBottom: 8 },
  subtitle: { color: '#888', fontSize: 14, marginBottom: 32, lineHeight: 20 },
  codeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  codeBox: {
    width: BOX_SIZE,
    height: BOX_SIZE,
    backgroundColor: '#2a0f1a',
    borderRadius: 10,
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
  },
  btn: {
    backgroundColor: PINK,
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  btnMuted: { backgroundColor: '#7a1040' },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  resend: { color: '#888', fontSize: 13, textAlign: 'center' },
  timer: { color: PINK },
});
