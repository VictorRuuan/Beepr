import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, Image, Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../lib/supabase';

const PINK = '#c4185c';
const BG = '#130008';

export default function SetupName() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function pickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Allow access to your photo library.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setAvatarUri(result.assets[0].uri);
    }
  }

  async function handleContinue() {
    if (!name.trim() || loading) return;
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      let avatarUrl: string | null = null;

      if (avatarUri) {
        try {
          const ext = avatarUri.split('.').pop()?.toLowerCase() ?? 'jpg';
          const path = `avatars/${user.id}.${ext}`;
          const response = await fetch(avatarUri);
          const blob = await response.blob();
          const { error: uploadError } = await supabase.storage
            .from('user-uploads')
            .upload(path, blob, {
              contentType: `image/${ext === 'jpg' ? 'jpeg' : ext}`,
              upsert: true,
            });
          if (!uploadError) {
            const { data: { publicUrl } } = supabase.storage
              .from('user-uploads')
              .getPublicUrl(path);
            avatarUrl = publicUrl;
          }
        } catch (e) {
          console.warn('[SetupName] Photo upload error:', e);
        }
      }

      await supabase.from('profiles').upsert(
        {
          user_id: user.id,
          email: user.email ?? '',
          display_name: name.trim(),
          ...(avatarUrl ? { avatar_url: avatarUrl } : {}),
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' },
      );
    }

    setLoading(false);
    router.push('/setup-phone');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />

      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      <View style={styles.container}>
        <Text style={styles.title}>My Name Is...</Text>

        {/* Avatar picker */}
        <View style={styles.avatarSection}>
          <Text style={styles.avatarLabel}>
            A Picture of Me{' '}
            <Text style={styles.avatarOptional}>(Optional)</Text>
          </Text>
          <View style={styles.avatarWrapper}>
            <TouchableOpacity onPress={pickImage} activeOpacity={0.8}>
              {avatarUri ? (
                <Image source={{ uri: avatarUri }} style={styles.avatarCircle} />
              ) : (
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarQuestion}>?</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.cameraBtn} activeOpacity={0.85} onPress={pickImage}>
              <Ionicons name="camera" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* First Name */}
        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter your first name"
          placeholderTextColor="#555"
        />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.btn, (!name.trim() || loading) && styles.btnMuted]}
          disabled={!name.trim() || loading}
          activeOpacity={0.85}
          onPress={handleContinue}
        >
          <Text style={styles.btnText}>{loading ? 'Saving...' : 'Continue'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },
  back: { paddingHorizontal: 20, paddingTop: 8 },
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 16 },
  title: { color: '#fff', fontSize: 28, fontWeight: '700', marginBottom: 32 },

  avatarSection: { alignItems: 'center', marginBottom: 36 },
  avatarLabel: { color: '#ccc', fontSize: 14, marginBottom: 16 },
  avatarOptional: { color: '#666' },
  avatarWrapper: { position: 'relative' },
  avatarCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#17131a',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2f1d2f',
    overflow: 'hidden',
  },
  avatarQuestion: { color: '#888', fontSize: 36, fontWeight: '300' },
  cameraBtn: {
    position: 'absolute',
    bottom: 2,
    right: -4,
    backgroundColor: PINK,
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: BG,
  },

  label: { color: '#ccc', fontSize: 13, fontWeight: '600', marginBottom: 10 },
  input: {
    backgroundColor: '#17131a',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#2f1d2f',
  },

  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 12,
    backgroundColor: BG,
  },
  btn: {
    backgroundColor: PINK,
    borderRadius: 50,
    paddingVertical: 18,
    alignItems: 'center',
  },
  btnMuted: { backgroundColor: '#7a1040' },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
