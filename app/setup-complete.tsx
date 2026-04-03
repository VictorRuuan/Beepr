import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const PINK = "#c4185c";
const BG = "#130008";
const CARD = "#17131a";
const CARD_BORDER = "#2f1d2f";

const buddingItems = [
  {
    id: 1,
    title: "Blue Dream",
    subtitle: "indica",
    price: "$45.00",
    match: "100% Perfect Match",
    image: "https://via.placeholder.com/96x96/222/fff?text=BD",
  },
  {
    id: 2,
    title: "Blue Gas - Golden...",
    subtitle: "indica",
    price: "$55.00",
    match: "100% Perfect Match",
    image: "https://via.placeholder.com/96x96/225/fff?text=BG",
  },
  {
    id: 3,
    title: "Test Strain",
    subtitle: "sativa",
    price: "$49.99",
    match: "100% Perfect Match",
    image: "https://via.placeholder.com/96x96/228/fff?text=TS",
  },
];

export default function SetupComplete() {
  const router = useRouter();

  return (
    <View style={styles.safe}>
      <StatusBar style="light" />

      <View style={styles.topBar}>
        <Text style={styles.brand}>beepr</Text>
        <View style={styles.locationWrapper}>
          <Ionicons name="location-sharp" size={18} color="#fff" />
          <Text style={styles.locationText}>2651</Text>
        </View>
        <View style={styles.topActions}>
          <Ionicons name="cube" size={18} color="#fff" />
          <Ionicons
            name="cart"
            size={18}
            color="#fff"
            style={{ marginLeft: 12 }}
          />
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.sectionTitle}>Featured Promotion</Text>
        <View style={styles.promoCard}>
          <View style={styles.promoLabelWrap}>
            <Text style={styles.promoLabel}>Featured Promotion</Text>
          </View>
          <Text style={styles.promoCardTitle}>Blue Dream</Text>
          <Text style={styles.promoCardSub}>Best Gas in Town</Text>
        </View>

        <Text style={[styles.sectionTitle, { marginTop: 16 }]}>
          Deals For You
        </Text>
        <View style={styles.dealCard}>
          <View style={styles.dealTopRow}>
            <Text style={styles.dealMatch}>92% Perfect Match</Text>
            <View style={styles.dealBadge}>
              <Text style={styles.dealBadgeText}>33% OFF</Text>
            </View>
          </View>
          <Text style={styles.dealName}>Lemon Cake Blaze</Text>
          <Text style={styles.dealMeta}>indica • flower</Text>
          <View style={styles.dealPriceRow}>
            <Text style={styles.dealPrice}>$30.00</Text>
            <Text style={styles.dealOldPrice}>$45.00</Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { marginTop: 16 }]}>
          Budding Interest
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.horizontal}
          contentContainerStyle={{ paddingVertical: 4 }}
        >
          {buddingItems.map((item) => (
            <View key={item.id} style={styles.buddingCard}>
              <Image source={{ uri: item.image }} style={styles.productImage} />
              <Text style={styles.productMatch}>{item.match}</Text>
              <Text style={styles.productTitle}>{item.title}</Text>
              <Text style={styles.productSubtitle}>{item.subtitle}</Text>
              <Text style={styles.productPrice}>{item.price}</Text>
            </View>
          ))}
        </ScrollView>

        <Text style={[styles.sectionTitle, { marginTop: 16 }]}>
          Dispensaries Near You
        </Text>
        <View style={styles.dispensaryCard}>
          <View style={styles.dispensaryHeader}>
            <Text style={styles.dispensaryLogo}>beepr</Text>
            <Text style={styles.dispensaryStatus}>Closed</Text>
          </View>
          <Text style={styles.dispensaryName}>Ryder's Test Business</Text>
          <View style={styles.dispensaryDetails}>
            <Ionicons name="location" size={14} color="#888" />
            <Text style={styles.dispensaryDetail}>California</Text>
          </View>
          <View style={styles.dispensaryDetails}>
            <Ionicons name="time" size={14} color="#888" />
            <Text style={styles.dispensaryDetail}>Closed</Text>
          </View>
          <Text style={styles.dispensaryDistance}>0 mi • 7 products</Text>
        </View>

        <Text style={[styles.sectionTitle, { marginTop: 16 }]}>
          Hottest Products in Your Area
        </Text>
        <Text style={styles.comingSoonText}>More products coming soon</Text>

        <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Buy Again</Text>
        <Text style={styles.comingSoonText}>More products coming soon</Text>
      </ScrollView>

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
        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="heart" size={22} color="#888" />
          <Text style={styles.tabText}>Favorites</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="person" size={22} color="#888" />
          <Text style={styles.tabText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },
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
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
  },
  promoCard: {
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    borderRadius: 14,
    padding: 14,
    minHeight: 110,
    justifyContent: "center",
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
  buddingCard: {
    width: 170,
    height: 210,
    backgroundColor: CARD,
    borderColor: CARD_BORDER,
    borderWidth: 1,
    borderRadius: 14,
    marginRight: 12,
    padding: 10,
  },
  productImage: {
    width: "100%",
    height: 90,
    borderRadius: 10,
    marginBottom: 8,
  },
  productMatch: {
    color: "#26c55f",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 4,
  },
  productTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  productSubtitle: {
    color: "#888",
    fontSize: 12,
    marginBottom: 8,
  },
  productPrice: { color: PINK, fontSize: 16, fontWeight: "800" },
  dispensaryCard: {
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    borderRadius: 14,
    padding: 14,
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
  dispensaryStatus: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
    backgroundColor: "#222",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  dispensaryName: {
    color: "#fff",
    fontSize: 16,
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
    color: "#888",
    fontSize: 12,
  },
  dispensaryDistance: {
    color: "#c4185c",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 6,
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
