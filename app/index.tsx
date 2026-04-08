import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';

const PINK = '#e8186d';
const BG = '#0d0008';

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
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * 2 * Math.PI;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        return (
          <View
            key={i}
            style={[
              styles.dot,
              {
                width: dotSize,
                height: dotSize,
                borderRadius: dotSize / 2,
                opacity,
                transform: [
                  { translateX: x - dotSize / 2 },
                  { translateY: y - dotSize / 2 },
                ],
              },
            ]}
          />
        );
      })}
    </>
  );
}

export default function Welcome() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Logo com efeito radar */}
      <View style={styles.logoArea}>
        <View style={styles.radar}>
          <DotsRing radius={145} count={48} dotSize={2.5} opacity={0.12} />
          <DotsRing radius={115} count={38} dotSize={2.5} opacity={0.2} />
          <DotsRing radius={85}  count={28} dotSize={3}   opacity={0.3} />
          <DotsRing radius={57}  count={18} dotSize={3}   opacity={0.45} />
          <Text style={styles.logoText}>beepr</Text>
        </View>
      </View>

      {/* Rodapé */}
      <View style={styles.footer}>
        <Text style={styles.terms}>
          By creating an account or signing in, you agree to our{' '}
          <Text style={styles.link}>Terms of Service</Text>
          {' '}and{' '}
          <Text style={styles.link}>Privacy Policy</Text>
        </Text>

        <TouchableOpacity
          style={styles.btnFilled}
          onPress={() => router.push('/register')}
          activeOpacity={0.85}
        >
          <Text style={styles.btnFilledText}>Create Account</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnOutline}
          onPress={() => router.push('/login')}
          activeOpacity={0.85}
        >
          <Text style={styles.btnOutlineText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 48,
    paddingTop: 60,
  },
  logoArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radar: {
    width: 320,
    height: 320,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    position: 'absolute',
    backgroundColor: PINK,
  },
  logoText: {
    fontSize: 52,
    fontWeight: '700',
    color: PINK,
    letterSpacing: 3,
    fontStyle: 'italic',
  },
  footer: {
    width: '100%',
    gap: 12,
  },
  terms: {
    color: '#888',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 4,
    lineHeight: 18,
  },
  link: {
    color: PINK,
  },
  btnFilled: {
    backgroundColor: PINK,
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
  },
  btnFilledText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  btnOutline: {
    borderWidth: 1.5,
    borderColor: PINK,
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
  },
  btnOutlineText: {
    color: PINK,
    fontWeight: '600',
    fontSize: 16,
  },
});
