import { StyleSheet, TextInput, View, Text } from "react-native";
import { COLORS } from "../theme";

type InputFieldProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  error?: string;
  testID?: string;
};

export function InputField({
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType = "default",
  autoCapitalize = "none",
  error,
  testID,
}: InputFieldProps) {
  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, error && styles.errorInput]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#555"
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={false}
        accessibilityLabel={placeholder}
        accessibilityHint={error ? error : ""}
        testID={testID}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#2a0f1a",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    color: COLORS.textPrimary,
    fontSize: 16,
  },
  errorInput: {
    borderWidth: 1,
    borderColor: "#ff4d6d",
  },
  errorText: {
    color: "#ff4d6d",
    fontSize: 12,
    marginTop: 4,
  },
});
