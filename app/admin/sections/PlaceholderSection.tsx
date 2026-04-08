import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { SectionHero } from '../components/SectionHero';
import { ADMIN_COLORS } from '../constants';
import { styles } from '../styles';
import { IconName } from '../types';

type PlaceholderSectionProps = {
  title: string;
  subtitle: string;
  icon: IconName;
};

export function PlaceholderSection({ title, subtitle, icon }: PlaceholderSectionProps) {
  return (
    <>
      <SectionHero title={title} subtitle={subtitle} />

      <View style={styles.panel}>
        <View style={styles.emptyState}>
          <View style={styles.emptyIconWrap}>
            <Ionicons name={icon} size={28} color={ADMIN_COLORS.textDim} />
          </View>
          <Text style={styles.emptyTitle}>{title}</Text>
          <Text style={styles.emptyCopy}>
            This section is now clickable and ready for the next design references you send.
          </Text>
        </View>
      </View>
    </>
  );
}
