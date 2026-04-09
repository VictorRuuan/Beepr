import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
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

const TRENDING = ["Blue Dream", "OG Kush", "Sour Diesel", "Girl Scout Cookies", "Pineapple Express"];
const CATEGORIES = ["Flower", "Edibles", "Concentrates", "Vapes", "Pre-rolls", "Topicals"];

function resolveImage(url?: string | null): string | undefined {
  if (!url) return undefined;
  if (url.startsWith("http")) return url;
  return `${SUPABASE_URL}/storage/v1/object/public/product-images/${url}`;
}

export default function SearchScreen() {
  const router = useRouter();
  const inputRef = useRef<TextInput>(null);
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadRecentSearches();
  }, []);

  const loadRecentSearches = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from("search_history")
      .select("id, search_term")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5);
    if (data) setRecentSearches(data);
  };

  const saveSearch = async (term: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("search_history").insert({ user_id: user.id, search_term: term });
    loadRecentSearches();
  };

  const deleteSearch = async (id: string) => {
    await supabase.from("search_history").delete().eq("id", id);
    setRecentSearches((prev) => prev.filter((s) => s.id !== id));
  };

  const handleSearch = async (term: string) => {
    if (!term.trim()) return;
    setLoading(true);
    setHasSearched(true);
    await saveSearch(term.trim());
    try {
      const { data, error } = await supabase.functions.invoke("search-products", {
        body: { search_term: term, page: 1, limit: 20, sort_by: "relevance", sort_order: "desc" },
      });
      if (error) throw error;
      setProducts(data?.products ?? []);
    } catch {
      Alert.alert("Error", "Search failed");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (productId: string) => {
    await supabase.functions.invoke("toggle-favorite", { body: { product_id: productId } });
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
      return next;
    });
  };

  const clearSearch = () => {
    setQuery("");
    setProducts([]);
    setHasSearched(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Search bar */}
      <View style={styles.searchHeader}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="#888" style={{ marginRight: 8 }} />
          <TextInput
            ref={inputRef}
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={() => handleSearch(query)}
            placeholder="Search products, strains, dispensaries..."
            placeholderTextColor="#555"
            returnKeyType="search"
            autoCorrect={false}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={clearSearch}>
              <Ionicons name="close-circle" size={18} color="#555" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {!hasSearched ? (
          <>
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Recent Searches</Text>
                <View style={styles.tagsRow}>
                  {recentSearches.map((s) => (
                    <View key={s.id} style={styles.recentTag}>
                      <TouchableOpacity
                        onPress={() => { setQuery(s.search_term); handleSearch(s.search_term); }}
                      >
                        <Text style={styles.recentTagText}>{s.search_term}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => deleteSearch(s.id)} style={{ marginLeft: 6 }}>
                        <Ionicons name="close" size={12} color="#888" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Trending */}
            <View style={styles.section}>
              <View style={styles.sectionRow}>
                <Ionicons name="trending-up" size={18} color={PINK} />
                <Text style={styles.sectionTitle}>Trending Searches</Text>
              </View>
              {TRENDING.map((term, i) => (
                <TouchableOpacity
                  key={term}
                  style={styles.trendingRow}
                  onPress={() => { setQuery(term); handleSearch(term); }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.trendingNum}>{i + 1}</Text>
                  <Text style={styles.trendingText}>{term}</Text>
                  <Ionicons name="search" size={14} color="#888" />
                </TouchableOpacity>
              ))}
            </View>

            {/* Categories */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Popular Categories</Text>
              <View style={styles.categoriesGrid}>
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={styles.categoryBtn}
                    onPress={() => { setQuery(cat); handleSearch(cat); }}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.categoryText}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        ) : loading ? (
          <View style={styles.centered}>
            <ActivityIndicator color={PINK} size="large" />
          </View>
        ) : products.length === 0 ? (
          <View style={styles.centered}>
            <Text style={styles.emptyTitle}>No results found</Text>
            <Text style={styles.emptySubtitle}>Try a different search term</Text>
          </View>
        ) : (
          <View style={styles.section}>
            <Text style={styles.resultCount}>
              {products.length} result{products.length !== 1 ? "s" : ""} for "{query}"
            </Text>
            {products.map((product) => {
              const imgUrl = resolveImage(product.image_url);
              const isFav = favorites.has(product.id);
              return (
                <TouchableOpacity
                  key={product.id}
                  style={styles.resultCard}
                  onPress={() => router.push(`/product/${product.id}`)}
                  activeOpacity={0.85}
                >
                  <View style={styles.resultImageWrap}>
                    {imgUrl ? (
                      <Image source={{ uri: imgUrl }} style={styles.resultImage} resizeMode="cover" />
                    ) : (
                      <View style={[styles.resultImage, styles.imagePlaceholder]}>
                        <Ionicons name="leaf" size={24} color={PINK} />
                      </View>
                    )}
                  </View>
                  <View style={styles.resultInfo}>
                    <View style={styles.resultTopRow}>
                      <Text style={styles.resultName} numberOfLines={1}>{product.name}</Text>
                      <TouchableOpacity onPress={() => handleToggleFavorite(product.id)}>
                        <Ionicons name={isFav ? "heart" : "heart-outline"} size={18} color={isFav ? PINK : "#888"} />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.resultMeta}>
                      {[product.strain_type, product.product_format].filter(Boolean).join(" · ")}
                    </Text>
                    {product.average_rating > 0 && (
                      <View style={styles.ratingRow}>
                        <Ionicons name="star" size={13} color={PINK} />
                        <Text style={styles.ratingText}>{product.average_rating.toFixed(1)}</Text>
                        <Text style={styles.reviewCount}>({product.review_count})</Text>
                      </View>
                    )}
                    <View style={styles.resultBottom}>
                      <Text style={styles.resultPrice}>${product.price?.toFixed(2)}</Text>
                      {product.business?.business_city && (
                        <View style={styles.locationRow}>
                          <Ionicons name="location-outline" size={12} color="#888" />
                          <Text style={styles.locationText}>{product.business.business_city}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  searchHeader: {
    paddingTop: 56,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: CARD_BORDER,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: CARD,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchInput: { flex: 1, color: "#fff", fontSize: 15 },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  section: { padding: 16 },
  sectionRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 },
  sectionTitle: { color: "#fff", fontSize: 16, fontWeight: "700", marginBottom: 12 },
  tagsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  recentTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: CARD,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: CARD_BORDER,
  },
  recentTagText: { color: "#ccc", fontSize: 13 },
  trendingRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: CARD,
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: CARD_BORDER,
  },
  trendingNum: { color: "#888", fontSize: 14, fontWeight: "700", width: 24 },
  trendingText: { flex: 1, color: "#fff", fontSize: 14 },
  categoriesGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  categoryBtn: {
    backgroundColor: CARD,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    width: "47%",
    alignItems: "center",
  },
  categoryText: { color: "#ccc", fontSize: 13, fontWeight: "600" },
  centered: { flex: 1, alignItems: "center", justifyContent: "center", paddingTop: 80 },
  emptyTitle: { color: "#fff", fontSize: 18, fontWeight: "700", marginBottom: 6 },
  emptySubtitle: { color: "#888", fontSize: 14 },
  resultCount: { color: "#888", fontSize: 13, marginBottom: 12 },
  resultCard: {
    flexDirection: "row",
    backgroundColor: CARD,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    marginBottom: 10,
    overflow: "hidden",
  },
  resultImageWrap: {},
  resultImage: { width: 88, height: 88 },
  imagePlaceholder: { justifyContent: "center", alignItems: "center", backgroundColor: "#1a0b1a" },
  resultInfo: { flex: 1, padding: 10 },
  resultTopRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 4 },
  resultName: { flex: 1, color: "#fff", fontSize: 14, fontWeight: "700", marginRight: 8 },
  resultMeta: { color: "#888", fontSize: 12, marginBottom: 4 },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 3, marginBottom: 4 },
  ratingText: { color: "#fff", fontSize: 12, fontWeight: "600" },
  reviewCount: { color: "#888", fontSize: 12 },
  resultBottom: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  resultPrice: { color: PINK, fontSize: 15, fontWeight: "700" },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 3 },
  locationText: { color: "#888", fontSize: 12 },
});
