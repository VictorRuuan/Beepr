import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, View, useWindowDimensions } from 'react-native';
import { AdminSidebar } from './components/AdminSidebar';
import { AdminTopBar } from './components/AdminTopBar';
import { isSectionKey, placeholderContent } from './data';
import { BrandApplicationsSection } from './sections/BrandApplicationsSection';
import { BusinessApplicationsSection } from './sections/BusinessApplicationsSection';
import { CustomersSection } from './sections/CustomersSection';
import { DashboardSection } from './sections/DashboardSection';
import { PlaceholderSection } from './sections/PlaceholderSection';
import { styles } from './styles';
import { SectionKey } from './types';

function renderAdminSection(activeSection: SectionKey) {
  switch (activeSection) {
    case 'dashboard':
      return <DashboardSection />;
    case 'customers':
      return <CustomersSection />;
    case 'businessApplications':
      return <BusinessApplicationsSection />;
    case 'brandApplications':
      return <BrandApplicationsSection />;
    default: {
      // Placeholder sections keep the route map ready while the rest of the admin is built.
      const content = placeholderContent[activeSection];
      return (
        <PlaceholderSection
          title={content.title}
          subtitle={content.subtitle}
          icon={content.icon}
        />
      );
    }
  }
}

export default function AdminDashboardScreen() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const params = useLocalSearchParams<{ section?: string | string[] }>();
  const isCompact = width < 980;
  const isMobile = width < 720;
  const sectionParam = Array.isArray(params.section) ? params.section[0] : params.section;
  const activeSection: SectionKey = isSectionKey(sectionParam) ? sectionParam : 'customers';

  const handleSectionPress = (section: SectionKey) => {
    // Route-driven navigation keeps the selected sidebar item in sync with the content area.
    router.replace({
      pathname: '/admin',
      params: { section },
    });
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />

      <View style={[styles.shell, isCompact && styles.shellCompact]}>
        <AdminSidebar
          isCompact={isCompact}
          activeSection={activeSection}
          onSectionPress={handleSectionPress}
        />

        <View style={styles.main}>
          <AdminTopBar />

          <ScrollView
            style={styles.contentScroll}
            contentContainerStyle={[styles.content, isMobile && styles.contentMobile]}
            showsVerticalScrollIndicator={false}
          >
            {renderAdminSection(activeSection)}
          </ScrollView>
        </View>
      </View>
    </View>
  );
}
