import { Ionicons } from '@expo/vector-icons';
import { ScrollView, Text, View } from 'react-native';
import { SectionHero } from '../components/SectionHero';
import { ADMIN_COLORS } from '../constants';
import { businessRows } from '../data';
import { styles } from '../styles';

export function BusinessApplicationsSection() {
  return (
    <>
      <SectionHero
        title="Business Applications"
        subtitle="Review and approve business applications to join the BEEPR platform"
      />

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Application Management</Text>
        <Text style={styles.panelMeta}>2 total applications</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.headerCell, styles.businessCell]}>Business</Text>
              <Text style={[styles.headerCell, styles.contactCell]}>Contact</Text>
              <Text style={[styles.headerCell, styles.smallCell]}>Type</Text>
              <Text style={[styles.headerCell, styles.smallCell]}>Status</Text>
              <Text style={[styles.headerCell, styles.smallCell]}>Submitted</Text>
              <Text style={[styles.headerCell, styles.actionCell]}>Actions</Text>
            </View>

            {businessRows.map((row) => (
              <View key={row.business} style={styles.tableRow}>
                <View style={[styles.tableCell, styles.businessCell]}>
                  <Text style={styles.cellPrimary}>{row.business}</Text>
                  <Text style={styles.cellSecondary}>{row.email}</Text>
                </View>
                <View style={[styles.tableCell, styles.contactCell]}>
                  <Text style={styles.cellPrimary}>{row.contact}</Text>
                  <Text style={styles.cellSecondary}>{row.phone}</Text>
                </View>
                <View style={[styles.tableCell, styles.smallCell]}>
                  <View style={styles.typeBadge}>
                    <Text style={styles.typeBadgeText}>{row.type}</Text>
                  </View>
                </View>
                <View style={[styles.tableCell, styles.smallCell]}>
                  <View style={styles.successBadge}>
                    <Ionicons name="checkmark-circle-outline" size={12} color="#d7ffe3" />
                    <Text style={styles.successBadgeText}>{row.status}</Text>
                  </View>
                </View>
                <View style={[styles.tableCell, styles.smallCell]}>
                  <Text style={styles.cellPrimary}>{row.submitted}</Text>
                </View>
                <View style={[styles.tableCell, styles.actionCell]}>
                  <View style={styles.reviewButton}>
                    <Ionicons name="eye-outline" size={13} color={ADMIN_COLORS.text} />
                    <Text style={styles.reviewButtonText}>Review</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </>
  );
}
