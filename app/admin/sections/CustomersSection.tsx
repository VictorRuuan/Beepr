import { Ionicons } from '@expo/vector-icons';
import { ScrollView, Text, View } from 'react-native';
import { SectionHero } from '../components/SectionHero';
import { ADMIN_COLORS } from '../constants';
import { customerRows } from '../data';
import { styles } from '../styles';

export function CustomersSection() {
  return (
    <>
      <SectionHero
        title="Customer Management"
        subtitle="Manage customer accounts from the mobile app"
      />

      <View style={styles.metricPanel}>
        <View style={styles.metricIconWrap}>
          <Ionicons name="people-outline" size={18} color={ADMIN_COLORS.textMuted} />
        </View>
        <View>
          <Text style={styles.metricValue}>2</Text>
          <Text style={styles.metricLabel}>Total Customers</Text>
        </View>
      </View>

      <View style={styles.searchPanel}>
        <Ionicons name="search-outline" size={16} color={ADMIN_COLORS.textDim} />
        <Text style={styles.searchPlaceholder}>Search customers by email or ID...</Text>
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Customers (2)</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.headerCell, styles.customerCellWide]}>User ID</Text>
              <Text style={[styles.headerCell, styles.emailCell]}>Email</Text>
              <Text style={[styles.headerCell, styles.nameCell]}>First Name</Text>
              <Text style={[styles.headerCell, styles.smallCell]}>Medical Card</Text>
              <Text style={[styles.headerCell, styles.smallCell]}>Joined Date</Text>
              <Text style={[styles.headerCell, styles.iconCell]}> </Text>
            </View>

            {customerRows.map((row) => (
              <View key={row.email} style={styles.tableRow}>
                <View style={[styles.tableCell, styles.customerCellWide, styles.customerInfoCell]}>
                  <View style={[styles.avatar, { backgroundColor: row.tone }]}>
                    <Text style={styles.avatarText}>{row.initials}</Text>
                  </View>
                  <Text style={styles.cellPrimary}>{row.userId}</Text>
                </View>
                <View style={[styles.tableCell, styles.emailCell, styles.inlineIconCell]}>
                  <Ionicons name="mail-outline" size={13} color={ADMIN_COLORS.textDim} />
                  <Text style={styles.cellPrimary}>{row.email}</Text>
                </View>
                <View style={[styles.tableCell, styles.nameCell]}>
                  <Text
                    style={[
                      styles.cellPrimary,
                      row.firstName === 'Not set' && styles.cellMutedItalic,
                    ]}
                  >
                    {row.firstName}
                  </Text>
                </View>
                <View style={[styles.tableCell, styles.smallCell]}>
                  <View style={styles.neutralBadge}>
                    <Text style={styles.neutralBadgeText}>{row.medicalCard}</Text>
                  </View>
                </View>
                <View style={[styles.tableCell, styles.smallCell]}>
                  <Text style={styles.cellSecondary}>{row.joined}</Text>
                </View>
                <View style={[styles.tableCell, styles.iconCell]}>
                  <Ionicons
                    name="ellipsis-horizontal"
                    size={16}
                    color={ADMIN_COLORS.textMuted}
                  />
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </>
  );
}
