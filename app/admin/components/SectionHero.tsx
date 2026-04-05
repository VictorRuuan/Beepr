import { Text, View } from 'react-native';
import { styles } from '../styles';

type SectionHeroProps = {
  title: string;
  subtitle: string;
};

export function SectionHero({ title, subtitle }: SectionHeroProps) {
  return (
    <View style={styles.hero}>
      <Text style={styles.heroTitle}>{title}</Text>
      <Text style={styles.heroSubtitle}>{subtitle}</Text>
    </View>
  );
}
