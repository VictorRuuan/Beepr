import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { SectionHero } from '../components/SectionHero';
import { ADMIN_COLORS } from '../constants';
import { overviewCards } from '../data';
import { styles } from '../styles';

export function DashboardSection() {
  return (
    <>
      <SectionHero
        title="Dashboard"
        subtitle="Overview of core admin operations, queues, and marketplace activity"
      />

      <View style={styles.overviewGrid}>
        {overviewCards.map((card) => (
          <View key={card.label} style={styles.metricPanel}>
            <View style={styles.metricIconWrap}>
              <Ionicons name={card.icon} size={18} color={ADMIN_COLORS.textMuted} />
            </View>
            <View>
              <Text style={styles.metricValue}>{card.value}</Text>
              <Text style={styles.metricLabel}>{card.label}</Text>
              <Text style={styles.metricHint}>{card.hint}</Text>
            </View>
          </View>
        ))}
      </View>
    </>
  );
}
