import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
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

type OrderStatus =
  | "pending"
  | "pending_payment"
  | "confirmed"
  | "preparing"
  | "ready"
  | "in_transit"
  | "delivered"
  | "completed"
  | "cancelled";

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  pending_payment: "Pending Payment",
  confirmed: "Confirmed",
  preparing: "Preparing",
  ready: "Ready for Pickup",
  in_transit: "Out for Delivery",
  delivered: "Delivered",
  completed: "Completed",
  cancelled: "Cancelled",
};

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  pending: { bg: "#facc1522", text: "#facc15" },
  pending_payment: { bg: "#facc1522", text: "#facc15" },
  confirmed: { bg: "#3b82f622", text: "#60a5fa" },
  preparing: { bg: "#a855f722", text: "#c084fc" },
  ready: { bg: "#22c55e22", text: "#4ade80" },
  in_transit: { bg: "#f9731622", text: "#fb923c" },
  delivered: { bg: "#6b728022", text: "#9ca3af" },
  completed: { bg: "#6b728022", text: "#9ca3af" },
  cancelled: { bg: "#ef444422", text: "#f87171" },
};

const ACTIVE_STATUSES = new Set([
  "pending", "pending_payment", "confirmed", "preparing", "ready", "in_transit",
]);

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

export default function OrdersScreen() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<"active" | "completed">("active");

  const fetchOrders = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        Alert.alert("Error", "Please sign in to view orders");
        return;
      }
      const { data, error } = await supabase
        .from("orders")
        .select(`
          id, order_number, status, payment_status,
          total_amount, delivery_method, created_at,
          business:business_applications(id, business_name)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders((data as any[]) ?? []);
    } catch {
      Alert.alert("Error", "Failed to load orders");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    const channel = supabase
      .channel("orders-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        () => fetchOrders(true)
      )
      .subscribe();

    return () => { channel.unsubscribe(); };
  }, []);

  const activeOrders = orders.filter((o) => ACTIVE_STATUSES.has(o.status));
  const completedOrders = orders.filter((o) => !ACTIVE_STATUSES.has(o.status));
  const displayed = activeTab === "active" ? activeOrders : completedOrders;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Orders</Text>
          <Text style={styles.headerSub}>
            {orders.length} total order{orders.length !== 1 ? "s" : ""}
          </Text>
        </View>
        <TouchableOpacity onPress={() => fetchOrders(true)} hitSlop={8}>
          <Ionicons
            name="refresh"
            size={22}
            color={refreshing ? PINK : "#888"}
          />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === "active" && styles.tabActive]}
          onPress={() => setActiveTab("active")}
        >
          <Text
            style={[styles.tabText, activeTab === "active" && styles.tabTextActive]}
          >
            Active ({activeOrders.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === "completed" && styles.tabActive]}
          onPress={() => setActiveTab("completed")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "completed" && styles.tabTextActive,
            ]}
          >
            History ({completedOrders.length})
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator color={PINK} size="large" />
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchOrders(true)}
              tintColor={PINK}
            />
          }
        >
          {displayed.length === 0 ? (
            <OrdersEmptyState
              tab={activeTab}
              onBrowse={() => router.replace("/")}
            />
          ) : (
            displayed.map((order) => (
              <TouchableOpacity
                key={order.id}
                style={styles.card}
                onPress={() => router.push(`/order/${order.id}`)}
                activeOpacity={0.85}
              >
                <View style={styles.cardTop}>
                  <View style={styles.cardTopLeft}>
                    <Text style={styles.orderNumber}>{order.order_number}</Text>
                    <Text style={styles.businessName}>
                      {order.business?.business_name ?? "Unknown Dispensary"}
                    </Text>
                  </View>
                  <StatusBadge status={order.status} />
                </View>
                <View style={styles.cardBottom}>
                  <Text style={styles.dateText}>
                    {formatDate(order.created_at)}
                  </Text>
                  <Text style={styles.totalText}>
                    ${order.total_amount?.toFixed(2) ?? "0.00"}
                  </Text>
                </View>
                <View style={styles.methodRow}>
                  <View style={styles.methodBadge}>
                    <Text style={styles.methodText}>
                      {order.delivery_method ?? "pickup"}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors = STATUS_COLORS[status] ?? { bg: "#33333322", text: "#aaa" };
  return (
    <View style={[styles.statusBadge, { backgroundColor: colors.bg }]}>
      <Text style={[styles.statusText, { color: colors.text }]}>
        {STATUS_LABELS[status] ?? status}
      </Text>
    </View>
  );
}

function OrdersEmptyState({
  tab,
  onBrowse,
}: {
  tab: "active" | "completed";
  onBrowse: () => void;
}) {
  return (
    <View style={styles.empty}>
      <Ionicons name="bag-outline" size={56} color="#333" />
      <Text style={styles.emptyTitle}>
        {tab === "active" ? "No active orders" : "No completed orders"}
      </Text>
      <Text style={styles.emptySub}>
        {tab === "active"
          ? "Start shopping to place your first order!"
          : "Your completed orders will appear here."}
      </Text>
      {tab === "active" && (
        <TouchableOpacity style={styles.browseBtn} onPress={onBrowse}>
          <Text style={styles.browseBtnText}>Browse Products</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  headerTitle: { color: "#fff", fontSize: 24, fontWeight: "800" },
  headerSub: { color: "#888", fontSize: 13, marginTop: 2 },
  tabRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: CARD_BORDER,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 9,
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
  card: {
    backgroundColor: CARD,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    padding: 14,
    marginBottom: 10,
  },
  cardTop: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  cardTopLeft: { flex: 1, marginRight: 8 },
  orderNumber: { color: "#fff", fontSize: 15, fontWeight: "700" },
  businessName: { color: "#888", fontSize: 13, marginTop: 2 },
  statusBadge: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: "flex-start",
  },
  statusText: { fontSize: 12, fontWeight: "700" },
  cardBottom: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  dateText: { color: "#666", fontSize: 12 },
  totalText: { color: PINK, fontSize: 15, fontWeight: "700" },
  methodRow: { marginTop: 8 },
  methodBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#2a1a2a",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  methodText: { color: "#aaa", fontSize: 11, textTransform: "capitalize" },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", paddingTop: 80, gap: 12 },
  emptyTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },
  emptySub: { color: "#888", fontSize: 14, textAlign: "center", paddingHorizontal: 32 },
  browseBtn: {
    backgroundColor: PINK,
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 10,
    marginTop: 4,
  },
  browseBtnText: { color: "#fff", fontSize: 14, fontWeight: "700" },
});
