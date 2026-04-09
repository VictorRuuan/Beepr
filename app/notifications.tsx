import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
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

type NotifType = "product_match" | "deal_alert" | "order_update" | "general";
type TabType = "all" | "orders" | "deals";

const TYPE_ICONS: Record<NotifType, string> = {
  order_update: "bag-outline",
  deal_alert: "pricetag-outline",
  product_match: "locate-outline",
  general: "notifications-outline",
};

function timeAgo(dateStr: string): string {
  try {
    const ms = Date.now() - new Date(dateStr).getTime();
    const m = Math.floor(ms / 60000);
    if (m < 1) return "just now";
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  } catch {
    return "";
  }
}

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [deleting, setDeleting] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setNotifications(data ?? []);
    } catch {
      Alert.alert("Error", "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const handleClick = async (notif: any) => {
    if (!notif.read) {
      await supabase.rpc("mark_notification_as_read", {
        notification_id: notif.id,
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
      );
    }
    if (notif.deep_link) {
      router.push(notif.deep_link);
    }
  };

  const handleDelete = async (notifId: string) => {
    setDeleting((prev) => new Set(prev).add(notifId));
    try {
      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("id", notifId);
      if (error) throw error;
      setNotifications((prev) => prev.filter((n) => n.id !== notifId));
    } catch {
      Alert.alert("Error", "Failed to delete notification");
    } finally {
      setDeleting((prev) => {
        const s = new Set(prev);
        s.delete(notifId);
        return s;
      });
    }
  };

  const filtered =
    activeTab === "all"
      ? notifications
      : activeTab === "orders"
      ? notifications.filter((n) => n.type === "order_update")
      : notifications.filter(
          (n) => n.type === "deal_alert" || n.type === "product_match"
        );

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        {unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{unreadCount} new</Text>
          </View>
        )}
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {(["all", "orders", "deals"] as TabType[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabBtn, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[styles.tabText, activeTab === tab && styles.tabTextActive]}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator color={PINK} size="large" />
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
        >
          {filtered.length === 0 ? (
            <EmptyState tab={activeTab} />
          ) : (
            filtered.map((notif) => {
              const icon =
                TYPE_ICONS[notif.type as NotifType] ?? "notifications-outline";
              const isDeleting = deleting.has(notif.id);
              return (
                <TouchableOpacity
                  key={notif.id}
                  style={[
                    styles.notifCard,
                    !notif.read && styles.notifCardUnread,
                    isDeleting && { opacity: 0.4 },
                  ]}
                  onPress={() => handleClick(notif)}
                  activeOpacity={0.82}
                >
                  <View
                    style={[
                      styles.iconWrap,
                      { backgroundColor: notif.read ? "#2a1a2a" : `${PINK}33` },
                    ]}
                  >
                    <Ionicons
                      name={icon as any}
                      size={20}
                      color={notif.read ? "#888" : PINK}
                    />
                  </View>
                  <View style={styles.notifBody}>
                    <View style={styles.notifTopRow}>
                      <Text style={styles.notifTitle} numberOfLines={1}>
                        {notif.title}
                      </Text>
                      <View style={styles.notifRight}>
                        {!notif.read && <View style={styles.dot} />}
                        <TouchableOpacity
                          onPress={() => handleDelete(notif.id)}
                          disabled={isDeleting}
                          hitSlop={8}
                        >
                          {isDeleting ? (
                            <ActivityIndicator size="small" color="#888" />
                          ) : (
                            <Ionicons name="close" size={16} color="#555" />
                          )}
                        </TouchableOpacity>
                      </View>
                    </View>
                    <Text style={styles.notifBody2} numberOfLines={2}>
                      {notif.body}
                    </Text>
                    <View style={styles.notifTimeRow}>
                      <Ionicons name="time-outline" size={12} color="#555" />
                      <Text style={styles.notifTime}>
                        {timeAgo(notif.created_at)}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>
      )}
    </View>
  );
}

function EmptyState({ tab }: { tab: TabType }) {
  const icons: Record<TabType, string> = {
    all: "notifications-outline",
    orders: "bag-outline",
    deals: "pricetag-outline",
  };
  const messages: Record<TabType, string> = {
    all: "We'll notify you about orders, deals, and product matches",
    orders: "No order notifications yet",
    deals: "No deal notifications yet",
  };
  return (
    <View style={styles.empty}>
      <Ionicons name={icons[tab] as any} size={56} color="#333" />
      <Text style={styles.emptyTitle}>No notifications</Text>
      <Text style={styles.emptySub}>{messages[tab]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 12,
  },
  headerTitle: { color: "#fff", fontSize: 24, fontWeight: "800" },
  unreadBadge: {
    backgroundColor: `${PINK}33`,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  unreadText: { color: PINK, fontSize: 12, fontWeight: "700" },
  tabRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: CARD_BORDER,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: CARD_BORDER,
  },
  tabActive: { borderColor: PINK, backgroundColor: `${PINK}22` },
  tabText: { color: "#888", fontSize: 13, fontWeight: "600" },
  tabTextActive: { color: PINK },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 40 },
  notifCard: {
    flexDirection: "row",
    backgroundColor: CARD,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    padding: 12,
    marginBottom: 10,
    gap: 12,
  },
  notifCardUnread: { borderColor: `${PINK}44` },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  notifBody: { flex: 1 },
  notifTopRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  notifTitle: { flex: 1, color: "#fff", fontSize: 14, fontWeight: "700" },
  notifRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: PINK },
  notifBody2: { color: "#888", fontSize: 13, lineHeight: 18, marginBottom: 6 },
  notifTimeRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  notifTime: { color: "#555", fontSize: 11 },
  empty: { alignItems: "center", paddingTop: 80, gap: 12 },
  emptyTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },
  emptySub: { color: "#888", fontSize: 14, textAlign: "center", paddingHorizontal: 32 },
});
