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

function resolveImage(url?: string | null): string {
  if (!url)
    return "https://images.unsplash.com/photo-1601313667695-ec35708ac1e4?w=800&auto=format&fit=crop&q=90";
  if (url.startsWith("http")) return url;
  return `${SUPABASE_URL}/storage/v1/object/public/product-images/${url}`;
}

function getMatchLabel(score: number): { label: string; color: string } {
  if (score >= 90) return { label: "Perfect Match", color: "#22c55e" };
  if (score >= 75) return { label: "Great Match", color: "#84cc16" };
  return { label: "Good Match", color: "#eab308" };
}

export default function ProductPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [matchScore, setMatchScore] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [cartLoading, setCartLoading] = useState(false);

  useEffect(() => {
    if (id) {
      loadProduct();
      checkFavorite();
      loadMatchScore();
    }
  }, [id]);

  const loadProduct = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select(
          "*, business_applications(id, business_name, business_city, business_state)"
        )
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      setProduct(data);
    } catch {
      Alert.alert("Error", "Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  const loadMatchScore = async () => {
    try {
      const { data } = await supabase.functions.invoke("get-recommendations", {
        body: { strategy: "content", limit: 100, exclude_viewed: false },
      });
      if (data?.recommendations) {
        const match = data.recommendations.find((p: any) => p.id === id);
        if (match?.recommendation_score) setMatchScore(match.recommendation_score);
      }
    } catch (_) {}
  };

  const checkFavorite = async () => {
    try {
      const { data } = await supabase.functions.invoke("check-favorite-status", {
        body: { product_id: id },
      });
      setIsFavorite(data?.is_favorited ?? false);
    } catch (_) {}
  };

  const handleToggleFavorite = async () => {
    try {
      await supabase.functions.invoke("toggle-favorite", {
        body: { product_id: id },
      });
      setIsFavorite((prev) => !prev);
    } catch {
      Alert.alert("Error", "Failed to update favorite");
    }
  };

  const handleAddToCart = async () => {
    setCartLoading(true);
    try {
      const { error } = await supabase.functions.invoke("manage-cart", {
        body: { action: "add", product_id: id, quantity },
      });
      if (error) throw error;
      Alert.alert("Added to Cart", `${product?.name} ×${quantity} added!`);
      setQuantity(1);
    } catch {
      Alert.alert("Error", "Failed to add to cart");
    } finally {
      setCartLoading(false);
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

  if (!product) {
    return (
      <View style={styles.center}>
        <StatusBar style="light" />
        <Text style={styles.errorText}>Product not found</Text>
        <TouchableOpacity style={styles.goBackBtn} onPress={() => router.back()}>
          <Text style={styles.goBackText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const imageUrl = resolveImage(product.image_url);
  const displayPrice = product.discount_price ?? product.price;
  const hasDiscount =
    product.discount_price && product.discount_price < product.price;
  const discountPct = hasDiscount
    ? Math.round((1 - product.discount_price / product.price) * 100)
    : 0;
  const business = product.business_applications;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero Image ── */}
        <View style={styles.heroWrap}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.heroImage}
            resizeMode="contain"
          />
          <TouchableOpacity style={styles.heroBack} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.heroFav}
            onPress={handleToggleFavorite}
          >
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={20}
              color={isFavorite ? PINK : "#fff"}
            />
          </TouchableOpacity>
        </View>

        {/* ── Content ── */}
        <View style={styles.content}>
          {product.brand_name ? (
            <Text style={styles.brandName}>
              {product.brand_name.toUpperCase()}
            </Text>
          ) : null}

          <Text style={styles.productName}>{product.name}</Text>

          {/* Price row */}
          <View style={styles.priceRow}>
            <Text style={styles.price}>${displayPrice.toFixed(2)}</Text>
            {hasDiscount && (
              <>
                <Text style={styles.originalPrice}>
                  ${product.price.toFixed(2)}
                </Text>
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>{discountPct}% OFF</Text>
                </View>
              </>
            )}
            {matchScore !== null && (() => {
              const m = getMatchLabel(matchScore);
              return (
                <View
                  style={[
                    styles.matchBadge,
                    {
                      backgroundColor: m.color + "22",
                      borderColor: m.color + "88",
                    },
                  ]}
                >
                  <Text style={[styles.matchText, { color: m.color }]}>
                    {matchScore}% {m.label}
                  </Text>
                </View>
              );
            })()}
          </View>

          {/* Rating + dispensary link */}
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={15} color={PINK} />
            <Text style={styles.ratingText}>
              {product.average_rating
                ? product.average_rating.toFixed(1)
                : "N/A"}
            </Text>
            <Text style={styles.reviewCount}>
              ({product.review_count || 0} reviews)
            </Text>
            {business && (
              <>
                <Text style={styles.dot}> · </Text>
                <TouchableOpacity
                  onPress={() => router.push(`/dispensary/${business.id}`)}
                >
                  <Text style={styles.dispensaryLink}>
                    {business.business_name}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          <View style={styles.divider} />

          {/* Details table */}
          <View>
            {product.strain_type ? (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Type</Text>
                <Text style={styles.detailValue}>{product.strain_type}</Text>
              </View>
            ) : null}
            {product.thc_content != null ? (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>THC</Text>
                <Text style={styles.detailValue}>{product.thc_content}%</Text>
              </View>
            ) : null}
            {product.cbd_content != null ? (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>CBD</Text>
                <Text style={styles.detailValue}>{product.cbd_content}%</Text>
              </View>
            ) : null}
            {product.product_format ? (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Category</Text>
                <Text style={styles.detailValue}>{product.product_format}</Text>
              </View>
            ) : null}
          </View>

          {product.description ? (
            <>
              <View style={styles.divider} />
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.description}>{product.description}</Text>
            </>
          ) : null}

          {Array.isArray(product.primary_effects) &&
          product.primary_effects.length > 0 ? (
            <>
              <View style={styles.divider} />
              <Text style={styles.sectionTitle}>Effects</Text>
              <View style={styles.tagsWrap}>
                {product.primary_effects.map((e: string) => (
                  <View key={e} style={styles.tagPrimary}>
                    <Text style={styles.tagPrimaryText}>{e}</Text>
                  </View>
                ))}
              </View>
            </>
          ) : null}

          {Array.isArray(product.flavor_profile) &&
          product.flavor_profile.length > 0 ? (
            <>
              <View style={styles.divider} />
              <Text style={styles.sectionTitle}>Flavor Profile</Text>
              <View style={styles.tagsWrap}>
                {product.flavor_profile.map((f: string) => (
                  <View key={f} style={styles.tagOutline}>
                    <Text style={styles.tagOutlineText}>{f}</Text>
                  </View>
                ))}
              </View>
            </>
          ) : null}

          {Array.isArray(product.dominant_terpenes) &&
          product.dominant_terpenes.length > 0 ? (
            <>
              <View style={styles.divider} />
              <Text style={styles.sectionTitle}>Terpene Profile</Text>
              {product.dominant_terpenes.map((t: any, i: number) => (
                <View key={i} style={styles.detailRow}>
                  <Text style={styles.detailValue}>{t.name ?? t}</Text>
                  {t.percentage ? (
                    <Text style={styles.detailLabel}>{t.percentage}%</Text>
                  ) : null}
                </View>
              ))}
            </>
          ) : null}
        </View>
      </ScrollView>

      {/* ── Fixed Add-to-Cart Bar ── */}
      <View style={styles.cartBar}>
        <View style={styles.qtySelector}>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => setQuantity((q) => Math.max(1, q - 1))}
          >
            <Ionicons name="remove" size={18} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.qtyText}>{quantity}</Text>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => setQuantity((q) => q + 1)}
          >
            <Ionicons name="add" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.addCartBtn}
          onPress={handleAddToCart}
          disabled={cartLoading}
          activeOpacity={0.85}
        >
          {cartLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.addCartText}>
              Add to Cart · ${(displayPrice * quantity).toFixed(2)}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  center: { flex: 1, backgroundColor: BG, justifyContent: "center", alignItems: "center" },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 120 },

  // Hero
  heroWrap: { height: 300, backgroundColor: "#0d0010", position: "relative" },
  heroImage: { width: "100%", height: "100%" },
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

  // Content
  content: { paddingHorizontal: 20, paddingTop: 20 },
  brandName: {
    color: PINK,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  productName: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
    lineHeight: 30,
    marginBottom: 12,
  },

  // Price
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 10,
  },
  price: { color: "#fff", fontSize: 24, fontWeight: "700" },
  originalPrice: {
    color: "#888",
    fontSize: 16,
    textDecorationLine: "line-through",
  },
  discountBadge: {
    backgroundColor: "#ef444422",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  discountText: { color: "#ef4444", fontSize: 12, fontWeight: "700" },
  matchBadge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
  },
  matchText: { fontSize: 11, fontWeight: "700" },

  // Rating
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 16,
    flexWrap: "wrap",
  },
  ratingText: { color: "#fff", fontWeight: "600", fontSize: 14 },
  reviewCount: { color: "#888", fontSize: 13 },
  dot: { color: "#888", fontSize: 14 },
  dispensaryLink: { color: PINK, fontSize: 13, fontWeight: "600" },

  // Details
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: CARD_BORDER,
    marginVertical: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: CARD_BORDER,
  },
  detailLabel: { color: "#888", fontSize: 14 },
  detailValue: { color: "#fff", fontSize: 14, fontWeight: "500" },
  sectionTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
  },
  description: { color: "#aaa", fontSize: 14, lineHeight: 22 },

  // Tags
  tagsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tagPrimary: {
    backgroundColor: PINK + "22",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: PINK + "55",
  },
  tagPrimaryText: { color: PINK, fontSize: 12, fontWeight: "600" },
  tagOutline: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: CARD_BORDER,
  },
  tagOutlineText: { color: "#ccc", fontSize: 12 },

  // Cart bar
  cartBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: CARD,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: CARD_BORDER,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 34,
  },
  qtySelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a1a2a",
    borderRadius: 10,
    overflow: "hidden",
  },
  qtyBtn: { paddingHorizontal: 14, paddingVertical: 10 },
  qtyText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    minWidth: 30,
    textAlign: "center",
  },
  addCartBtn: {
    flex: 1,
    backgroundColor: PINK,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  addCartText: { color: "#fff", fontSize: 15, fontWeight: "700" },

  // Error
  errorText: { color: "#888", fontSize: 16, marginBottom: 16 },
  goBackBtn: {
    backgroundColor: CARD,
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: CARD_BORDER,
  },
  goBackText: { color: "#fff", fontWeight: "600" },
});
