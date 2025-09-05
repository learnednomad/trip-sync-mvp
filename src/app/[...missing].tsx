import { Link, Stack, useRouter } from 'expo-router';
import { Text, View, TouchableOpacity } from 'react-native';
import { useSupabaseAuth } from '@/lib/auth/supabase-auth';
import { useEffect } from 'react';

export default function NotFoundScreen() {
  const router = useRouter();
  const isAuthenticated = useSupabaseAuth.use.isAuthenticated();

  // Auto-redirect after a short delay to prevent being stuck
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        router.replace('/(tabs)/home');
      } else {
        router.replace('/(auth)/sign-in');
      }
    }, 2000); // Auto-redirect after 2 seconds

    return () => clearTimeout(timer);
  }, [isAuthenticated, router]);

  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 }}>
        <Text style={{ marginBottom: 16, fontSize: 24, fontWeight: 'bold' }}>
          This screen doesn&apos;t exist.
        </Text>

        <Text style={{ marginBottom: 24, fontSize: 16, color: '#666' }}>
          Redirecting you back...
        </Text>

        <TouchableOpacity
          onPress={() => {
            if (isAuthenticated) {
              router.replace('/(tabs)/home');
            } else {
              router.replace('/(auth)/sign-in');
            }
          }}
          style={{ marginTop: 16 }}
        >
          <Text style={{ color: '#007AFF', textDecorationLine: 'underline', fontSize: 16 }}>
            Go to home screen!
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
