import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  SafeAreaView,
  Alert,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../lib/supabase";

const PINK = "#c4185c";
const BG = "#130008";

export default function Verify() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
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
      setSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);

    return () => {
      clearTimeout(hide);
      clearInterval(tick);
    };
  }, []);

  function handleChange(value: string, index: number) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...code];
    next[index] = digit;
    setCode(next);
    if (digit && index < 5) inputRefs.current[index + 1]?.focus();
    // Auto-submit when last digit entered
    if (digit && index === 5) {
      const full = next.join("");
      if (full.length === 6) handleVerifyWithCode(full);
    }
  }

  async function handleVerifyWithCode(otp: string) {
    setLoading(true);
    // Try 'signup' type first, fall back to 'email' (magic link OTP)
    let result = await supabase.auth.verifyOtp({
      email: email ?? "",
      token: otp,
      type: "signup",
    });
    if (result.error) {
      result = await supabase.auth.verifyOtp({
        email: email ?? "",
        token: otp,
        type: "email",
      });
    }
    setLoading(false);
    if (result.error) {
      Alert.alert("Verification Failed", result.error.message);
      return;
    }
    router.replace("/onboarding");
  }

  function handleKeyPress(key: string, index: number) {
    if (key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  async function handleVerify() {
    const otp = code.join("");
    if (otp.length < 6 || loading) return;
    await handleVerifyWithCode(otp);
  }

  async function handleResend() {
    if (seconds > 0) return;
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: email ?? "",
    });
    if (!error) setSeconds(59);
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
          Enter the 6-digit verification code sent to your{"\n"}
          <Text style={styles.subtitleEmail}>{email || "email"}</Text>
        </Text>

        <View style={styles.codeRow}>
          {code.map((digit, i) => (
            <TextInput
              key={i}
              ref={(r) => {
                inputRefs.current[i] = r;
              }}
              style={[styles.codeBox, digit ? styles.codeBoxFilled : null]}
              value={digit}
              onChangeText={(v) => handleChange(v, i)}
              onKeyPress={({ nativeEvent }) =>
                handleKeyPress(nativeEvent.key, i)
              }
              keyboardType={Platform.OS === "web" ? "default" : "number-pad"}
              inputMode="numeric"
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
          <Text style={styles.btnText}>
            {loading ? "Verifying..." : "Verify"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.resend}>
          Didn't receive your code?{" "}
          <Text
            style={[styles.timer, seconds === 0 && { color: PINK }]}
            onPress={handleResend}
          >
            {seconds > 0
              ? `Try again in 0:${seconds.toString().padStart(2, "0")}`
              : "Resend"}
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
    paddingHorizontal: 22,
    paddingTop: 18,
  },
  back: { marginBottom: 18 },
  title: { color: "#fff", fontSize: 25, fontWeight: "700", marginBottom: 14 },
  subtitle: {
    color: "#8d7f88",
    fontSize: 13,
    marginBottom: 34,
    lineHeight: 21,
  },
  subtitleEmail: { color: "#8d7f88" },
  codeRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 28,
  },
  codeBox: {
    width: 44,
    height: 42,
    backgroundColor: "#2a1824",
    borderRadius: 11,
    color: "#fff",
    fontSize: 18,
    fontWeight: "400",
    borderWidth: 1,
    borderColor: "#43303d",
    textAlign: "center",
    textAlignVertical: "center",
    paddingVertical: 0,
    paddingHorizontal: 0,
    marginHorizontal: 4,
    includeFontPadding: false,
  },
  codeBoxFilled: {
    borderColor: "#5c4051",
  },
  btn: {
    backgroundColor: "#8e255f",
    borderRadius: 999,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 18,
  },
  btnMuted: { backgroundColor: "#8e255f", opacity: 0.95 },
  btnText: { color: "#b894a7", fontWeight: "700", fontSize: 14 },
  resend: { color: "#9a8b95", fontSize: 12, textAlign: "center" },
  timer: { color: PINK, fontWeight: "700" },
  toast: {
    position: "absolute",
    bottom: 32,
    left: 32,
    right: 32,
    backgroundColor: "#17131a",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#2f1d2f",
  },
  toastText: { color: "#ccc", fontSize: 13 },
});
