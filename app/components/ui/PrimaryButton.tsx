import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from "react-native";
import { COLORS } from "../theme";
import type { ReactNode } from "react";

type PrimaryButtonProps = {
  onPress: () => void;
  label: string;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  loading?: boolean;
  testID?: string;
};

export function PrimaryButton({
  onPress,
  label,
  disabled,
  style,
  textStyle,
  loading,
  testID,
}: PrimaryButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.buttonDisabled, style]}
      onPress={onPress}
      activeOpacity={0.85}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityState={{ disabled: Boolean(disabled || loading) }}
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
    backgroundColor: COLORS.primary,
    borderRadius: 50,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: COLORS.disabled,
  },
  label: {
    color: COLORS.textPrimary,
    fontWeight: "600",
    fontSize: 16,
  },
});
