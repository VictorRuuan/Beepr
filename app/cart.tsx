import React, { useState, useEffect, useCallback } from "react";
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

function resolveImage(url?: string | null): string | undefined {
  if (!url) return undefined;
  if (url.startsWith("http")) return url;
  return `${SUPABASE_URL}/storage/v1/object/public/product-images/${url}`;
}

export default function CartScreen() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const loadCart = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("manage-cart", {
        body: { action: "get" },
      });
      if (error) throw error;
      setCartItems(data?.cart_items ?? data?.items ?? []);
    } catch {
      Alert.alert("Error", "Could not load cart");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const updateQuantity = async (productId: string, newQty: number) => {
    if (newQty < 1) {
      removeItem(productId);
      return;
    }
    setUpdating(productId);
    try {
      await supabase.functions.invoke("manage-cart", {
        body: { action: "update", product_id: productId, quantity: newQty },
      });
      setCartItems((prev) =>
        prev.map((item) =>
          item.product_id === productId || item.products?.id === productId
            ? { ...item, quantity: newQty }
            : item
        )
      );
    } finally {
      setUpdating(null);
    }
  };

  const removeItem = async (productId: string) => {
    setUpdating(productId);
    try {
      await supabase.functions.invoke("manage-cart", {
        body: { action: "remove", product_id: productId },
      });
      setCartItems((prev) =>
        prev.filter(
          (item) => item.product_id !== productId && item.products?.id !== productId
        )
      );
    } finally {
      setUpdating(null);
    }
  };

  const getCartTotal = () =>
    cartItems.reduce((sum, item) => {
      const p = item.products ?? item;
      const effectivePrice =
        p.discount_price && p.discount_price > 0 && p.discount_price < p.price
          ? p.discount_price
          : p.price ?? 0;
      return sum + effectivePrice * (item.quantity ?? 1);
    }, 0);

  const subtotal = getCartTotal();
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

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
        <Text style={styles.headerTitle}>Cart</Text>
        <Text style={styles.headerSub}>({cartItems.length} items)</Text>
      </View>

      {cartItems.length === 0 ? (
        <View style={styles.centered}>
          <Ionicons name="cart-outline" size={64} color="#333" />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <TouchableOpacity
            style={styles.shopBtn}
            onPress={() => router.replace("/")}
          >
            <Text style={styles.shopBtnText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
          >
            {cartItems.map((item) => {
              const p = item.products ?? item;
              const pid = item.product_id ?? p.id;
              const business = p.business_applications ?? p.business;
              const effectivePrice =
                p.discount_price &&
                p.discount_price > 0 &&
                p.discount_price < p.price
                  ? p.discount_price
                  : p.price ?? 0;
              const hasDiscount = effectivePrice < (p.price ?? 0);
              const imgUrl = resolveImage(p.image_url);
              const isUpdating = updating === pid;

              return (
                <View key={item.id ?? pid} style={styles.card}>
                  <TouchableOpacity
                    onPress={() => router.push(`/product/${pid}`)}
                    activeOpacity={0.85}
                  >
                    {imgUrl ? (
                      <Image
                        source={{ uri: imgUrl }}
                        style={styles.productImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={[styles.productImage, styles.imgPlaceholder]}>
                        <Ionicons name="leaf" size={28} color={PINK} />
                      </View>
                    )}
                  </TouchableOpacity>
                  <View style={styles.cardInfo}>
                    <TouchableOpacity onPress={() => router.push(`/product/${pid}`)}>
                      <Text style={styles.productName} numberOfLines={2}>{p.name}</Text>
                    </TouchableOpacity>
                    {business && (
                      <TouchableOpacity
                        onPress={() =>
                          router.push(`/dispensary/${business.id}`)
                        }
                      >
                        <Text style={styles.businessName}>
                          {business.business_name}
                        </Text>
                      </TouchableOpacity>
                    )}
                    <View style={styles.metaRow}>
                      {p.strain_type && (
                        <View style={styles.strainBadge}>
                          <Text style={styles.strainText}>{p.strain_type}</Text>
                        </View>
                      )}
                      {p.thc_content != null && (
                        <Text style={styles.thc}>THC {p.thc_content}%</Text>
                      )}
                    </View>
                    <View style={styles.priceQtyRow}>
                      <View style={styles.priceCol}>
                        <Text style={styles.itemPrice}>
                          ${(effectivePrice * item.quantity).toFixed(2)}
                        </Text>
                        {hasDiscount && (
                          <Text style={styles.strikePrice}>
                            ${(p.price * item.quantity).toFixed(2)}
                          </Text>
                        )}
                      </View>
                      <View style={styles.qtyRow}>
                        <TouchableOpacity
                          style={styles.qtyBtn}
                          onPress={() =>
                            updateQuantity(pid, (item.quantity ?? 1) - 1)
                          }
                          disabled={isUpdating}
                        >
                          <Ionicons name="remove" size={14} color="#fff" />
                        </TouchableOpacity>
                        <Text style={styles.qtyText}>{item.quantity ?? 1}</Text>
                        <TouchableOpacity
                          style={styles.qtyBtn}
                          onPress={() =>
                            updateQuantity(pid, (item.quantity ?? 1) + 1)
                          }
                          disabled={isUpdating}
                        >
                          <Ionicons name="add" size={14} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.removeBtn}
                          onPress={() => removeItem(pid)}
                          disabled={isUpdating}
                        >
                          {isUpdating ? (
                            <ActivityIndicator size="small" color="#f87171" />
                          ) : (
                            <Ionicons name="trash-outline" size={16} color="#f87171" />
                          )}
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              );
            })}

            {/* Order Summary */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Order Summary</Text>
              <View style={styles.divider} />
              <Row label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
              <Row label="Tax (10%)" value={`$${tax.toFixed(2)}`} />
              <View style={styles.divider} />
              <Row label="Total" value={`$${total.toFixed(2)}`} bold />
            </View>
          </ScrollView>

          {/* Fixed checkout bar */}
          <View style={styles.checkoutBar}>
            <TouchableOpacity
              style={styles.checkoutBtn}
              onPress={() =>
                router.push({
                  pathname: "/checkout",
                  params: { total: total.toFixed(2) },
                })
              }
              activeOpacity={0.85}
            >
              <Text style={styles.checkoutText}>
                Proceed to Checkout · ${total.toFixed(2)}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

function Row({
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
      <Text style={[styles.summaryValue, bold && { fontSize: 18, color: PINK }]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", gap: 16 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 52,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: CARD_BORDER,
    gap: 12,
  },
  headerTitle: { color: "#fff", fontSize: 20, fontWeight: "700" },
  headerSub: { color: "#888", fontSize: 14 },
  emptyTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },
  shopBtn: {
    backgroundColor: PINK,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  shopBtnText: { color: "#fff", fontSize: 15, fontWeight: "700" },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 120 },
  card: {
    flexDirection: "row",
    backgroundColor: CARD,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    marginBottom: 12,
    overflow: "hidden",
  },
  productImage: { width: 88, height: "100%" as any, minHeight: 88 },
  imgPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a0b1a",
    minHeight: 88,
  },
  cardInfo: { flex: 1, padding: 12 },
  productName: { color: "#fff", fontSize: 14, fontWeight: "700", marginBottom: 2 },
  businessName: { color: "#888", fontSize: 12, marginBottom: 6 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  strainBadge: {
    backgroundColor: `${PINK}22`,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  strainText: { color: PINK, fontSize: 11, fontWeight: "600" },
  thc: { color: "#888", fontSize: 11 },
  priceQtyRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  priceCol: {},
  itemPrice: { color: PINK, fontSize: 15, fontWeight: "700" },
  strikePrice: { color: "#555", fontSize: 12, textDecorationLine: "line-through" },
  qtyRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  qtyBtn: {
    backgroundColor: "#2a1a2a",
    borderRadius: 6,
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  qtyText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
    minWidth: 20,
    textAlign: "center",
  },
  removeBtn: { padding: 4 },
  summaryCard: {
    backgroundColor: CARD,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    padding: 16,
    marginTop: 4,
  },
  summaryTitle: { color: "#fff", fontSize: 16, fontWeight: "700", marginBottom: 12 },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: CARD_BORDER, marginVertical: 10 },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  summaryLabel: { color: "#888", fontSize: 14 },
  summaryValue: { color: "#fff", fontSize: 14, fontWeight: "600" },
  checkoutBar: {
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
  checkoutBtn: {
    backgroundColor: PINK,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  checkoutText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
