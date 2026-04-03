import { View, Text, StyleSheet, Animated } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { COLORS } from "../components/theme";
import { PrimaryButton } from "../components/ui/PrimaryButton";
import { OutlineButton } from "../components/ui/OutlineButton";

const PINK = COLORS.primary;
const BG = COLORS.background;

function DotsRing({
  radius,
  count,
  dotSize,
  opacity,
}: {
  radius: number;
  count: number;
  dotSize: number;
  opacity: number;
}) {
  const dots = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * 2 * Math.PI;
        return {
          key: i,
          x: radius * Math.cos(angle),
          y: radius * Math.sin(angle),
        };
      }),
    [count, radius],
  );

  return (
    <>
      {dots.map(({ key, x, y }) => (
        <View
          key={key}
          style={{
            position: "absolute",
            width: dotSize,
            height: dotSize,
            borderRadius: dotSize / 2,
            opacity,
            backgroundColor: PINK,
            transform: [
              { translateX: x - dotSize / 2 },
              { translateY: y - dotSize / 2 },
            ],
          }}
        />
      ))}
    </>
  );
}

export default function Welcome() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.logoArea}>
        <View style={styles.radar}>
          <DotsRing radius={145} count={48} dotSize={2.5} opacity={0.12} />
          <DotsRing radius={115} count={38} dotSize={2.5} opacity={0.2} />
          <DotsRing radius={85} count={28} dotSize={3} opacity={0.3} />
          <DotsRing radius={57} count={18} dotSize={3} opacity={0.45} />
          <Text style={styles.logoText}>beepr</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.terms}>
          By creating an account or signing in, you agree to our{" "}
          <Text style={styles.link}>Terms of Service</Text> and{" "}
          <Text style={styles.link}>Privacy Policy</Text>
        </Text>

        <PrimaryButton
          label="Create Account"
          onPress={() => router.push("/register")}
        />
        <OutlineButton label="Sign In" onPress={() => router.push("/login")} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingBottom: 48,
    paddingTop: 60,
  },
  logoArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  radar: {
    width: 320,
    height: 320,
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontSize: 52,
    fontWeight: "700",
    color: PINK,
    letterSpacing: 3,
    fontStyle: "italic",
  },
  footer: {
    width: "100%",
    gap: 12,
  },
  terms: {
    color: COLORS.textSecondary,
    fontSize: 12,
    textAlign: "center",
    marginBottom: 4,
    lineHeight: 18,
  },
  link: {
    color: PINK,
  },
});
