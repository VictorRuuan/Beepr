import { ScrollView, Text, View } from 'react-native';
import { navSections } from '../data';
import { styles } from '../styles';
import { SectionKey } from '../types';
import { SidebarItem } from './SidebarItem';

type AdminSidebarProps = {
  isCompact: boolean;
  activeSection: SectionKey;
  onSectionPress: (section: SectionKey) => void;
};

export function AdminSidebar({ isCompact, activeSection, onSectionPress }: AdminSidebarProps) {
  return (
    <View style={[styles.sidebar, isCompact && styles.sidebarCompact]}>
      <View style={styles.sidebarHeader}>
        <Text style={styles.sidebarBrand}>beepr</Text>
        <Text style={styles.sidebarMeta}>Cannabis Marketplace</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.sidebarScrollContent}
      >
        {navSections.map((section) => (
          <View key={section.title} style={styles.sidebarSection}>
            <Text style={styles.sidebarSectionTitle}>{section.title}</Text>
            {section.items.map((item) => (
              <SidebarItem
                key={item.key}
                item={item}
                active={activeSection === item.key}
                onPress={() => onSectionPress(item.key)}
              />
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
