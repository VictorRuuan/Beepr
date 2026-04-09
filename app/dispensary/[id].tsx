import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Linking,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../../lib/supabase";

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

function isOpenNow(hours?: Record<string, any>): boolean {
  if (!hours) return false;
  const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const today = days[new Date().getDay()];
  const h = hours[today];
  if (!h || h.closed) return false;
  const [oh, om] = h.open.split(":").map(Number);
  const [ch, cm] = h.close.split(":").map(Number);
  const now = new Date().getHours() * 60 + new Date().getMinutes();
  return now >= oh * 60 + om && now <= ch * 60 + cm;
}

function formatHours(hours?: Record<string, any>): string {
  if (!hours) return "Hours not available";
  const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const today = days[new Date().getDay()];
  const h = hours[today];
  if (!h || h.closed) return "Closed today";
  const fmt = (t: string) => {
    const [hour, min] = t.split(":").map(Number);
    const h12 = hour % 12 || 12;
    const period = hour < 12 ? "AM" : "PM";
    return `${h12}:${min.toString().padStart(2, "0")} ${period}`;
  };
  return `${fmt(h.open)} – ${fmt(h.close)}`;
}

export default function DispensaryPage() {
  const { id: businessId } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [business, setBusiness] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [displayCount, setDisplayCount] = useState(20);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [favLoading, setFavLoading] = useState(false);
  const PRODUCTS_PER_PAGE = 20;

  useEffect(() => {
    if (businessId) {
      loadData();
      checkFavorite();
    }
  }, [businessId]);

  const loadData = async () => {
    try {
      const { data: biz, error: bizErr } = await supabase
        .from("business_applications")
        .select("*")
        .eq("id", businessId)
        .eq("status", "approved")
        .maybeSingle();

      if (bizErr) throw bizErr;
      if (!biz) {
        Alert.alert("Error", "Dispensary not found");
        router.back();
        return;
      }
      setBusiness(biz);

      const { data: prods, error: prodErr } = await supabase
        .from("products")
        .select("id, name, strain_type, product_format, price, discount_price, image_url, thc_content, average_rating, review_count")
        .eq("business_id", businessId)
        .eq("is_active", true)
        .order("favorite_count", { ascending: false });

      if (prodErr) throw prodErr;
      setProducts(prods ?? []);
    } catch (e: any) {
      Alert.alert("Error", "Failed to load dispensary");
    } finally {
      setLoading(false);
    }
  };

  const checkFavorite = async () => {
    try {
      const { data } = await supabase.functions.invoke("check-business-favorite-status", {
        body: { business_id: businessId },
      });
      setIsFavorite(data?.is_favorited ?? false);
    } catch (_) {}
  };

  const handleToggleFavorite = async () => {
    if (favLoading) return;
    setFavLoading(true);
    try {
      await supabase.functions.invoke("toggle-business-favorite", {
        body: { business_id: businessId },
      });
      setIsFavorite((prev) => !prev);
    } catch {
      Alert.alert("Error", "Failed to update favorite");
    } finally {
      setFavLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <StatusBar style="light" />
        <ActivityIndicator size="large" color={PINK} />
      </View>
    );
  }

  if (!business) return null;

  const logoUrl = business.business_logo_url;
  const isOpen = isOpenNow(business.hours_of_operation);
  const todayHours = formatHours(business.hours_of_operation);
  const address = [
    business.business_street,
    business.business_city,
    business.business_state,
    business.business_zip_code,
  ]
    .filter(Boolean)
    .join(", ");

  const displayedProducts = products.slice(0, displayCount);
  const hasMore = displayCount < products.length;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero Header ── */}
        <View style={styles.heroWrap}>
          {logoUrl ? (
            <Image
              source={{ uri: logoUrl }}
              style={styles.heroImage}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.heroPlaceholder}>
              <Ionicons name="storefront" size={48} color={PINK} />
            </View>
          )}
          <View style={styles.heroOverlay} />
          <TouchableOpacity style={styles.heroBack} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.heroFav}
            onPress={handleToggleFavorite}
            disabled={favLoading}
          >
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={20}
              color={isFavorite ? PINK : "#fff"}
            />
          </TouchableOpacity>
        </View>

        {/* ── Info Card ── */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Text style={styles.bizName}>{business.business_name}</Text>
            <View style={[styles.statusBadge, isOpen ? styles.statusOpen : styles.statusClosed]}>
              <Text style={[styles.statusText, isOpen ? styles.statusOpenText : styles.statusClosedText]}>
                {isOpen ? "Open" : "Closed"}
              </Text>
            </View>
          </View>
          <Text style={styles.bizCity}>
            {business.business_city}, {business.business_state}
          </Text>

          <View style={styles.divider} />

          {address ? (
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={16} color="#888" style={styles.infoIcon} />
              <Text style={styles.infoText}>{address}</Text>
            </View>
          ) : null}

          {business.hours_of_operation ? (
            <View style={styles.infoRow}>
              <Ionicons name="time-outline" size={16} color="#888" style={styles.infoIcon} />
              <Text style={styles.infoText}>{todayHours}</Text>
            </View>
          ) : null}

          {business.business_phone ? (
            <TouchableOpacity
              style={styles.infoRow}
              onPress={() => Linking.openURL(`tel:${business.business_phone}`)}
            >
              <Ionicons name="call-outline" size={16} color="#888" style={styles.infoIcon} />
              <Text style={[styles.infoText, { color: PINK }]}>
                {business.business_phone}
              </Text>
            </TouchableOpacity>
          ) : null}

          {business.accepted_payment_methods?.length > 0 ? (
            <View style={styles.infoRow}>
              <Ionicons name="card-outline" size={16} color="#888" style={styles.infoIcon} />
              <Text style={styles.infoText}>
                {business.accepted_payment_methods.join(", ")}
              </Text>
            </View>
          ) : null}
        </View>

        {/* ── Products ── */}
        {products.length > 0 && (
          <View style={styles.productsSection}>
            <Text style={styles.sectionTitle}>
              Products ({products.length})
            </Text>

            {displayedProducts.map((product) => {
              const imgUrl = resolveImage(product.image_url);
              const hasDiscount =
                product.discount_price && product.discount_price < product.price;
              const discountPct = hasDiscount
                ? Math.round((1 - product.discount_price / product.price) * 100)
                : 0;
              const displayPrice = product.discount_price ?? product.price;

              return (
                <TouchableOpacity
                  key={product.id}
                  style={styles.productCard}
                  activeOpacity={0.85}
                  onPress={() => router.push(`/product/${product.id}`)}
                >
                  <View style={styles.productImageWrap}>
                    {imgUrl ? (
                      <Image
                        source={{ uri: imgUrl }}
                        style={styles.productImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={[styles.productImage, styles.productPlaceholder]}>
                        <Ionicons name="leaf" size={28} color={PINK} />
                      </View>
                    )}
                    {hasDiscount ? (
                      <View style={styles.discountOverlay}>
                        <Text style={styles.discountOverlayText}>
                          -{discountPct}%
                        </Text>
                      </View>
                    ) : null}
                  </View>

                  <View style={styles.productInfo}>
                    <Text style={styles.productName} numberOfLines={1}>
                      {product.name}
                    </Text>
                    <View style={styles.productMeta}>
                      {product.strain_type ? (
                        <View style={styles.strainBadge}>
                          <Text style={styles.strainText}>
                            {product.strain_type}
                          </Text>
                        </View>
                      ) : null}
                      {product.thc_content != null ? (
                        <Text style={styles.thcText}>
                          THC {product.thc_content}%
                        </Text>
                      ) : null}
                      {product.average_rating > 0 ? (
                        <View style={styles.ratingWrap}>
                          <Ionicons name="star" size={11} color={PINK} />
                          <Text style={styles.ratingText}>
                            {product.average_rating.toFixed(1)}
                          </Text>
                        </View>
                      ) : null}
                    </View>
                    <View style={styles.productPriceRow}>
                      <View style={styles.priceGroup}>
                        <Text style={styles.productPrice}>
                          ${displayPrice.toFixed(2)}
                        </Text>
                        {hasDiscount ? (
                          <Text style={styles.originalPrice}>
                            ${product.price.toFixed(2)}
                          </Text>
                        ) : null}
                      </View>
                      <View style={styles.viewBtn}>
                        <Text style={styles.viewBtnText}>View</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}

            {hasMore ? (
              <TouchableOpacity
                style={styles.loadMoreBtn}
                onPress={() => setDisplayCount((c) => c + PRODUCTS_PER_PAGE)}
                activeOpacity={0.85}
              >
                <Text style={styles.loadMoreText}>
                  Load More ({products.length - displayCount} remaining)
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  center: { flex: 1, backgroundColor: BG, justifyContent: "center", alignItems: "center" },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 40 },

  // Hero
  heroWrap: { height: 220, backgroundColor: "#0d0010", position: "relative" },
  heroImage: { width: "100%", height: "100%" },
  heroPlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a0b1a",
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    background: "transparent",
  },
  heroBack: {
    position: "absolute",
    top: 52,
    left: 16,
    backgroundColor: "rgba(0,0,0,0.55)",
    borderRadius: 20,
    padding: 8,
  },
  heroFav: {
    position: "absolute",
    top: 52,
    right: 16,
    backgroundColor: "rgba(0,0,0,0.55)",
    borderRadius: 20,
    padding: 8,
  },

  // Info Card
  infoCard: {
    margin: 16,
    backgroundColor: CARD,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    padding: 20,
    marginTop: -24,
    zIndex: 10,
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  bizName: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
    flex: 1,
    marginRight: 8,
  },
  bizCity: { color: "#888", fontSize: 14, marginBottom: 4 },
  statusBadge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
  },
  statusOpen: { backgroundColor: "#22c55e22", borderColor: "#22c55e55" },
  statusClosed: { backgroundColor: "#ef444422", borderColor: "#ef444455" },
  statusText: { fontSize: 12, fontWeight: "700" },
  statusOpenText: { color: "#22c55e" },
  statusClosedText: { color: "#ef4444" },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: CARD_BORDER,
    marginVertical: 14,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  infoIcon: { marginRight: 10, marginTop: 1 },
  infoText: { color: "#ddd", fontSize: 14, flex: 1, lineHeight: 20 },

  // Products
  productsSection: { paddingHorizontal: 16, paddingTop: 4 },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  productCard: {
    backgroundColor: CARD,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    flexDirection: "row",
    marginBottom: 10,
    overflow: "hidden",
  },
  productImageWrap: { position: "relative" },
  productImage: {
    width: 88,
    height: 88,
  },
  productPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a0b1a",
  },
  discountOverlay: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "#ef4444",
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  discountOverlayText: { color: "#fff", fontSize: 10, fontWeight: "700" },
  productInfo: {
    flex: 1,
    padding: 10,
    justifyContent: "space-between",
  },
  productName: { color: "#fff", fontSize: 14, fontWeight: "700", marginBottom: 4 },
  productMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
    marginBottom: 6,
  },
  strainBadge: {
    backgroundColor: "#2a1a2a",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: CARD_BORDER,
  },
  strainText: { color: "#ccc", fontSize: 11 },
  thcText: { color: "#888", fontSize: 11 },
  ratingWrap: { flexDirection: "row", alignItems: "center", gap: 2 },
  ratingText: { color: "#888", fontSize: 11 },
  productPriceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  priceGroup: { flexDirection: "row", alignItems: "center", gap: 6 },
  productPrice: { color: "#fff", fontSize: 16, fontWeight: "700" },
  originalPrice: {
    color: "#888",
    fontSize: 13,
    textDecorationLine: "line-through",
  },
  viewBtn: {
    backgroundColor: PINK,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  viewBtnText: { color: "#fff", fontSize: 12, fontWeight: "700" },

  // Load more
  loadMoreBtn: {
    backgroundColor: CARD,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    padding: 14,
    alignItems: "center",
    marginTop: 4,
    marginBottom: 8,
  },
  loadMoreText: { color: "#ccc", fontSize: 14, fontWeight: "600" },
});
