import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../components/theme";

export default function SetupComplete() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />

      <View style={styles.content}>
        <Ionicons name="checkmark-circle" size={76} color="#22c55e" />
        <Text style={styles.title}>Congratulations!</Text>
        <Text style={styles.subtitle}>Your setup is complete.</Text>
        <Text style={styles.body}>
          You are ready to start using Beepr with your preferences configured.
        </Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => router.replace("/")}
          activeOpacity={0.85}
        >
          <Text style={styles.btnText}>Ir para Início</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.surface },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
    gap: 14,
  },
  title: {
    color: COLORS.primary,
    fontSize: 34,
    fontWeight: "800",
  },
  subtitle: {
    color: COLORS.textPrimary,
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },
  body: {
    color: COLORS.textSecondary,
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 56,
    paddingTop: 16,
  },
  btn: {
    backgroundColor: COLORS.primary,
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: "center",
  },
  btnText: {
    color: COLORS.textPrimary,
    fontWeight: "700",
    fontSize: 16,
  },
});
