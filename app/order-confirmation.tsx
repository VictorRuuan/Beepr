import React, { useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const PINK = "#c4185c";
const BG = "#130008";
const CARD = "#17131a";
const CARD_BORDER = "#2f1d2f";

export default function OrderConfirmationScreen() {
  const router = useRouter();
  const { orderJson } = useLocalSearchParams<{ orderJson: string }>();

  const orderData = (() => {
    try {
      return orderJson ? JSON.parse(orderJson) : null;
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    if (!orderData) {
      router.replace("/");
    }
  }, [orderData]);

  if (!orderData) return null;

  const order = orderData.order ?? orderData;
  const paymentInstructions = orderData.payment_instructions;
  const totals = order.totals ?? {};
  const items: any[] = order.items ?? [];
  const business = order.business ?? {};

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Success hero */}
        <View style={styles.hero}>
          <View style={styles.checkCircle}>
            <Ionicons name="checkmark-circle" size={72} color={PINK} />
          </View>
          <Text style={styles.heroTitle}>Order Placed!</Text>
          <Text style={styles.heroSub}>
            Your order has been sent to the retailer
          </Text>
          <View style={styles.orderNumBox}>
            <Text style={styles.orderNumLabel}>Order Number</Text>
            <Text style={styles.orderNum}>{order.order_number ?? "—"}</Text>
          </View>
        </View>

        {/* What to Bring */}
        <View style={[styles.card, styles.pinkBorderCard]}>
          <View style={styles.cardTitleRow}>
            <Ionicons name="card-outline" size={22} color={PINK} />
            <Text style={styles.cardTitle}>What to Bring</Text>
          </View>
          <BringItem
            icon="id-card-outline"
            title="Valid Government ID"
            desc="Driver's license, passport, or other government-issued photo ID to verify you are 21+"
          />
          <BringItem
            icon="wallet-outline"
            title="Payment Method"
            desc={
              paymentInstructions?.accepted_payment_methods
                ?.join(", ")
                .toUpperCase() ?? "Cash, Debit, E-Transfer"
            }
            extra={`Total: $${totals.total?.toFixed(2) ?? "0.00"}`}
          />
        </View>

        {/* Order Details */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Order Details</Text>

          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Status</Text>
            <View style={styles.pendingBadge}>
              <Text style={styles.pendingText}>Pending Payment</Text>
            </View>
          </View>
          <View style={styles.divider} />

          {/* Business */}
          <View style={styles.infoRow}>
            <Ionicons name="storefront-outline" size={18} color="#888" />
            <View style={styles.infoBody}>
              <Text style={styles.infoLabel}>Retailer</Text>
              <Text style={styles.infoValue}>{business.name ?? "—"}</Text>
              {business.phone && (
                <TouchableOpacity
                  onPress={() => Linking.openURL(`tel:${business.phone}`)}
                  style={styles.phoneLink}
                >
                  <Ionicons name="call-outline" size={13} color={PINK} />
                  <Text style={styles.phoneLinkText}>{business.phone}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          <View style={styles.divider} />

          {/* Items */}
          <Text style={styles.subLabel}>Items ({items.length})</Text>
          {items.map((item, idx) => (
            <View key={idx} style={styles.itemRow}>
              <Text style={styles.itemText} numberOfLines={1}>
                {item.quantity}x {item.product_name ?? "Product"}
              </Text>
              <Text style={styles.itemPrice}>
                ${item.subtotal?.toFixed(2) ?? "0.00"}
              </Text>
            </View>
          ))}
          <View style={styles.divider} />

          {/* Totals */}
          <SummaryRow label="Subtotal" value={`$${totals.subtotal?.toFixed(2) ?? "0.00"}`} />
          <SummaryRow label="Tax" value={`$${totals.tax?.toFixed(2) ?? "0.00"}`} />
          {order.delivery?.method === "delivery" && (
            <SummaryRow
              label="Delivery Fee"
              value={`$${totals.delivery_fee?.toFixed(2) ?? "0.00"}`}
            />
          )}
          <View style={styles.divider} />
          <SummaryRow
            label="Total"
            value={`$${totals.total?.toFixed(2) ?? "0.00"}`}
            bold
          />
        </View>

        {/* Next Steps */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Next Steps</Text>
          {NEXT_STEPS.map((step, i) => (
            <View key={i} style={styles.stepRow}>
              <View style={styles.stepNum}>
                <Text style={styles.stepNumText}>{i + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom actions */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => router.push("/orders")}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryBtnText}>View Order Status</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => router.replace("/")}
          activeOpacity={0.85}
        >
          <Text style={styles.secondaryBtnText}>Continue Shopping</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const NEXT_STEPS = [
  "The retailer will review your order and contact you to confirm availability.",
  "Head to the store with your valid ID and payment ready.",
  "Payment will be processed directly with the retailer, not through this app.",
  "Track your order status in the Orders tab.",
  "Once received, leave a review to help the community.",
];

function BringItem({
  icon,
  title,
  desc,
  extra,
}: {
  icon: string;
  title: string;
  desc: string;
  extra?: string;
}) {
  return (
    <View style={styles.bringItem}>
      <Ionicons name={icon as any} size={20} color={PINK} style={{ marginTop: 2 }} />
      <View style={styles.bringBody}>
        <Text style={styles.bringTitle}>{title}</Text>
        <Text style={styles.bringDesc}>{desc}</Text>
        {extra && <Text style={styles.bringExtra}>{extra}</Text>}
      </View>
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
      <Text style={[styles.summaryLabel, bold && styles.labelBold]}>{label}</Text>
      <Text style={[styles.summaryValue, bold && styles.valueBold]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 140 },
  hero: {
    alignItems: "center",
    paddingTop: 56,
    paddingBottom: 28,
    paddingHorizontal: 24,
    backgroundColor: `${PINK}0d`,
  },
  checkCircle: { marginBottom: 12 },
  heroTitle: { color: "#fff", fontSize: 28, fontWeight: "800", marginBottom: 6 },
  heroSub: { color: "#aaa", fontSize: 14, marginBottom: 16, textAlign: "center" },
  orderNumBox: {
    backgroundColor: CARD,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: CARD_BORDER,
  },
  orderNumLabel: { color: "#888", fontSize: 12, marginBottom: 2 },
  orderNum: { color: PINK, fontSize: 22, fontWeight: "800" },
  card: {
    backgroundColor: CARD,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 12,
  },
  pinkBorderCard: { borderColor: `${PINK}66` },
  cardTitleRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 14 },
  cardTitle: { color: "#fff", fontSize: 16, fontWeight: "700", marginBottom: 12 },
  bringItem: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: "#0d000d",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  bringBody: { flex: 1 },
  bringTitle: { color: "#fff", fontSize: 14, fontWeight: "700", marginBottom: 3 },
  bringDesc: { color: "#888", fontSize: 13, lineHeight: 18 },
  bringExtra: { color: PINK, fontSize: 13, fontWeight: "700", marginTop: 4 },
  statusRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  statusLabel: { color: "#888", fontSize: 13 },
  pendingBadge: {
    backgroundColor: "#facc1522",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#facc1544",
  },
  pendingText: { color: "#facc15", fontSize: 12, fontWeight: "700" },
  infoRow: { flexDirection: "row", gap: 12, marginBottom: 4 },
  infoBody: { flex: 1 },
  infoLabel: { color: "#888", fontSize: 12, marginBottom: 2 },
  infoValue: { color: "#fff", fontSize: 14, fontWeight: "600" },
  phoneLink: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 },
  phoneLinkText: { color: PINK, fontSize: 13 },
  subLabel: { color: "#888", fontSize: 13, marginBottom: 8 },
  itemRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  itemText: { color: "#ccc", fontSize: 13, flex: 1, marginRight: 8 },
  itemPrice: { color: "#fff", fontSize: 13, fontWeight: "600" },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: CARD_BORDER, marginVertical: 10 },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  summaryLabel: { color: "#888", fontSize: 14 },
  summaryValue: { color: "#fff", fontSize: 14 },
  labelBold: { color: "#fff", fontWeight: "700" },
  valueBold: { color: PINK, fontSize: 18, fontWeight: "800" },
  stepRow: { flexDirection: "row", gap: 12, marginBottom: 12 },
  stepNum: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: `${PINK}33`,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
    marginTop: 1,
  },
  stepNumText: { color: PINK, fontSize: 12, fontWeight: "700" },
  stepText: { color: "#aaa", fontSize: 13, flex: 1, lineHeight: 20 },
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
    gap: 8,
  },
  primaryBtn: {
    backgroundColor: PINK,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: "center",
  },
  primaryBtnText: { color: "#fff", fontSize: 15, fontWeight: "700" },
  secondaryBtn: {
    backgroundColor: "transparent",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: CARD_BORDER,
  },
  secondaryBtnText: { color: "#ccc", fontSize: 15 },
});
