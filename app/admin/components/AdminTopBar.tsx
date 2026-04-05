import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { ADMIN_COLORS } from '../constants';
import { styles } from '../styles';

export function AdminTopBar() {
  return (
    <View style={styles.topBar}>
      <View style={styles.topBarLeft}>
        <View style={styles.windowDot} />
        <Text style={styles.topBrand}>beepr</Text>
        <View style={styles.adminPill}>
          <Text style={styles.adminPillText}>Admin Panel</Text>
        </View>
      </View>

      <View style={styles.topBarActions}>
        <View style={styles.iconButton}>
          <Ionicons name="notifications-outline" size={16} color={ADMIN_COLORS.textMuted} />
        </View>
        <View style={styles.iconButton}>
          <Ionicons name="grid-outline" size={16} color={ADMIN_COLORS.textMuted} />
        </View>
      </View>
    </View>
  );
}
