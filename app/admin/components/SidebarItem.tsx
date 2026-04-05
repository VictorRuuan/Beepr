import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, Text } from 'react-native';
import { ADMIN_COLORS } from '../constants';
import { styles } from '../styles';
import { NavItem } from '../types';

type SidebarItemProps = {
  item: NavItem;
  active: boolean;
  onPress: () => void;
};

export function SidebarItem({ item, active, onPress }: SidebarItemProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <Pressable
      onPress={onPress}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      style={({ pressed }) => [
        styles.navItem,
        active && styles.navItemActive,
        hovered && !active && styles.navItemHover,
        pressed && styles.navItemPressed,
      ]}
    >
      <Ionicons
        name={item.icon}
        size={15}
        color={active ? ADMIN_COLORS.text : hovered ? '#d8ddeb' : ADMIN_COLORS.textDim}
      />
      <Text
        style={[
          styles.navItemText,
          active && styles.navItemTextActive,
          hovered && !active && styles.navItemTextHover,
        ]}
      >
        {item.label}
      </Text>
    </Pressable>
  );
}
