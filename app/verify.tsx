import { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Animated, SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

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

      <View style={styles.container}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.title}>Verification</Text>
        <Text style={styles.subtitle}>
          Enter the 6-digit code sent to{'\n'}
          <Text style={{ color: '#ccc' }}>{email || 'your email'}</Text>
        </Text>

        <View style={styles.codeRow}>
          {code.map((digit, i) => (
            <TextInput
              key={i}
              ref={r => { inputRefs.current[i] = r; }}
              style={[styles.codeBox, digit ? styles.codeBoxFilled : null]}
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
          Didn't receive your code?{' '}
          <Text style={styles.timer}>
            {seconds > 0 ? `Try again in 0:${seconds.toString().padStart(2, '0')}` : 'Resend'}
          </Text>
        </Text>
      </View>

      {/* Toast flutuante */}
      <Animated.View style={[styles.toast, { opacity: toastOpacity }]}>
        <Ionicons name="checkmark-circle" size={16} color={PINK} />
        <Text style={styles.toastText}>Code sent to your email</Text>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  back: { marginBottom: 28 },
  title: { color: '#fff', fontSize: 24, fontWeight: '700', marginBottom: 6 },
  subtitle: { color: '#888', fontSize: 13, marginBottom: 28, lineHeight: 19 },
  codeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 28,
  },
  codeBox: {
    width: 44,
    height: 54,
    backgroundColor: '#2a0f1a',
    borderRadius: 10,
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    borderWidth: 1.5,
    borderColor: 'transparent',
    textAlignVertical: 'center',
    paddingVertical: 0,
    includeFontPadding: false,
  },
  codeBoxFilled: {
    borderColor: PINK,
  },
  btn: {
    backgroundColor: PINK,
    borderRadius: 50,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  btnMuted: { backgroundColor: '#7a1040' },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  resend: { color: '#888', fontSize: 12, textAlign: 'center' },
  timer: { color: PINK },
  toast: {
    position: 'absolute',
    bottom: 32,
    left: 32,
    right: 32,
    backgroundColor: '#1e0d16',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  toastText: { color: '#ccc', fontSize: 13 },
});
