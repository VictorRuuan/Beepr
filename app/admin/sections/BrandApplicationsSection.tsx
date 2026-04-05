import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { SectionHero } from '../components/SectionHero';
import { ADMIN_COLORS } from '../constants';
import { styles } from '../styles';

export function BrandApplicationsSection() {
  return (
    <>
      <SectionHero
        title="Brand Applications"
        subtitle="Review and approve brand applications to join the BEEPR platform"
      />

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Application Management</Text>
        <Text style={styles.panelMeta}>0 total applications</Text>

        <View style={styles.emptyState}>
          <View style={styles.emptyIconWrap}>
            <Ionicons name="pricetag-outline" size={28} color={ADMIN_COLORS.textDim} />
          </View>
          <Text style={styles.emptyTitle}>No applications yet</Text>
          <Text style={styles.emptyCopy}>Brand applications will appear here when submitted</Text>
        </View>
      </View>
    </>
  );
}
