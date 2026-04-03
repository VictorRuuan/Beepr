import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  Animated,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const PINK = "#c4185c";
const BG = "#130008";

type Phase = "idle" | "requesting" | "loading";

export default function SetupNotifications() {
  const { miles } = useLocalSearchParams<{ miles: string }>();
  const radiusMiles = miles ?? "10";

  const [phase, setPhase] = useState<Phase>("idle");
  const [toastMsg, setToastMsg] = useState(
    `Notification radius set to ${radiusMiles} miles`,
  );
  const toastAnim = useRef(new Animated.Value(40)).current;
  const toastOpacity = useRef(new Animated.Value(0)).current;

  const showToast = (msg: string, stay = false) => {
    setToastMsg(msg);
    toastAnim.setValue(40);
    toastOpacity.setValue(0);
    Animated.parallel([
      Animated.timing(toastAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(toastOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (!stay) {
        setTimeout(() => {
          Animated.parallel([
            Animated.timing(toastAnim, {
              toValue: 40,
              duration: 250,
              useNativeDriver: true,
            }),
            Animated.timing(toastOpacity, {
              toValue: 0,
              duration: 250,
              useNativeDriver: true,
            }),
          ]).start();
        }, 3000);
      }
    });
  };

  useEffect(() => {
    showToast(`Notification radius set to ${radiusMiles} miles`, true);
  }, []);

  const router = useRouter();

  const handlePermission = (allowed: boolean) => {
    setPhase("loading");
    if (allowed) {
      setTimeout(() => {
        showToast("Notifications enabled!", true);
        setTimeout(() => router.replace("/setup-complete"), 1200);
      }, 800);
    } else {
      setTimeout(() => router.replace("/setup-complete"), 800);
    }
  };

  // ── Loading screen ──────────────────────────────────────────────
  if (phase === "loading") {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar style="light" />
        <Text style={styles.loadingText}>Loading...</Text>

        <Animated.View
          style={[
            styles.toast,
            { transform: [{ translateY: toastAnim }], opacity: toastOpacity },
          ]}
        >
          <Ionicons name="checkmark-circle" size={18} color="#22c55e" />
          <Text style={styles.toastText}>{toastMsg}</Text>
        </Animated.View>
      </View>
    );
  }

  // ── Main screen ─────────────────────────────────────────────────
  return (
    <View style={styles.safe}>
      <StatusBar style="light" />

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.bellWrap}>
          <Ionicons name="notifications-outline" size={64} color={PINK} />
        </View>
        <Text style={styles.title}>Enable Notifications</Text>
        <Text style={styles.body}>
          Stay updated with order status, special offers, and personalized
          recommendations.
        </Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.btn, phase === "requesting" && styles.btnMuted]}
          activeOpacity={0.85}
          disabled={phase === "requesting"}
          onPress={() => setPhase("requesting")}
        >
          <Text style={styles.btnText}>
            {phase === "requesting" ? "Requesting..." : "Enable Notifications"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Toast */}
      <Animated.View
        style={[
          styles.toast,
          { transform: [{ translateY: toastAnim }], opacity: toastOpacity },
        ]}
      >
        <Ionicons name="checkmark-circle" size={18} color="#22c55e" />
        <Text style={styles.toastText}>{toastMsg}</Text>
      </Animated.View>

      {/* OS-style permission dialog */}
      <Modal
        visible={phase === "requesting"}
        transparent
        animationType="fade"
        statusBarTranslucent
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              "Beepr" Would Like to Send You Notifications
            </Text>
            <Text style={styles.modalBody}>
              Beepr sends notifications about new product matches near you,
              order updates, and special promotions from your favorite
              dispensaries.
            </Text>
            <View style={styles.modalDividerH} />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalBtn}
                activeOpacity={0.6}
                onPress={() => handlePermission(false)}
              >
                <Text style={styles.modalBtnText}>Don't Allow</Text>
              </TouchableOpacity>
              <View style={styles.modalDividerV} />
              <TouchableOpacity
                style={styles.modalBtn}
                activeOpacity={0.6}
                onPress={() => handlePermission(true)}
              >
                <Text style={[styles.modalBtnText, styles.modalBtnAllow]}>
                  Allow
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },

  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 36,
    gap: 16,
  },
  bellWrap: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: PINK,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  title: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
  },
  body: {
    color: "#aaa",
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
  },

  footer: {
    paddingHorizontal: 24,
    paddingBottom: 56,
    paddingTop: 12,
  },
  btn: {
    backgroundColor: PINK,
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: "center",
  },
  btnMuted: { backgroundColor: "#7a1040" },
  btnText: { color: "#fff", fontWeight: "600", fontSize: 15 },

  // Toast
  toast: {
    position: "absolute",
    bottom: 32,
    left: 24,
    right: 24,
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  toastText: { color: "#fff", fontSize: 13, fontWeight: "500", flex: 1 },

  // Loading screen
  loadingContainer: {
    flex: 1,
    backgroundColor: BG,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: "#888",
    fontSize: 15,
    fontWeight: "500",
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  modalBox: {
    backgroundColor: "#1c1c1e",
    borderRadius: 14,
    overflow: "hidden",
    width: "100%",
  },
  modalTitle: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
  },
  modalBody: {
    color: "#aaa",
    fontSize: 13,
    lineHeight: 18,
    textAlign: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  modalDividerH: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#444",
  },
  modalActions: {
    flexDirection: "row",
  },
  modalDividerV: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: "#444",
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
  },
  modalBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "400",
  },
  modalBtnAllow: {
    color: PINK,
    fontWeight: "600",
  },
});
