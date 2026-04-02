import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';

const BG = '#130008';

export default function SetupLoading() {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => {
      router.replace('/setup-birthday');
    }, 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Text style={styles.text}>Loading...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { color: '#888', fontSize: 16 },
});
