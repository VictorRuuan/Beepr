import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { supabase } from "../lib/supabase";
import { getNearbyBusinesses } from "../lib/api/businesses";

const PINK = "#c4185c";
const BG = "#130008";
const CARD = "#17131a";
const CARD_BORDER = "#2f1d2f";

const STORAGE_URL =
  "https://slhubwjeofitlmywworo.supabase.co/storage/v1/object/public";

function resolveProductImage(url?: string): string | undefined {
  if (!url) return undefined;
  if (url.startsWith("http")) return url;
  return `${STORAGE_URL}/product-images/${url}`;
}

type Product = {
  id: string;
  name: string;
  strain_type?: string;
  product_format?: string;
  price_per_unit?: number;
  original_price?: number;
  image_url?: string;
  match_score?: number;
  discount_percent?: number;
};

type Business = {
  id: string;
  business_name: string;
  business_city?: string;
  business_state?: string;
  business_logo_url?: string;
  hours_of_operation?: Record<string, { open: string; close: string }>;
  distance_miles?: number;
  product_count?: number;
  retailer_type?: string;
  is_open?: boolean;
};

function isOpenNow(hours?: Record<string, { open: string; close: string }>): boolean {
  if (!hours) return false;
  const days = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
  const today = days[new Date().getDay()];
  const todayHours = hours[today];
  if (!todayHours) return false;
  const now = new Date();
  const [oh, om] = todayHours.open.split(":").map(Number);
  const [ch, cm] = todayHours.close.split(":").map(Number);
  const nowMins = now.getHours() * 60 + now.getMinutes();
  return nowMins >= oh * 60 + om && nowMins <= ch * 60 + cm;
}

export default function SetupComplete() {
  const router = useRouter();
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [deals, setDeals] = useState<Product[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [cityLabel, setCityLabel] = useState("Near You");

  const fetchData = useCallback(async () => {
    // ── Produtos e dispensaries em paralelo ──────────────────────────────────
    // Produtos são mostrados imediatamente; localização não bloqueia o render.

    const fetchProducts = async () => {
      const [res1, res2] = await Promise.all([
        supabase
          .from("products")
          .select("id, name, strain_type, price, discount_price, image_url")
          .eq("is_active", true)
          .is("discount_price", null)
          .order("favorite_count", { ascending: false })
          .limit(6),
        supabase
          .from("products")
          .select("id, name, strain_type, price, discount_price, image_url")
          .eq("is_active", true)
          .not("discount_price", "is", null)
          .order("favorite_count", { ascending: false })
          .limit(1),
      ]);

      if (res1.error) console.error("[SetupComplete] products query:", res1.error.message);
      if (res2.error) console.error("[SetupComplete] deals query:", res2.error.message);

      const rawProducts = res1.data;
      const rawDeals = res2.data;

      console.log("[SetupComplete] products sample:", JSON.stringify(rawProducts?.[0]));
      console.log("[SetupComplete] deals sample:", JSON.stringify(rawDeals?.[0]));

      if (Array.isArray(rawProducts) && rawProducts.length > 0) {
        setRecommendations(
          rawProducts.map((p) => ({
            id: p.id,
            name: p.name,
            strain_type: p.strain_type ?? undefined,
            product_format: undefined,
            price_per_unit: p.price,
            original_price: undefined,
            image_url: resolveProductImage(p.image_url ?? undefined),
            match_score: undefined,
            discount_percent: undefined,
          }))
        );
      }

      if (Array.isArray(rawDeals) && rawDeals.length > 0) {
        const p = rawDeals[0];
        const pct =
          p.discount_price != null && p.price > 0
            ? Math.round((1 - p.discount_price / p.price) * 100)
            : 0;
        setDeals([{
          id: p.id,
          name: p.name,
          strain_type: p.strain_type ?? undefined,
          product_format: undefined,
          price_per_unit: p.discount_price,
          original_price: p.price,
          image_url: resolveProductImage(p.image_url ?? undefined),
          match_score: undefined,
          discount_percent: pct > 0 ? pct : undefined,
        }]);
      }
    };

    const fetchBusinesses = async () => {
      // Geolocation com timeout de 5 s para não bloquear a tela
      let coords: { latitude: number; longitude: number } | null = null;
      try {
        const { status } = await Location.getForegroundPermissionsAsync();
        if (status === "granted") {
          const cached = await Location.getLastKnownPositionAsync();
          if (cached) {
            coords = cached.coords;
          } else {
            const locPromise = Location.getCurrentPositionAsync({
              accuracy: Location.Accuracy.Balanced,
            });
            const timeout = new Promise<null>((res) =>
              setTimeout(() => res(null), 5000)
            );
            const result = await Promise.race([locPromise, timeout]);
            if (result) coords = result.coords;
          }
        }
      } catch (_) {
        // web / emulator — sem localização
      }

      if (coords) {
        const [address] = await Location.reverseGeocodeAsync(coords).catch(() => [null]);
        if (address?.city) setCityLabel(address.city);
        else if (address?.subregion) setCityLabel(address.subregion);

        const { data: bizResponse } = await getNearbyBusinesses({
          user_lat: coords.latitude,
          user_lon: coords.longitude,
          limit: 5,
        });
        const bizArr = (bizResponse as any)?.businesses;
        if (Array.isArray(bizArr) && bizArr.length > 0) {
          setBusinesses(bizArr);
          return;
        }
      }

      // Fallback direto no Supabase
      const { data: bizFallback, error: bizErr } = await supabase
        .from("business_applications")
        .select("id, business_name, business_city, business_state, business_logo_url, hours_of_operation, retailer_type")
        .eq("status", "approved")
        .limit(5);

      console.log("[SetupComplete] bizFallback:", JSON.stringify(bizFallback?.[0]), "err:", bizErr?.message);

      if (Array.isArray(bizFallback) && bizFallback.length > 0) {
        setBusinesses(
          bizFallback.map((b) => ({
            id: b.id,
            business_name: b.business_name,
            business_city: b.business_city ?? undefined,
            business_state: b.business_state ?? undefined,
            business_logo_url: b.business_logo_url ?? undefined,
            hours_of_operation: b.hours_of_operation ?? undefined,
            retailer_type: b.retailer_type ?? undefined,
            is_open: undefined,
            distance_miles: undefined,
            product_count: undefined,
          }))
        );
      }
    };

    try {
      // Produtos desbloqueiam o loading imediatamente
      await fetchProducts();
    } catch (e) {
      console.error("[SetupComplete] products error:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }

    // Dispensaries carregam em background sem bloquear a UI
    fetchBusinesses().catch((e) =>
      console.error("[SetupComplete] businesses error:", e)
    );
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [fetchData]);

  const formatPrice = (price?: number) =>
    price != null ? `$${price.toFixed(2)}` : "-";

  const formatDistance = (d?: number) =>
    d != null ? `${d.toFixed(1)} mi` : "";

  return (
    <View style={styles.safe}>
      <StatusBar style="light" />

      <View style={styles.topBar}>
        <Text style={styles.brand}>beepr</Text>
        <View style={styles.locationWrapper}>
          <Ionicons name="location-sharp" size={18} color="#fff" />
          <Text style={styles.locationText}>{cityLabel}</Text>
        </View>
        <View style={styles.topActions}>
          <TouchableOpacity onPress={() => router.push("/notifications")}>
            <Ionicons name="notifications-outline" size={22} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/cart")} style={{ marginLeft: 12 }}>
            <Ionicons name="cart-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={PINK} />
        </View>
      ) : (
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={PINK} />}
      >
        {/* ── Featured Promotion ── */}
        <Text style={styles.sectionTitle}>Featured Promotion</Text>
        {recommendations[0] ? (
          <TouchableOpacity style={styles.promoCard} activeOpacity={0.85} onPress={() => router.push(`/product/${recommendations[0].id}`)}>
            <View style={styles.promoOverlay}>
              <View style={styles.promoLabelWrap}>
                <Text style={styles.promoLabel}>Featured Promotion</Text>
              </View>
              <Text style={styles.promoCardTitle}>{recommendations[0].name}</Text>
              <Text style={styles.promoCardSub}>{recommendations[0].strain_type ?? ""}</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.promoCard}>
            <View style={styles.promoOverlay}>
              <View style={styles.promoLabelWrap}>
                <Text style={styles.promoLabel}>Featured Promotion</Text>
              </View>
              <Text style={styles.promoCardTitle}>Blue Dream</Text>
              <Text style={styles.promoCardSub}>Best Gas in Town</Text>
            </View>
          </View>
        )}

        {/* ── Deals For You ── */}
        {deals.length > 0 && (
          <>
            <View style={[styles.sectionTitleRow, { marginTop: 16 }]}>
              <Ionicons name="pricetag" size={18} color={PINK} />
              <Text style={styles.sectionTitle}>Deals For You</Text>
            </View>
            {deals.map((deal) => (
              <TouchableOpacity key={deal.id} style={styles.dealCard} activeOpacity={0.85} onPress={() => router.push(`/product/${deal.id}`)}>
                <View style={styles.dealRow}>
                  {deal.image_url ? (
                    <Image source={{ uri: deal.image_url }} style={styles.dealImageSquare} />
                  ) : (
                    <View style={[styles.dealImageSquare, styles.dealImagePlaceholder]}>
                      <Ionicons name="leaf" size={32} color={PINK} />
                    </View>
                  )}
                  <View style={styles.dealDetails}>
                    <View style={styles.dealTopRow}>
                      <Text style={styles.dealMatch}>
                        {deal.match_score ? `${deal.match_score}% Perfect Match` : "Great Match"}
                      </Text>
                      {deal.discount_percent && (
                        <View style={styles.dealBadge}>
                          <Text style={styles.dealBadgeText}>{deal.discount_percent}% OFF</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.dealName} numberOfLines={2}>{deal.name}</Text>
                    <Text style={styles.dealMeta}>
                      {[deal.strain_type, deal.product_format].filter(Boolean).join(" • ")}
                    </Text>
                    <View style={styles.dealPriceRow}>
                      <Text style={styles.dealPrice}>{formatPrice(deal.price_per_unit)}</Text>
                      {deal.original_price && (
                        <Text style={styles.dealOldPrice}>{formatPrice(deal.original_price)}</Text>
                      )}
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}

        {/* ── Budding Interest ── */}
        <View style={[styles.sectionTitleRow, { marginTop: 16 }]}>
          <Ionicons name="time" size={18} color={PINK} />
          <Text style={styles.sectionTitle}>Budding Interest</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.horizontal}
          contentContainerStyle={styles.buddingScrollContent}
        >
          {(recommendations.length > 0 ? recommendations : []).map((item) => (
            <TouchableOpacity key={item.id} style={styles.buddingCard} activeOpacity={0.85} onPress={() => router.push(`/product/${item.id}`)}>
              <View style={styles.productImageWrap}>
                <Image
                  source={
                    item.image_url
                      ? { uri: item.image_url }
                      : { uri: `https://images.unsplash.com/photo-1603909223429-69bb7101f420?w=200&h=200&fit=crop&auto=format` }
                  }
                  style={styles.productImage}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.productMatchPill}>
                <Text style={styles.productMatch}>
                  {item.match_score ? `${item.match_score}% Perfect Match` : "Perfect Match"}
                </Text>
              </View>
              <Text style={styles.productTitle} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.productSubtitle}>{item.strain_type ?? ""}</Text>
              <Text style={styles.productPrice}>{formatPrice(item.price_per_unit)}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── Dispensaries Near You ── */}
        <View style={[styles.sectionTitleRow, { marginTop: 16 }]}>
          <Ionicons name="storefront" size={18} color={PINK} />
          <Text style={styles.sectionTitle}>Dispensaries Near You</Text>
        </View>
        {businesses.length > 0 ? businesses.map((biz) => {
          const open = biz.is_open ?? isOpenNow(biz.hours_of_operation);
          return (
            <TouchableOpacity key={biz.id} style={[styles.dispensaryCard, { marginBottom: 10 }]} activeOpacity={0.85} onPress={() => router.push(`/dispensary/${biz.id}`)}>
              <View style={styles.dispensaryHeader}>
                {biz.business_logo_url ? (
                  <Image source={{ uri: biz.business_logo_url }} style={styles.dispensaryLogoImg} />
                ) : (
                  <Text style={styles.dispensaryLogo}>beepr</Text>
                )}
                <Text style={[styles.dispensaryStatus, open ? styles.statusOpen : styles.statusClosed]}>
                  {open ? "Open" : "Closed"}
                </Text>
              </View>
              <Text style={styles.dispensaryName}>{biz.business_name}</Text>
              <View style={styles.dispensaryDetails}>
                <Ionicons name="location-outline" size={14} color="#737682" />
                <Text style={styles.dispensaryDetail}>
                  {[biz.business_city, biz.business_state].filter(Boolean).join(", ") || ", California"}
                </Text>
              </View>
              <View style={styles.dispensaryDetails}>
                <Ionicons name="time-outline" size={14} color="#737682" />
                <Text style={styles.dispensaryDetail}>{open ? "Open Now" : "Closed"}</Text>
              </View>
              <View style={styles.dispensaryMetaRow}>{/*
                {[formatDistance(biz.distance_miles), biz.product_count ? `${biz.product_count} products` : ""].filter(Boolean).join(" • ")}
              */}<Text style={styles.dispensaryDistance}>{formatDistance(biz.distance_miles) || "0 mi"}</Text>
                <Text style={styles.dispensaryMetaDot}>·</Text>
                <Text style={styles.dispensaryMetaText}>
                  {biz.product_count ? `${biz.product_count} products` : "7 products"}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }) : (
          <View style={styles.dispensaryCard}>
            <Text style={styles.comingSoonText}>No dispensaries found near you yet.</Text>
          </View>
        )}

        <View style={[styles.sectionTitleRow, { marginTop: 16 }]}>
          <Ionicons name="trending-up" size={18} color={PINK} />
          <Text style={styles.sectionTitle}>Hottest Products in Your Area</Text>
        </View>
        <Text style={styles.comingSoonText}>More products coming soon</Text>

        <View style={[styles.sectionTitleRow, { marginTop: 16 }]}>
          <Ionicons name="bag" size={18} color={PINK} />
          <Text style={styles.sectionTitle}>Buy Again</Text>
        </View>
        <Text style={styles.comingSoonText}>More products coming soon</Text>
      </ScrollView>
      )}

      <View style={styles.footerNav}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.replace("/")}
        >
          <Ionicons name="home" size={22} color={PINK} />
          <Text style={[styles.tabText, { color: PINK }]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.push("/search")}
        >
          <Ionicons name="search" size={22} color="#888" />
          <Text style={styles.tabText}>Search</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="sparkles" size={22} color="#888" />
          <Text style={styles.tabText}>Beeps</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => router.push("/favorites")}>
          <Ionicons name="heart" size={22} color="#888" />
          <Text style={styles.tabText}>Favorites</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => router.push("/profile")}>
          <Ionicons name="person" size={22} color="#888" />
          <Text style={styles.tabText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },
  loadingWrap: { flex: 1, alignItems: "center", justifyContent: "center" },
  topBar: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#2a172a",
  },
  brand: {
    color: PINK,
    fontSize: 20,
    fontWeight: "800",
    textTransform: "lowercase",
  },
  topActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  locationWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  locationText: {
    color: "#fff",
    fontSize: 13,
    marginLeft: 6,
  },
  topIcon: { marginLeft: 12 },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 78, gap: 16 },
  sectionTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 20,
    marginBottom: 8,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  promoCard: {
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    borderRadius: 14,
    overflow: "hidden",
    minHeight: 110,
    justifyContent: "center",
  },
  promoImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    opacity: 0.35,
  },
  promoOverlay: {
    padding: 14,
  },
  promoLabelWrap: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(196, 24, 92, 0.16)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  promoLabel: {
    color: PINK,
    fontSize: 12,
    fontWeight: "700",
  },
  promoCardTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
  },
  promoCardSub: {
    color: "#888",
    fontSize: 13,
    marginTop: 3,
  },
  dealCard: {
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    borderRadius: 14,
    padding: 14,
  },
  dealRow: {
    flexDirection: "row",
    gap: 12,
  },
  dealImageSquare: {
    width: 110,
    height: 110,
    borderRadius: 10,
  },
  dealImagePlaceholder: {
    backgroundColor: "#220015",
    alignItems: "center",
    justifyContent: "center",
  },
  dealDetails: {
    flex: 1,
  },
  dealTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  dealMatch: { color: "#22c55e", fontSize: 12, fontWeight: "700" },
  dealBadge: {
    backgroundColor: "#b91c4f",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  dealBadgeText: { color: "#fff", fontSize: 11, fontWeight: "700" },
  dealName: { color: "#fefefe", fontSize: 17, fontWeight: "800" },
  dealMeta: { color: "#888", fontSize: 12, marginBottom: 8 },
  dealPriceRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  dealPrice: { color: PINK, fontSize: 18, fontWeight: "800" },
  dealOldPrice: {
    color: "#555",
    textDecorationLine: "line-through",
    fontSize: 14,
  },
  horizontal: { marginBottom: 4 },
  buddingScrollContent: { paddingVertical: 4, paddingRight: 16 },
  buddingCard: {
    width: 132,
    minHeight: 220,
    backgroundColor: CARD,
    borderColor: CARD_BORDER,
    borderWidth: 1,
    borderRadius: 12,
    marginRight: 12,
    padding: 10,
  },
  productImageWrap: {
    width: "100%",
    height: 110,
    borderRadius: 10,
    backgroundColor: "#f2f4f7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    overflow: "hidden",
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  productMatchPill: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(28, 95, 56, 0.55)",
    borderWidth: 1,
    borderColor: "rgba(74, 222, 128, 0.18)",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 8,
  },
  productMatch: {
    color: "#26c55f",
    fontSize: 11,
    fontWeight: "700",
  },
  productTitle: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },
  productSubtitle: {
    color: "#8a8891",
    fontSize: 11,
    marginBottom: 8,
    textTransform: "lowercase",
  },
  productPrice: { color: PINK, fontSize: 14, fontWeight: "800" },
  dispensaryCard: {
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    borderRadius: 14,
    padding: 14,
    minHeight: 170,
  },
  dispensaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  dispensaryLogo: {
    color: PINK,
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 1,
  },
  dispensaryLogoImg: {
    width: 38,
    height: 38,
    borderRadius: 8,
  },
  dispensaryStatus: {
    fontSize: 11,
    fontWeight: "700",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  statusOpen: {
    color: "#22c55e",
    backgroundColor: "rgba(34,197,94,0.12)",
  },
  statusClosed: {
    color: "#aaa",
    backgroundColor: "rgba(50,50,50,0.6)",
  },
  dispensaryName: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 8,
  },
  dispensaryDetails: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  dispensaryDetail: {
    color: "#737682",
    fontSize: 12,
  },
  dispensaryMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  dispensaryDistance: {
    color: "#e44a92",
    fontSize: 12,
    fontWeight: "700",
  },
  dispensaryMetaDot: {
    color: "#737682",
    fontSize: 13,
    marginHorizontal: 8,
  },
  dispensaryMetaText: {
    color: "#737682",
    fontSize: 12,
  },
  comingSoonText: {
    color: "#555",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
  },
  footerNav: {
    height: 64,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#2a172a",
    flexDirection: "row",
    backgroundColor: "#11080f",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  tabItem: { alignItems: "center", justifyContent: "center", width: 68 },
  tabText: { color: "#888", fontSize: 10, marginTop: 2 },
});
