import { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const PINK = "#c4185c";
const BG = "#130008";

const FEATURES = [
  {
    title: "Get Beep'd about deals.",
    titleHighlight: "Beep'd",
    desc: "Discover the latest deals and offers near you.",
  },
  {
    title: "Save your favorites.",
    titleHighlight: null,
    desc: "Keep track of your favorite products and brands.",
  },
  {
    title: "Discover new products.",
    titleHighlight: null,
    desc: "Find new products when you're feeling adventurous.",
  },
];

function FeatureRow({
  title,
  titleHighlight,
  desc,
}: {
  title: string;
  titleHighlight: string | null;
  desc: string;
}) {
  const parts = titleHighlight ? title.split(titleHighlight) : null;

  return (
    <View style={styles.featureRow}>
      <View style={styles.featureTitleRow}>
        <Ionicons
          name="checkmark"
          size={20}
          color={PINK}
          style={styles.check}
        />
        <Text style={styles.featureTitle}>
          {parts ? (
            <>
              {parts[0]}
              <Text style={styles.highlight}>{titleHighlight}</Text>
              {parts[1]}
            </>
          ) : (
            title
          )}
        </Text>
      </View>
      <View style={styles.featureCopy}>
        <Text style={styles.featureDesc}>{desc}</Text>
      </View>
    </View>
  );
}

export default function Onboarding() {
  const router = useRouter();
  const toastAnim = useRef(new Animated.Value(60)).current;
  const toastOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Slide up + fade in
    Animated.parallel([
      Animated.timing(toastAnim, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.timing(toastOpacity, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Hold then fade out
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(toastAnim, {
            toValue: 60,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(toastOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      }, 3000);
    });
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />

      <View style={styles.container}>
        <Text style={styles.logo}>beepr</Text>

        <Text style={styles.title}>Welcome to Beepr.</Text>
        <Text style={styles.subtitle}>Your Cannabis Matchmaker</Text>

        <View style={styles.features}>
          {FEATURES.map((f) => (
            <FeatureRow key={f.title} {...f} />
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.btn}
          activeOpacity={0.85}
          onPress={() => router.push("/setup-name")}
        >
          <Text style={styles.btnText}>Let's Go</Text>
        </TouchableOpacity>
      </View>

      {/* Toast */}
      <Animated.View
        style={[
          styles.toast,
          { transform: [{ translateY: toastAnim }], opacity: toastOpacity },
        ]}
      >
        <Ionicons name="checkmark-circle" size={20} color="#fff" />
        <Text style={styles.toastText}>Password created successfully!</Text>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },
  container: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 40,
    justifyContent: "center",
  },
  logo: {
    color: PINK,
    fontSize: 28,
    fontStyle: "italic",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 44,
  },
  title: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 6,
    textAlign: "center",
    lineHeight: 38,
  },
  subtitle: {
    color: PINK,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 52,
    textAlign: "center",
  },
  features: {
    gap: 28,
    alignSelf: "stretch",
    paddingLeft: 2,
  },
  featureRow: {
    alignItems: "flex-start",
  },
  featureTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  check: {
    marginRight: 12,
  },
  featureCopy: {
    paddingLeft: 32,
    paddingRight: 8,
  },
  featureTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  highlight: { color: PINK },
  featureDesc: { color: "#888", fontSize: 15, lineHeight: 22 },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 12,
    backgroundColor: BG,
  },
  btn: {
    backgroundColor: PINK,
    borderRadius: 50,
    paddingVertical: 18,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  toast: {
    position: "absolute",
    bottom: 110,
    left: 24,
    right: 24,
    backgroundColor: "#333",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  toastText: { color: "#fff", fontSize: 14, fontWeight: "500" },
});
