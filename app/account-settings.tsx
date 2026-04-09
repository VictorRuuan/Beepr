import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Linking,
  Image,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
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

export default function AccountSettingsScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [displayName, setDisplayName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("get-profile");
      if (error) throw error;
      const p = data?.profile ?? null;
      setProfile(p);
      setDisplayName(p?.display_name ?? "");
      setNewEmail(p?.email ?? "");
    } catch {
      Alert.alert("Error", "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePickAvatar = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Permission required", "Allow access to your photo library.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (result.canceled || !result.assets?.[0]) return;

    setUpdating(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const asset = result.assets[0];
      const ext = asset.uri.split(".").pop() ?? "jpg";
      const fileName = `${user.id}-${Date.now()}.${ext}`;

      const response = await fetch(asset.uri);
      const blob = await response.blob();

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, blob, { contentType: `image/${ext}`, upsert: true });
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("user_id", user.id);

      await loadProfile();
      Alert.alert("Success", "Profile photo updated");
    } catch (err: any) {
      Alert.alert("Error", err?.message ?? "Failed to update photo");
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateName = async () => {
    if (!displayName.trim()) {
      Alert.alert("Error", "Name cannot be empty");
      return;
    }
    setUpdating(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      await supabase
        .from("profiles")
        .update({ display_name: displayName.trim() })
        .eq("user_id", user.id);
      Alert.alert("Success", "Name updated");
      await loadProfile();
    } catch (err: any) {
      Alert.alert("Error", err?.message ?? "Failed to update name");
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateEmail = async () => {
    if (!newEmail.trim() || newEmail === profile?.email) {
      Alert.alert("Error", "Enter a different email address");
      return;
    }
    setUpdating(true);
    try {
      const { error } = await supabase.auth.updateUser({ email: newEmail });
      if (error) throw error;
      Alert.alert("Success", "Verification email sent. Check your inbox.");
    } catch (err: any) {
      Alert.alert("Error", err?.message ?? "Failed to update email");
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert("Error", "Enter and confirm your new password");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }
    setUpdating(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setNewPassword("");
      setConfirmPassword("");
      Alert.alert("Success", "Password updated");
    } catch (err: any) {
      Alert.alert("Error", err?.message ?? "Failed to update password");
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "This action is irreversible. All your data will be permanently deleted.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete Account",
          style: "destructive",
          onPress: async () => {
            try {
              const { error } = await supabase.functions.invoke("delete-account");
              if (error) throw error;
              await supabase.auth.signOut();
              router.replace("/");
            } catch (err: any) {
              Alert.alert("Error", err?.message ?? "Failed to delete account");
            }
          },
        },
      ]
    );
  };

  const handleContactSupport = () => {
    const subj = encodeURIComponent("Beepr Support Request");
    const body = encodeURIComponent(
      `Hi Beepr Support,\n\nI need help with:\n\n[Describe issue here]\n\nUser: ${profile?.email}`
    );
    Linking.openURL(`mailto:developer.beepr@gmail.com?subject=${subj}&body=${body}`);
  };

  const avatarUrl = resolveAvatar(profile?.avatar_url);
  const initials = (profile?.display_name ?? profile?.email ?? "U")
    .charAt(0)
    .toUpperCase();

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <StatusBar style="light" />
        <ActivityIndicator color={PINK} size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Account Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <TouchableOpacity onPress={handlePickAvatar} style={styles.avatarWrap} disabled={updating}>
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatar} resizeMode="cover" />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Text style={styles.avatarInitial}>{initials}</Text>
              </View>
            )}
            <View style={styles.editBadge}>
              <Ionicons name="camera" size={14} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text style={styles.avatarHint}>Tap to update photo</Text>
        </View>

        {/* Display name */}
        <SectionCard title="Display Name" icon="person-outline">
          <TextInput
            style={styles.input}
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="Enter your name"
            placeholderTextColor="#555"
          />
          <ActionBtn
            label="Update Name"
            onPress={handleUpdateName}
            loading={updating}
            disabled={!displayName.trim()}
          />
        </SectionCard>

        {/* Email */}
        <SectionCard title="Email Address" icon="mail-outline">
          <TextInput
            style={styles.input}
            value={newEmail}
            onChangeText={setNewEmail}
            placeholder="Enter new email"
            placeholderTextColor="#555"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <ActionBtn
            label="Update Email"
            onPress={handleUpdateEmail}
            loading={updating}
            disabled={!newEmail.trim() || newEmail === profile?.email}
          />
        </SectionCard>

        {/* Password */}
        <SectionCard title="Change Password" icon="lock-closed-outline">
          <TextInput
            style={[styles.input, { marginBottom: 10 }]}
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="New password"
            placeholderTextColor="#555"
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm new password"
            placeholderTextColor="#555"
            secureTextEntry
          />
          <ActionBtn
            label="Update Password"
            onPress={handleUpdatePassword}
            loading={updating}
            disabled={!newPassword || !confirmPassword}
          />
        </SectionCard>

        {/* Support */}
        <SectionCard title="Support" icon="help-circle-outline">
          <TouchableOpacity style={styles.outlineBtn} onPress={handleContactSupport}>
            <Ionicons name="mail-outline" size={16} color="#ccc" />
            <Text style={styles.outlineBtnText}>Contact Support</Text>
          </TouchableOpacity>
          <Text style={styles.supportEmail}>developer.beepr@gmail.com</Text>
        </SectionCard>

        {/* Legal */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Legal</Text>
          <LegalRow label="Privacy Policy" onPress={() => {}} />
          <View style={styles.divider} />
          <LegalRow label="Terms of Use" onPress={() => {}} />
        </View>

        {/* Danger zone */}
        <View style={[styles.card, styles.dangerCard]}>
          <View style={styles.dangerHeader}>
            <Ionicons name="warning-outline" size={18} color="#f87171" />
            <Text style={styles.dangerTitle}>Danger Zone</Text>
          </View>
          <Text style={styles.dangerDesc}>
            Once you delete your account, there is no going back. All data will be permanently removed.
          </Text>
          <TouchableOpacity style={styles.deleteBtn} onPress={handleDeleteAccount}>
            <Text style={styles.deleteBtnText}>Delete Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

function SectionCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.cardTitleRow}>
        <Ionicons name={icon as any} size={18} color={PINK} />
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

function ActionBtn({
  label,
  onPress,
  loading,
  disabled,
}: {
  label: string;
  onPress: () => void;
  loading: boolean;
  disabled?: boolean;
}) {
  return (
    <TouchableOpacity
      style={[styles.actionBtn, (disabled || loading) && styles.actionBtnDisabled]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator color="#fff" size="small" />
      ) : (
        <Text style={styles.actionBtnText}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

function LegalRow({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.legalRow} onPress={onPress}>
      <Text style={styles.legalText}>{label}</Text>
      <Ionicons name="chevron-forward" size={16} color="#888" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  centered: { justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 52,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: CARD_BORDER,
  },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 48 },
  avatarSection: { alignItems: "center", marginBottom: 16 },
  avatarWrap: { position: "relative", width: 96, height: 96, marginBottom: 8 },
  avatar: { width: 96, height: 96, borderRadius: 48, borderWidth: 3, borderColor: PINK },
  avatarPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: `${PINK}33`,
  },
  avatarInitial: { color: PINK, fontSize: 36, fontWeight: "800" },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: PINK,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarHint: { color: "#888", fontSize: 12 },
  card: {
    backgroundColor: CARD,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    padding: 16,
    marginBottom: 12,
  },
  dangerCard: { borderColor: "#f8717144" },
  cardTitleRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 },
  cardTitle: { color: "#fff", fontSize: 15, fontWeight: "700", marginBottom: 12 },
  input: {
    backgroundColor: "#0d000d",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    color: "#fff",
    fontSize: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
  },
  actionBtn: {
    backgroundColor: PINK,
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: "center",
  },
  actionBtnDisabled: { opacity: 0.4 },
  actionBtnText: { color: "#fff", fontSize: 14, fontWeight: "700" },
  outlineBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    borderRadius: 10,
    paddingVertical: 11,
  },
  outlineBtnText: { color: "#ccc", fontSize: 14 },
  supportEmail: { color: "#888", fontSize: 12, textAlign: "center", marginTop: 6 },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: CARD_BORDER, marginVertical: 4 },
  legalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  legalText: { color: "#ccc", fontSize: 14 },
  dangerHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  dangerTitle: { color: "#f87171", fontSize: 15, fontWeight: "700" },
  dangerDesc: { color: "#888", fontSize: 13, lineHeight: 19, marginBottom: 12 },
  deleteBtn: {
    borderWidth: 1,
    borderColor: "#f87171",
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: "center",
  },
  deleteBtnText: { color: "#f87171", fontSize: 14, fontWeight: "700" },
});
