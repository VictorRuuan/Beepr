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

type TabType = "products" | "dispensaries";

function resolveImage(url?: string | null, bucket = "product-images"): string | undefined {
  if (!url) return undefined;
  if (url.startsWith("http")) return url;
  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${url}`;
}

export default function FavoritesScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("products");
  const [favoriteProducts, setFavoriteProducts] = useState<any[]>([]);
  const [favoriteBusinesses, setFavoriteBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("get-favorites", {
        body: { page: 1, limit: 100, sort_by: "favorited_at", sort_order: "desc", type: "all" },
      });
      if (error) throw error;
      const items: any[] = data?.favorites ?? [];
      setFavoriteProducts(items.filter((i) => i.type === "product" || i.product_id));
      setFavoriteBusinesses(items.filter((i) => i.type === "business" || i.business_id));
    } catch {
      Alert.alert("Error", "Could not load favorites");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveProduct = async (productId: string) => {
    await supabase.functions.invoke("toggle-favorite", { body: { product_id: productId } });
    setFavoriteProducts((prev) => prev.filter((p) => (p.product_id ?? p.id) !== productId));
  };

  const handleRemoveBusiness = async (businessId: string) => {
    await supabase.functions.invoke("toggle-favorite", { body: { business_id: businessId } });
    setFavoriteBusinesses((prev) => prev.filter((b) => (b.business_id ?? b.id) !== businessId));
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favorites</Text>
        <Text style={styles.headerSub}>
          {favoriteProducts.length} products · {favoriteBusinesses.length} dispensaries
        </Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {(["products", "dispensaries"] as TabType[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab === "products"
                ? `Products (${favoriteProducts.length})`
                : `Dispensaries (${favoriteBusinesses.length})`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator color={PINK} size="large" />
        </View>
      ) : (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          {activeTab === "products" ? (
            favoriteProducts.length === 0 ? (
              <EmptyState message="You haven't favorited any products yet" />
            ) : (
              favoriteProducts.map((item) => {
                const p = item.product ?? item;
                const pid = item.product_id ?? item.id;
                const imgUrl = resolveImage(p.image_url);
                return (
                  <View key={pid} style={styles.card}>
                    <TouchableOpacity
                      style={styles.cardClickable}
                      onPress={() => router.push(`/product/${pid}`)}
                      activeOpacity={0.85}
                    >
                      <View style={styles.productImageWrap}>
                        {imgUrl ? (
                          <Image source={{ uri: imgUrl }} style={styles.productImage} resizeMode="cover" />
                        ) : (
                          <View style={[styles.productImage, styles.imgPlaceholder]}>
                            <Ionicons name="leaf" size={28} color={PINK} />
                          </View>
                        )}
                      </View>
                      <View style={styles.cardInfo}>
                        <View style={styles.cardTopRow}>
                          <Text style={styles.productName} numberOfLines={2}>{p.name}</Text>
                        </View>
                        <Text style={styles.productMeta}>
                          {[p.strain_type, p.product_format].filter(Boolean).join(" · ")}
                        </Text>
                        {p.average_rating > 0 && (
                          <View style={styles.ratingRow}>
                            <Ionicons name="star" size={13} color={PINK} />
                            <Text style={styles.ratingText}>{p.average_rating?.toFixed(1)}</Text>
                          </View>
                        )}
                        <View style={styles.priceRow}>
                          {p.original_price && p.original_price !== p.price && (
                            <Text style={styles.originalPrice}>${p.original_price?.toFixed(2)}</Text>
                          )}
                          <Text style={styles.price}>${p.price?.toFixed(2)}</Text>
                          {p.discount_percentage > 0 && (
                            <View style={styles.discountBadge}>
                              <Text style={styles.discountText}>{p.discount_percentage}% OFF</Text>
                            </View>
                          )}
                        </View>
                        {p.business?.business_city && (
                          <View style={styles.locationRow}>
                            <Ionicons name="location-outline" size={12} color="#888" />
                            <Text style={styles.locationText}>{p.business.business_city}</Text>
                          </View>
                        )}
                      </View>
                    </TouchableOpacity>
                    <View style={styles.cardActions}>
                      <TouchableOpacity
                        style={styles.viewBtn}
                        onPress={() => router.push(`/product/${pid}`)}
                      >
                        <Text style={styles.viewBtnText}>View</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.removeFavBtn}
                        onPress={() => handleRemoveProduct(pid)}
                      >
                        <Ionicons name="heart" size={18} color={PINK} />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })
            )
          ) : favoriteBusinesses.length === 0 ? (
            <EmptyState message="You haven't favorited any dispensaries yet" />
          ) : (
            favoriteBusinesses.map((item) => {
              const b = item.business ?? item;
              const bid = item.business_id ?? item.id;
              const logoUrl = resolveImage(b.logo_url ?? b.business_logo, "business-logos");
              return (
                <View key={bid} style={styles.card}>
                  <TouchableOpacity
                    style={styles.cardClickable}
                    onPress={() => router.push(`/dispensary/${bid}`)}
                    activeOpacity={0.85}
                  >
                    <View style={styles.businessLogoWrap}>
                      {logoUrl ? (
                        <Image source={{ uri: logoUrl }} style={styles.businessLogo} resizeMode="cover" />
                      ) : (
                        <View style={[styles.businessLogo, styles.imgPlaceholder]}>
                          <Ionicons name="storefront" size={24} color={PINK} />
                        </View>
                      )}
                    </View>
                    <View style={styles.cardInfo}>
                      <Text style={styles.productName} numberOfLines={1}>{b.business_name ?? b.name}</Text>
                      <Text style={styles.productMeta}>
                        {[b.business_city, b.business_state].filter(Boolean).join(", ")}
                      </Text>
                      {(b.phone_number ?? b.business_phone) && (
                        <View style={styles.locationRow}>
                          <Ionicons name="call-outline" size={12} color="#888" />
                          <Text style={styles.locationText}>{b.phone_number ?? b.business_phone}</Text>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                  <View style={styles.cardActions}>
                    <TouchableOpacity
                      style={styles.viewBtn}
                      onPress={() => router.push(`/dispensary/${bid}`)}
                    >
                      <Text style={styles.viewBtnText}>View</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.removeFavBtn}
                      onPress={() => handleRemoveBusiness(bid)}
                    >
                      <Ionicons name="heart" size={18} color={PINK} />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
      )}
    </View>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <View style={styles.empty}>
      <Ionicons name="heart-outline" size={56} color="#333" />
      <Text style={styles.emptyTitle}>No favorites yet</Text>
      <Text style={styles.emptySub}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  header: { paddingTop: 56, paddingHorizontal: 20, paddingBottom: 12 },
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
    borderWidth: 1,
    borderColor: CARD_BORDER,
    alignItems: "center",
    backgroundColor: CARD,
  },
  tabBtnActive: { borderColor: PINK, backgroundColor: `${PINK}22` },
  tabText: { color: "#888", fontSize: 13, fontWeight: "600" },
  tabTextActive: { color: PINK },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 40 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", paddingTop: 80 },
  card: {
    backgroundColor: CARD,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    marginBottom: 12,
    overflow: "hidden",
  },
  cardClickable: { flexDirection: "row", padding: 12 },
  productImageWrap: {},
  productImage: { width: 96, height: 96, borderRadius: 8 },
  businessLogoWrap: {},
  businessLogo: { width: 64, height: 64, borderRadius: 8 },
  imgPlaceholder: { justifyContent: "center", alignItems: "center", backgroundColor: "#1a0b1a" },
  cardInfo: { flex: 1, paddingLeft: 12, justifyContent: "center" },
  cardTopRow: { flexDirection: "row", alignItems: "flex-start" },
  productName: { color: "#fff", fontSize: 14, fontWeight: "700", flex: 1 },
  productMeta: { color: "#888", fontSize: 12, marginTop: 3 },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 3, marginTop: 4 },
  ratingText: { color: "#fff", fontSize: 12, fontWeight: "600" },
  priceRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 },
  price: { color: PINK, fontSize: 15, fontWeight: "700" },
  originalPrice: { color: "#555", fontSize: 13, textDecorationLine: "line-through" },
  discountBadge: { backgroundColor: "#16a34a22", borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  discountText: { color: "#4ade80", fontSize: 11, fontWeight: "700" },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 3, marginTop: 3 },
  locationText: { color: "#888", fontSize: 12 },
  cardActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingHorizontal: 12,
    paddingBottom: 12,
    gap: 8,
  },
  viewBtn: {
    backgroundColor: PINK,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 7,
  },
  viewBtnText: { color: "#fff", fontSize: 13, fontWeight: "700" },
  removeFavBtn: {
    backgroundColor: `${PINK}22`,
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: `${PINK}55`,
  },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", paddingTop: 80, gap: 12 },
  emptyTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },
  emptySub: { color: "#888", fontSize: 14, textAlign: "center" },
});
