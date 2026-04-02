import { View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function Register() {
  return (
    <View style={{ flex: 1, backgroundColor: '#0d0008', alignItems: 'center', justifyContent: 'center' }}>
      <StatusBar style="light" />
      <Text style={{ color: '#fff' }}>Create Account</Text>
    </View>
  );
}
