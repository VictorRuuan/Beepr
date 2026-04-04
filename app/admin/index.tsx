import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

const COLORS = {
  bg: '#12020b',
  shell: '#17181d',
  sidebar: '#20242b',
  sidebarBorder: '#2d313a',
  panel: '#1a1d23',
  panelMuted: '#1f232b',
  border: '#2d3340',
  text: '#f4f6fb',
  textMuted: '#96a0b5',
  textDim: '#6e778c',
  accent: '#f03f8f',
  accentSoft: '#34101f',
  success: '#4bd37b',
  info: '#4f8cff',
  warning: '#ff8d3a',
  pill: '#eefbed',
  pillText: '#4a8f53',
};

const navSections = [
  {
    title: 'Overview',
    items: ['Dashboard', 'Sales', 'Customers'],
  },
  {
    title: 'Operations',
    items: ['Provider Management', 'Orders', 'Products', 'Applications'],
  },
  {
    title: 'Catalog',
    items: ['Brands', 'Categories', 'Inventory'],
  },
  {
    title: 'System',
    items: ['Moderation', 'Reports', 'Settings'],
  },
];

const summaryCards = [
  { label: 'Total Users', value: '5', hint: 'All registered users', marker: '23' },
  { label: 'Active Providers', value: '2', hint: 'Approved businesses', marker: '[]' },
  { label: 'Active Products', value: '245', hint: 'Live in marketplace', marker: 'Bx' },
  { label: 'Pending Orders', value: '1', hint: 'Needs attention', tone: 'warning', marker: 'Cr' },
  { label: 'Monthly Revenue', value: '$0.00', hint: 'Current month', marker: '$' },
  { label: 'Pending Approvals', value: '0', hint: 'All clear', tone: 'warning', marker: 'Ap' },
];

const recentActivity = [
  { title: 'Order pending', subtitle: 'Ryder  -  $13.20', age: '6 days ago', tone: 'success' },
  { title: 'Order cancelled', subtitle: 'Ryder  -  $66.00', age: 'about 1 month ago', tone: 'success' },
  { title: 'Order ready', subtitle: 'Ryder  -  $33.00', age: 'about 1 month ago', tone: 'success' },
  { title: 'Order completed', subtitle: 'Ryder  -  $33.00', age: 'about 1 month ago', tone: 'success' },
  { title: 'Order completed', subtitle: 'Ryder  -  $0.01', age: 'about 1 month ago', tone: 'success' },
  { title: 'Business application submitted', subtitle: "Ryder's Test Business", age: '4 months ago', tone: 'info' },
  { title: 'Business application submitted', subtitle: 'Goldenhour Collective', age: '5 months ago', tone: 'info' },
];

export default function AdminDashboardScreen() {
  const { width } = useWindowDimensions();
  const isCompact = width < 900;
  const isMobile = width < 640;

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />

      <View style={[styles.shell, isCompact && styles.shellCompact]}>
        <View style={[styles.sidebar, isCompact && styles.sidebarCompact]}>
          <View style={styles.brandBlock}>
            <Text style={styles.brand}>beepr</Text>
            <Text style={styles.brandMeta}>Cannabis Marketplace</Text>
          </View>

          {navSections.map((section) => (
            <View key={section.title} style={styles.sectionBlock}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              {section.items.map((item) => {
                const active = item === 'Dashboard';
                return (
                  <View key={item} style={[styles.navItem, active && styles.navItemActive]}>
                    <Text style={[styles.navItemText, active && styles.navItemTextActive]}>{item}</Text>
                  </View>
                );
              })}
            </View>
          ))}
        </View>

        <View style={styles.main}>
          <View style={styles.topBar}>
            <View style={styles.topBarLeft}>
              <View style={styles.miniIcon}>
                <View style={styles.miniIconInset} />
              </View>
              <Text style={styles.topBrand}>beepr</Text>
              <View style={styles.adminPill}>
                <Text style={styles.adminPillText}>Admin Panel</Text>
              </View>
            </View>

            <View style={styles.statusPill}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>System healthy</Text>
            </View>
          </View>

          <ScrollView
            style={styles.contentScroll}
            contentContainerStyle={[styles.content, isMobile && styles.contentMobile]}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.hero}>
              <Text style={styles.heroTitle}>Dashboard</Text>
              <Text style={styles.heroSubtitle}>Welcome to Beepr Admin Panel</Text>
            </View>

            <View style={[styles.cardGrid, isCompact && styles.cardGridCompact]}>
              {summaryCards.map((card) => (
                <View
                  key={card.label}
                  style={[
                    styles.statCard,
                    isCompact && styles.statCardCompact,
                    isMobile && styles.statCardMobile,
                  ]}
                >
                  <View style={styles.statHeader}>
                    <Text style={styles.statLabel}>{card.label}</Text>
                    <Text style={styles.statMarker}>{card.marker}</Text>
                  </View>
                  <Text style={styles.statValue}>{card.value}</Text>
                  <Text
                    style={[
                      styles.statHint,
                      card.tone === 'warning' && styles.statHintWarning,
                    ]}
                  >
                    {card.hint}
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.activityPanel}>
              <Text style={styles.panelTitle}>Recent Activity</Text>
              <View style={styles.activityList}>
                {recentActivity.map((item) => (
                  <View key={`${item.title}-${item.subtitle}`} style={styles.activityRow}>
                    <View style={styles.activityLeft}>
                      <View
                        style={[
                          styles.activityDot,
                          item.tone === 'info' ? styles.activityDotInfo : styles.activityDotSuccess,
                        ]}
                      />
                      <View style={styles.activityCopy}>
                        <Text style={styles.activityTitle}>{item.title}</Text>
                        <Text style={styles.activitySubtitle}>{item.subtitle}</Text>
                      </View>
                    </View>
                    <Text style={styles.activityAge}>{item.age}</Text>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  shell: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: COLORS.bg,
  },
  shellCompact: {
    flexDirection: 'column',
  },
  sidebar: {
    width: 250,
    backgroundColor: COLORS.sidebar,
    borderRightWidth: 1,
    borderRightColor: COLORS.sidebarBorder,
    paddingHorizontal: 18,
    paddingTop: 26,
    paddingBottom: 24,
  },
  sidebarCompact: {
    width: '100%',
    borderRightWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.sidebarBorder,
    paddingBottom: 12,
  },
  brandBlock: {
    paddingBottom: 18,
    marginBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.sidebarBorder,
  },
  brand: {
    color: COLORS.text,
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -1,
  },
  brandMeta: {
    marginTop: 4,
    color: COLORS.textDim,
    fontSize: 13,
  },
  sectionBlock: {
    marginBottom: 22,
  },
  sectionTitle: {
    color: COLORS.textDim,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  navItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 4,
  },
  navItemActive: {
    backgroundColor: '#2a2f36',
  },
  navItemText: {
    color: '#c9d0df',
    fontSize: 14,
    fontWeight: '500',
  },
  navItemTextActive: {
    color: COLORS.text,
    fontWeight: '700',
  },
  main: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  topBar: {
    height: 72,
    borderBottomWidth: 1,
    borderBottomColor: '#37111f',
    backgroundColor: '#16181e',
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  miniIcon: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#c7ccda',
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniIconInset: {
    width: 10,
    height: 10,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#c7ccda',
  },
  topBrand: {
    color: COLORS.accent,
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -1,
  },
  adminPill: {
    backgroundColor: COLORS.accent,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  adminPillText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.pill,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: COLORS.success,
  },
  statusText: {
    color: COLORS.pillText,
    fontSize: 12,
    fontWeight: '700',
  },
  contentScroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 18,
    paddingVertical: 20,
    gap: 18,
  },
  contentMobile: {
    paddingHorizontal: 12,
  },
  hero: {
    backgroundColor: COLORS.accentSoft,
    borderWidth: 1,
    borderColor: '#4f1730',
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 18,
  },
  heroTitle: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    marginTop: 4,
    color: '#9d8ea1',
    fontSize: 15,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  cardGridCompact: {
    gap: 12,
  },
  statCard: {
    minWidth: 170,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: '15%',
    backgroundColor: COLORS.panel,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  statCardCompact: {
    flexBasis: '31%',
  },
  statCardMobile: {
    flexBasis: '100%',
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  statLabel: {
    color: COLORS.textMuted,
    fontSize: 14,
    fontWeight: '600',
  },
  statMarker: {
    color: '#687188',
    fontSize: 13,
    fontWeight: '700',
  },
  statValue: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 6,
  },
  statHint: {
    color: COLORS.textDim,
    fontSize: 13,
    fontWeight: '500',
  },
  statHintWarning: {
    color: COLORS.warning,
  },
  activityPanel: {
    backgroundColor: COLORS.panel,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 18,
  },
  panelTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 16,
  },
  activityList: {
    gap: 12,
  },
  activityRow: {
    backgroundColor: COLORS.panelMuted,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#212733',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
  },
  activityLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    marginRight: 12,
  },
  activityDotSuccess: {
    backgroundColor: COLORS.success,
  },
  activityDotInfo: {
    backgroundColor: COLORS.info,
  },
  activityCopy: {
    flex: 1,
  },
  activityTitle: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '700',
  },
  activitySubtitle: {
    marginTop: 2,
    color: COLORS.textMuted,
    fontSize: 13,
  },
  activityAge: {
    color: COLORS.textDim,
    fontSize: 12,
    fontWeight: '500',
  },
});
