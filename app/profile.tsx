import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../lib/supabase";

const PINK = "#c4185c";
const BG = "#130008";
const CARD = "#17131a";
const CARD_BORDER = "#2f1d2f";
const SUPABASE_URL = "https://slhubwjeofitlmywworo.supabase.co";

function resolveAvatar(url?: string | null): string | undefined {
  if (!url) return undefined;
  if (url.startsWith("http")) return url;
  return `${SUPABASE_URL}/storage/v1/object/public/avatars/${url}`;
}

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "–";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  } catch {
    return dateStr;
  }
}

export default function ProfileScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("get-profile");
      if (error) throw error;
      setProfile(data?.profile ?? null);
    } catch {
      Alert.alert("Error", "Could not load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await supabase.auth.signOut();
          router.replace("/");
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <StatusBar style="light" />
        <ActivityIndicator color={PINK} size="large" />
      </View>
    );
  }

  const avatarUrl = resolveAvatar(profile?.avatar_url);
  const displayName = profile?.display_name || "Anonymous User";

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>

        {/* Hero / Avatar */}
        <View style={styles.hero}>
          <View style={styles.avatarWrap}>
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatar} resizeMode="cover" />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Text style={styles.avatarInitial}>
                  {displayName.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
          </View>
          <Text style={styles.displayName}>{displayName}</Text>
          <Text style={styles.email}>{profile?.email ?? ""}</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <TouchableOpacity
            style={styles.statItem}
            onPress={() => router.push("/favorites")}
            activeOpacity={0.7}
          >
            <Ionicons name="heart" size={20} color={PINK} />
            <Text style={styles.statValue}>{profile?.favorites_count ?? 0}</Text>
            <Text style={styles.statLabel}>Favorites</Text>
          </TouchableOpacity>
          <View style={[styles.statItem, styles.statBorder]}>
            <Ionicons name="star" size={20} color={PINK} />
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Reviews</Text>
          </View>
          <TouchableOpacity
            style={styles.statItem}
            onPress={() => router.push("/orders")}
            activeOpacity={0.7}
          >
            <Ionicons name="bag" size={20} color={PINK} />
            <Text style={styles.statValue}>{profile?.orders_count ?? 0}</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </TouchableOpacity>
        </View>

        {/* Personal Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.infoCard}>
            <InfoRow icon="call-outline" label="Phone" value={profile?.phone_number ?? "–"} />
            <View style={styles.separator} />
            <InfoRow icon="mail-outline" label="Email" value={profile?.email ?? "–"} />
            <View style={styles.separator} />
            <InfoRow icon="calendar-outline" label="Date of Birth" value={formatDate(profile?.date_of_birth)} />
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.infoCard}>
            <MenuRow
              icon="person-outline"
              label="Account Settings"
              onPress={() => router.push("/account-settings")}
            />
            <View style={styles.separator} />
            <MenuRow
              icon="options-outline"
              label="Preferences"
              onPress={() => router.push("/preferences")}
            />
            <View style={styles.separator} />
            <MenuRow
              icon="log-out-outline"
              label="Sign Out"
              onPress={handleSignOut}
              destructive
            />
          </View>
        </View>

        {/* App version */}
        <Text style={styles.appVersion}>beepr · v1.0.0</Text>

      </ScrollView>
    </View>
  );
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Ionicons name={icon as any} size={16} color="#888" style={{ width: 22 }} />
      <View style={styles.rowBody}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue}>{value}</Text>
      </View>
    </View>
  );
}

function MenuRow({
  icon,
  label,
  onPress,
  destructive,
}: {
  icon: string;
  label: string;
  onPress: () => void;
  destructive?: boolean;
}) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
      <Ionicons
        name={icon as any}
        size={18}
        color={destructive ? PINK : "#888"}
        style={{ width: 26 }}
      />
      <Text style={[styles.menuLabel, destructive && { color: PINK }]}>{label}</Text>
      {!destructive && <Ionicons name="chevron-forward" size={16} color="#888" />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  centered: { justifyContent: "center", alignItems: "center" },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  hero: { alignItems: "center", paddingTop: 56, paddingBottom: 24, paddingHorizontal: 20 },
  avatarWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 3,
    borderColor: PINK,
    overflow: "hidden",
    marginBottom: 12,
  },
  avatar: { width: 82, height: 82 },
  avatarPlaceholder: {
    backgroundColor: `${PINK}33`,
    justifyContent: "center",
    alignItems: "center",
    width: 82,
    height: 82,
  },
  avatarInitial: { color: PINK, fontSize: 32, fontWeight: "800" },
  displayName: { color: "#fff", fontSize: 20, fontWeight: "800", marginBottom: 4 },
  email: { color: "#888", fontSize: 13 },
  statsRow: {
    flexDirection: "row",
    marginHorizontal: 16,
    backgroundColor: CARD,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    marginBottom: 12,
    overflow: "hidden",
  },
  statItem: { flex: 1, alignItems: "center", paddingVertical: 16, gap: 4 },
  statBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: CARD_BORDER,
  },
  statValue: { color: "#fff", fontSize: 20, fontWeight: "800" },
  statLabel: { color: "#888", fontSize: 12 },
  section: { paddingHorizontal: 16, marginTop: 4, marginBottom: 8 },
  sectionTitle: { color: "#aaa", fontSize: 12, fontWeight: "700", letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 10, marginLeft: 2 },
  infoCard: {
    backgroundColor: CARD,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    overflow: "hidden",
  },
  row: { flexDirection: "row", alignItems: "center", padding: 14 },
  rowBody: { flex: 1, marginLeft: 8 },
  rowLabel: { color: "#888", fontSize: 11, marginBottom: 2 },
  rowValue: { color: "#fff", fontSize: 14 },
  menuLabel: { flex: 1, color: "#fff", fontSize: 15, marginLeft: 2 },
  separator: { height: StyleSheet.hairlineWidth, backgroundColor: CARD_BORDER, marginLeft: 46 },
  appVersion: { color: "#333", fontSize: 12, textAlign: "center", marginTop: 16 },
});
