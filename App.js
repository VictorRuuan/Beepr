import "./global.css"; // Sempre a primeira linha
import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-slate-900">
      <StatusBar style="light" />
      <View className="bg-blue-500 p-6 rounded-2xl shadow-xl">
        <Text className="text-white text-2xl font-bold">
          Beepr Native 🚀
        </Text>
        <Text className="text-blue-100 mt-2">
          Tailwind + SDK 54 funcionando!
        </Text>
      </View>
    </View>
  );
}