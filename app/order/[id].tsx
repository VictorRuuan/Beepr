import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../../lib/supabase";

const PINK = "#c4185c";
const BG = "#130008";
const CARD = "#17131a";
const CARD_BORDER = "#2f1d2f";

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

export default function OrderDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [order, setOrder] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchOrder(id);
  }, [id]);

  const fetchOrder = async (orderId: string) => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        Alert.alert("Error", "Please sign in");
        router.replace("/");
        return;
      }

      const { data: orderData, error: orderErr } = await supabase
        .from("orders")
        .select(`
          id, order_number, status, payment_status, payment_method,
          total_amount, subtotal, tax, delivery_fee, delivery_method,
          delivery_address, delivery_instructions, customer_name,
          customer_email, customer_phone, created_at, updated_at,
          business:business_applications(id, business_name, business_phone, business_address)
        `)
        .eq("id", orderId)
        .eq("user_id", user.id)
        .single();

      if (orderErr || !orderData) {
        Alert.alert("Error", "Order not found");
        router.back();
        return;
      }
      setOrder(orderData);

      const { data: itemsData } = await supabase
        .from("order_items")
        .select(`id, product_id, quantity, unit_price, total_price, products(name, image_url)`)
        .eq("order_id", orderId);

      setItems(
        (itemsData ?? []).map((item: any) => ({
          ...item,
          product_name: item.products?.name ?? "Unknown Product",
          subtotal: item.total_price,
        }))
      );
    } catch {
      Alert.alert("Error", "Failed to load order details");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <StatusBar style="light" />
        <ActivityIndicator color={PINK} size="large" />
      </View>
    );
  }

  if (!order) return null;

  const statusColor = STATUS_COLORS[order.status] ?? { bg: "#33333322", text: "#aaa" };
  const business = order.business ?? {};
  const isSameTimestamp = order.created_at === order.updated_at;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Order Details</Text>
          <Text style={styles.headerSub}>{order.order_number}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusColor.bg }]}>
          <Text style={[styles.statusText, { color: statusColor.text }]}>
            {STATUS_LABELS[order.status] ?? order.status}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* Status/Dates card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Order Status</Text>
          <DetailRow
            icon="calendar-outline"
            label="Placed"
            value={formatDate(order.created_at)}
          />
          {!isSameTimestamp && (
            <DetailRow
              icon="time-outline"
              label="Last Updated"
              value={formatDate(order.updated_at)}
            />
          )}
        </View>

        {/* Business card */}
        <View style={styles.card}>
          <DetailRow icon="storefront-outline" label="Retailer" value={business.business_name ?? "—"}>
            {business.business_phone && (
              <TouchableOpacity
                onPress={() => Linking.openURL(`tel:${business.business_phone}`)}
                style={styles.phoneRow}
              >
                <Ionicons name="call-outline" size={13} color={PINK} />
                <Text style={styles.phoneText}>{business.business_phone}</Text>
              </TouchableOpacity>
            )}
            {business.business_address && (
              <View style={styles.addressRow}>
                <Ionicons name="location-outline" size={13} color="#888" />
                <Text style={styles.addressText}>{business.business_address}</Text>
              </View>
            )}
          </DetailRow>
        </View>

        {/* Delivery method */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Delivery Method</Text>
          <View style={styles.methodBadge}>
            <Text style={styles.methodText}>{order.delivery_method ?? "pickup"}</Text>
          </View>
          {order.delivery_address && (
            <Text style={styles.deliveryAddr}>{order.delivery_address}</Text>
          )}
          {order.delivery_instructions && (
            <Text style={styles.deliveryNotes}>Notes: {order.delivery_instructions}</Text>
          )}
        </View>

        {/* Items */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Items ({items.length})</Text>
          {items.map((item, idx) => (
            <View key={item.id ?? idx} style={styles.itemRow}>
              <View style={styles.itemLeft}>
                <Text style={styles.itemName}>{item.product_name}</Text>
                <Text style={styles.itemQty}>
                  {item.quantity} × ${item.unit_price?.toFixed(2)}
                </Text>
              </View>
              <Text style={styles.itemPrice}>${item.subtotal?.toFixed(2)}</Text>
            </View>
          ))}
          <View style={styles.divider} />
          <SummaryRow label="Subtotal" value={`$${order.subtotal?.toFixed(2) ?? "0.00"}`} />
          <SummaryRow label="Tax" value={`$${order.tax?.toFixed(2) ?? "0.00"}`} />
          {order.delivery_fee > 0 && (
            <SummaryRow
              label="Delivery Fee"
              value={`$${order.delivery_fee?.toFixed(2)}`}
            />
          )}
          <View style={styles.divider} />
          <SummaryRow
            label="Total"
            value={`$${order.total_amount?.toFixed(2) ?? "0.00"}`}
            bold
          />
        </View>

        {/* Payment */}
        <View style={styles.card}>
          <DetailRow icon="card-outline" label="Payment Method" value={order.payment_method ?? "cash"}>
            <View
              style={[
                styles.paymentBadge,
                {
                  backgroundColor:
                    order.payment_status === "paid" ? "#22c55e22" : "#facc1522",
                },
              ]}
            >
              <Text
                style={{
                  color: order.payment_status === "paid" ? "#4ade80" : "#facc15",
                  fontSize: 12,
                  fontWeight: "700",
                }}
              >
                {order.payment_status === "paid" ? "Paid" : "Pending Payment"}
              </Text>
            </View>
          </DetailRow>
        </View>

        {/* Customer info */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Customer Information</Text>
          <InfoField label="Name" value={order.customer_name} />
          <InfoField label="Email" value={order.customer_email} />
          <InfoField label="Phone" value={order.customer_phone} />
        </View>
      </ScrollView>

      {/* Bottom action */}
      {business.business_phone && (
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.callBtn}
            onPress={() => Linking.openURL(`tel:${business.business_phone}`)}
            activeOpacity={0.85}
          >
            <Ionicons name="call-outline" size={18} color="#fff" />
            <Text style={styles.callBtnText}>Contact Retailer</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

function DetailRow({
  icon,
  label,
  value,
  children,
}: {
  icon: string;
  label: string;
  value: string;
  children?: React.ReactNode;
}) {
  return (
    <View style={styles.detailRow}>
      <Ionicons name={icon as any} size={18} color="#888" style={{ width: 24, marginTop: 2 }} />
      <View style={styles.detailBody}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
        {children}
      </View>
    </View>
  );
}

function InfoField({ label, value }: { label: string; value?: string }) {
  return (
    <View style={styles.infoField}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value ?? "—"}</Text>
    </View>
  );
}

function SummaryRow({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <View style={styles.summaryRow}>
      <Text style={[styles.summaryLabel, bold && { color: "#fff", fontWeight: "700" }]}>
        {label}
      </Text>
      <Text style={[styles.summaryValue, bold && { color: PINK, fontSize: 17 }]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  centered: { justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 52,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: CARD_BORDER,
    gap: 10,
  },
  headerCenter: { flex: 1 },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },
  headerSub: { color: "#888", fontSize: 12 },
  statusBadge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  statusText: { fontSize: 11, fontWeight: "700" },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 100 },
  card: {
    backgroundColor: CARD,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    padding: 14,
    marginBottom: 12,
  },
  cardTitle: { color: "#fff", fontSize: 15, fontWeight: "700", marginBottom: 12 },
  detailRow: { flexDirection: "row", marginBottom: 10 },
  detailBody: { flex: 1 },
  detailLabel: { color: "#888", fontSize: 11, marginBottom: 2 },
  detailValue: { color: "#fff", fontSize: 14, fontWeight: "600" },
  phoneRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 },
  phoneText: { color: PINK, fontSize: 13 },
  addressRow: { flexDirection: "row", alignItems: "flex-start", gap: 4, marginTop: 4 },
  addressText: { color: "#888", fontSize: 12, flex: 1 },
  methodBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#2a1a2a",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 5,
    textTransform: "capitalize",
  },
  methodText: { color: "#aaa", fontSize: 13, textTransform: "capitalize" },
  deliveryAddr: { color: "#888", fontSize: 13, marginTop: 8 },
  deliveryNotes: { color: "#888", fontSize: 12, marginTop: 4 },
  itemRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  itemLeft: { flex: 1, marginRight: 8 },
  itemName: { color: "#fff", fontSize: 13, fontWeight: "600" },
  itemQty: { color: "#888", fontSize: 12, marginTop: 2 },
  itemPrice: { color: "#fff", fontSize: 13, fontWeight: "700" },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: CARD_BORDER, marginVertical: 10 },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  summaryLabel: { color: "#888", fontSize: 13 },
  summaryValue: { color: "#fff", fontSize: 13, fontWeight: "600" },
  paymentBadge: { borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4, marginTop: 6, alignSelf: "flex-start" },
  infoField: { marginBottom: 8 },
  infoLabel: { color: "#888", fontSize: 11, marginBottom: 2 },
  infoValue: { color: "#fff", fontSize: 14 },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: CARD,
    borderTopWidth: 1,
    borderTopColor: CARD_BORDER,
    padding: 16,
    paddingBottom: 32,
  },
  callBtn: {
    backgroundColor: PINK,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 13,
  },
  callBtnText: { color: "#fff", fontSize: 15, fontWeight: "700" },
});
