import { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity, PanResponder, Animated,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const PINK = '#c4185c';
const BG = '#130008';
const CARD_BG = '#1e0d14';
const MIN = 1;
const MAX = 49.9;

function lerp(t: number) {
  return +(MIN + t * (MAX - MIN)).toFixed(1);
}

export default function SetupRange() {
  const router = useRouter();
  const trackWidthRef = useRef(0);
  const ratioRef = useRef((10 - MIN) / (MAX - MIN));
  const startRatioRef = useRef(ratioRef.current);
  const [ratio, setRatio] = useState(ratioRef.current);
  const miles = lerp(ratio);

  // Toast
  const toastAnim = useRef(new Animated.Value(40)).current;
  const toastOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(toastAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
      Animated.timing(toastOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start(() => {
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(toastAnim, { toValue: 40, duration: 250, useNativeDriver: true }),
          Animated.timing(toastOpacity, { toValue: 0, duration: 250, useNativeDriver: true }),
        ]).start();
      }, 2500);
    });
  }, []);

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        startRatioRef.current = ratioRef.current;
      },
      onPanResponderMove: (_, gs) => {
        if (!trackWidthRef.current) return;
        const newRatio = Math.min(
          1,
          Math.max(0, startRatioRef.current + gs.dx / trackWidthRef.current),
        );
        ratioRef.current = newRatio;
        setRatio(newRatio);
      },
    }),
  ).current;

  const [saving, setSaving] = useState(false);
  const thumbLeft = ratio * trackWidthRef.current;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text style={styles.title}>Set Your Notification{'\n'}Range</Text>
        <Text style={styles.subtitle}>
          Choose how far you're willing to travel for new products
        </Text>

        {/* Location context card */}
        <View style={styles.locationCard}>
          <Ionicons name="location" size={18} color={PINK} style={styles.locationIcon} />
          <View style={styles.locationText}>
            <Text style={styles.locationTitle}>Dense Urban Area</Text>
            <Text style={styles.locationDesc}>
              1 dispensaries nearby. We recommend a smaller radius to avoid too many notifications.
            </Text>
          </View>
        </View>

        {/* Radius display */}
        <View style={styles.radiusBlock}>
          <Text style={styles.radiusValue}>
            <Text style={styles.radiusNumber}>{miles}</Text>
            {' '}
            <Text style={styles.radiusUnit}>miles</Text>
          </Text>
          <Text style={styles.radiusDesc}>
            See products and get notifications within this radius
          </Text>
        </View>

        {/* Custom slider */}
        <View style={styles.sliderWrapper}>
          <View
            style={styles.track}
            onLayout={e => { trackWidthRef.current = e.nativeEvent.layout.width; }}
          >
            {/* Filled section */}
            <View style={[styles.trackFilled, { width: `${ratio * 100}%` }]} />

            {/* Thumb — intercepts touch on the whole track for easy dragging */}
            <View
              style={[styles.thumb, { left: thumbLeft - 10 }]}
              {...pan.panHandlers}
            />
          </View>

          {/* Tick labels */}
          <View style={styles.tickRow}>
            <Text style={styles.tick}>1 mi</Text>
            <Text style={styles.tick}>25 mi</Text>
            <Text style={styles.tick}>49.9 mi</Text>
          </View>
        </View>

        {/* How it works */}
        <View style={styles.howBlock}>
          <Text style={styles.howTitle}>How this works:</Text>
          {[
            `Products shown within ${miles} miles of your location`,
            'Get notified about new products in this range',
            'Maximum 15 notifications per day',
            'You can change this anytime in Settings',
          ].map((item, i) => (
            <View key={i} style={styles.bullet}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletText}>{item}</Text>
            </View>
          ))}
        </View>

        {/* Continue button inside scroll so it's reachable */}
        <TouchableOpacity
          style={[styles.btn, saving && styles.btnMuted]}
          activeOpacity={0.85}
          disabled={saving}
          onPress={() => {
            setSaving(true);
            setTimeout(() => {
              router.push(`/setup-notifications?miles=${miles}`);
            }, 1500);
          }}
        >
          <Text style={styles.btnText}>{saving ? 'Saving...' : 'Continue'}</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Toast */}
      <Animated.View
        style={[
          styles.toast,
          { transform: [{ translateY: toastAnim }], opacity: toastOpacity },
        ]}
      >
        <Ionicons name="checkmark-circle" size={18} color="#22c55e" />
        <Text style={styles.toastText}>Location verified! Loading your personalized feed...</Text>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 48,
    gap: 20,
  },

  // Header
  title: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '700',
    lineHeight: 32,
  },
  subtitle: {
    color: '#888',
    fontSize: 13,
    lineHeight: 19,
    marginTop: -8,
  },

  // Location card
  locationCard: {
    backgroundColor: CARD_BG,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  locationIcon: { marginTop: 2 },
  locationText: { flex: 1 },
  locationTitle: { color: '#fff', fontSize: 14, fontWeight: '700', marginBottom: 4 },
  locationDesc: { color: '#888', fontSize: 12, lineHeight: 18 },

  // Radius display
  radiusBlock: {
    backgroundColor: CARD_BG,
    borderRadius: 14,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 6,
  },
  radiusValue: {
    fontSize: 36,
    fontWeight: '700',
  },
  radiusNumber: { color: PINK, fontSize: 48, fontWeight: '800' },
  radiusUnit: { color: PINK, fontSize: 24, fontWeight: '600' },
  radiusDesc: { color: '#888', fontSize: 12, textAlign: 'center' },

  // Slider
  sliderWrapper: { paddingHorizontal: 4, gap: 8 },
  track: {
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    position: 'relative',
    justifyContent: 'center',
  },
  trackFilled: {
    height: 4,
    backgroundColor: PINK,
    borderRadius: 2,
  },
  thumb: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: PINK,
    top: -8,
    shadowColor: PINK,
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  tickRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tick: { color: '#666', fontSize: 11 },

  // How it works
  howBlock: {
    backgroundColor: CARD_BG,
    borderRadius: 14,
    padding: 16,
    gap: 10,
  },
  howTitle: { color: '#fff', fontSize: 14, fontWeight: '700' },
  bullet: { flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  bulletDot: { color: '#888', fontSize: 13, lineHeight: 20 },
  bulletText: { color: '#aaa', fontSize: 13, lineHeight: 20, flex: 1 },

  // Button
  btn: {
    backgroundColor: PINK,
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 4,
  },
  btnMuted: { backgroundColor: '#7a1040' },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 15 },

  // Toast
  toast: {
    position: 'absolute',
    bottom: 32,
    left: 24,
    right: 24,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  toastText: { color: '#fff', fontSize: 13, fontWeight: '500', flex: 1 },
});
