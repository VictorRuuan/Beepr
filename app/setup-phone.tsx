import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';

const PINK = '#c4185c';
const BG = '#130008';

export default function SetupPhone() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleContinue() {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    router.push('/setup-loading');
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <SafeAreaView style={styles.safe}>
        <StatusBar style="light" />

        <View style={styles.container}>
          <Text style={styles.title}>What's Your Number?</Text>
          <Text style={styles.subtitle}>
            Businesses will use this to contact you about your orders
          </Text>

          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="(555) 123-4567"
            placeholderTextColor="#555"
            keyboardType="phone-pad"
          />
          <Text style={styles.hint}>
            Your phone number is required for order processing and updates
          </Text>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.btnOutline, (!phone.trim() || loading) && styles.btnOutlineMuted]}
            disabled={!phone.trim() || loading}
            activeOpacity={0.85}
            onPress={handleContinue}
          >
            <Text style={styles.btnOutlineText}>{loading ? 'Saving...' : 'Continue'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnSkip}
            activeOpacity={0.85}
            onPress={() => router.push('/setup-loading')}
          >
            <Text style={styles.btnSkipText}>Skip for Now</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 32 },
  title: { color: '#fff', fontSize: 26, fontWeight: '800', marginBottom: 8 },
  subtitle: { color: '#888', fontSize: 13, lineHeight: 19, marginBottom: 32 },
  label: { color: '#ccc', fontSize: 13, fontWeight: '600', marginBottom: 10 },
  input: {
    backgroundColor: '#17131a',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#2f1d2f',
  },
  hint: { color: '#666', fontSize: 12, lineHeight: 17 },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 12,
    gap: 10,
  },
  btnOutline: {
    backgroundColor: '#7a1040',
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
  },
  btnOutlineMuted: { opacity: 0.6 },
  btnOutlineText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  btnSkip: {
    backgroundColor: PINK,
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
  },
  btnSkipText: { color: '#fff', fontWeight: '600', fontSize: 15 },
});
