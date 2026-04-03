import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../components/theme";
import { InputField } from "../components/ui/InputField";
import { PrimaryButton } from "../components/ui/PrimaryButton";

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const isValid = Boolean(email.trim()) && email.includes("@");
  const error =
    email.trim() && !isValid ? "Please enter a valid email address" : "";

  async function handleContinue() {
    if (!isValid || loading) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    router.push({ pathname: "/verify", params: { email } });
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar style="light" />

      <View style={styles.backRow}>
        <Ionicons
          name="arrow-back"
          size={24}
          color={COLORS.textPrimary}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        />
      </View>

      <Text style={styles.title}>Enter your email</Text>
      <Text style={styles.subtitle}>
        We'll send you a 6-digit verification code.
      </Text>

      <InputField
        value={email}
        onChangeText={setEmail}
        placeholder="Email Address"
        keyboardType="email-address"
        autoCapitalize="none"
        error={error}
        testID="register-email"
      />

      <PrimaryButton
        onPress={handleContinue}
        label={loading ? "Sending..." : "Continue"}
        disabled={!isValid}
        loading={loading}
        testID="register-submit"
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 24,
    paddingTop: 64,
  },
  backRow: {
    marginBottom: 36,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginBottom: 32,
    lineHeight: 20,
  },
});
