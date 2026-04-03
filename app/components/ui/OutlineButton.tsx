import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from "react-native";
import { COLORS } from "../theme";
import type { ReactNode } from "react";

type OutlineButtonProps = {
  onPress: () => void;
  label: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  loading?: boolean;
  testID?: string;
};

export function OutlineButton({
  onPress,
  label,
  style,
  textStyle,
  loading,
  testID,
}: OutlineButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      activeOpacity={0.85}
      disabled={loading}
      accessibilityRole="button"
      testID={testID}
    >
      <Text style={[styles.label, textStyle]}>
        {loading ? "Loading..." : label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderRadius: 50,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  label: {
    color: COLORS.primary,
    fontWeight: "600",
    fontSize: 16,
  },
});
