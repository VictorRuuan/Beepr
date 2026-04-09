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

export default function CheckoutScreen() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [taxRate, setTaxRate] = useState(10);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("manage-cart", {
        body: { action: "get" },
      });
      if (error) throw error;
      const items = data?.cart_items ?? data?.items ?? [];
      if (items.length === 0) {
        router.replace("/cart");
        return;
      }
      setCartItems(items);

      // Fetch jurisdiction tax for first item's business
      const businessId =
        items[0]?.products?.business_id ?? items[0]?.business_id;
      if (businessId) {
        await fetchTaxRate(businessId);
      }
    } catch {
      Alert.alert("Error", "Could not load cart");
    } finally {
      setLoading(false);
    }
  };

  const fetchTaxRate = async (businessId: string) => {
    try {
      const { data } = await supabase.functions.invoke("get-jurisdiction-tax", {
        body: { business_id: businessId },
      });
      if (data?.tax_rate) setTaxRate(data.tax_rate);
    } catch {
      // fallback remains 10%
    }
  };

  const getSubtotal = () =>
    cartItems.reduce((sum, item) => {
      const p = item.products ?? item;
      const price =
        p.discount_price && p.discount_price > 0 && p.discount_price < p.price
          ? p.discount_price
          : p.price ?? 0;
      return sum + price * (item.quantity ?? 1);
    }, 0);

  const subtotal = getSubtotal();
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax;

  const handlePlaceOrder = async () => {
    setProcessing(true);
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) {
        Alert.alert("Error", "Please sign in to continue");
        return;
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select("display_name, phone_number")
        .eq("user_id", user.id)
        .single();

      const customerName =
        profileData?.display_name ?? user.email?.split("@")[0] ?? "Customer";
      const customerPhone =
        profileData?.phone_number ?? user.phone ?? "000-000-0000";

      const { data, error } = await supabase.functions.invoke("process-order", {
        body: {
          customer_name: customerName,
          customer_phone: customerPhone,
          customer_email: user.email ?? "",
          delivery_method: "pickup",
          selected_payment_method: "cash",
        },
      });

      if (error) throw error;

      router.replace({
        pathname: "/order-confirmation",
        params: { orderJson: JSON.stringify(data) },
      });
    } catch (err: any) {
      Alert.alert("Error", err?.message ?? "Failed to place order");
    } finally {
      setProcessing(false);
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

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Order Summary Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Order Summary</Text>
          <View style={styles.divider} />
          {cartItems.map((item, idx) => {
            const p = item.products ?? item;
            const price =
              p.discount_price &&
              p.discount_price > 0 &&
              p.discount_price < p.price
                ? p.discount_price
                : p.price ?? 0;
            return (
              <View key={item.id ?? idx} style={styles.lineRow}>
                <Text style={styles.lineLabel} numberOfLines={1}>
                  {item.quantity}x {p.name}
                </Text>
                <Text style={styles.lineValue}>
                  ${(price * item.quantity).toFixed(2)}
                </Text>
              </View>
            );
          })}
          <View style={styles.divider} />
          <SummaryRow label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
          <SummaryRow
            label={`Tax (${taxRate.toFixed(1)}%)`}
            value={`$${tax.toFixed(2)}`}
          />
          <View style={styles.divider} />
          <SummaryRow label="Total" value={`$${total.toFixed(2)}`} bold />
        </View>

        {/* Delivery method */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Delivery Method</Text>
          <Text style={styles.cardSubText}>In-store Pickup</Text>
        </View>

        {/* Payment method */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Payment Method</Text>
          <Text style={styles.cardSubText}>Cash (Pay at pickup)</Text>
        </View>

        {/* Notice */}
        <View style={[styles.card, styles.noticeCard]}>
          <Text style={styles.cardTitle}>Important</Text>
          <NoticeItem text="Payment is processed directly with the retailer" />
          <NoticeItem text="Bring a valid government-issued ID (21+)" />
          <NoticeItem text="The retailer will contact you to confirm your order" />
        </View>
      </ScrollView>

      {/* Place order bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.placeBtn, processing && styles.placeBtnDisabled]}
          onPress={handlePlaceOrder}
          disabled={processing}
          activeOpacity={0.85}
        >
          {processing ? (
            <View style={styles.processingRow}>
              <ActivityIndicator color="#fff" size="small" />
              <Text style={styles.placeText}>Processing…</Text>
            </View>
          ) : (
            <Text style={styles.placeText}>Place Order · ${total.toFixed(2)}</Text>
          )}
        </TouchableOpacity>
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
      <Text style={[styles.summaryLabel, bold && styles.summaryLabelBold]}>
        {label}
      </Text>
      <Text style={[styles.summaryValue, bold && styles.summaryValueBold]}>
        {value}
      </Text>
    </View>
  );
}

function NoticeItem({ text }: { text: string }) {
  return (
    <View style={styles.noticeRow}>
      <Text style={styles.noticeBullet}>•</Text>
      <Text style={styles.noticeText}>{text}</Text>
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
    gap: 14,
  },
  headerTitle: { color: "#fff", fontSize: 20, fontWeight: "700" },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 120 },
  card: {
    backgroundColor: CARD,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    padding: 16,
    marginBottom: 12,
  },
  noticeCard: { backgroundColor: `${PINK}11` },
  cardTitle: { color: "#fff", fontSize: 16, fontWeight: "700", marginBottom: 12 },
  cardSubText: { color: "#aaa", fontSize: 14 },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: CARD_BORDER, marginVertical: 10 },
  lineRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  lineLabel: { color: "#ccc", fontSize: 14, flex: 1, marginRight: 8 },
  lineValue: { color: "#fff", fontSize: 14, fontWeight: "600" },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  summaryLabel: { color: "#888", fontSize: 14 },
  summaryLabelBold: { color: "#fff", fontWeight: "700" },
  summaryValue: { color: "#fff", fontSize: 14 },
  summaryValueBold: { color: PINK, fontSize: 18, fontWeight: "800" },
  noticeRow: { flexDirection: "row", gap: 8, marginBottom: 6 },
  noticeBullet: { color: "#888", fontSize: 14, lineHeight: 20 },
  noticeText: { color: "#aaa", fontSize: 13, flex: 1, lineHeight: 20 },
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
  placeBtn: {
    backgroundColor: PINK,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  placeBtnDisabled: { opacity: 0.6 },
  placeText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  processingRow: { flexDirection: "row", alignItems: "center", gap: 10 },
});
