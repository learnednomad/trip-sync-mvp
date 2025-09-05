import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/ui/card';
import { useSupabaseAuth } from '@/lib/auth/supabase-auth';

export default function ProfileScreen() {
  const user = useSupabaseAuth.use.user();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.email?.charAt(0).toUpperCase() || '?'}
            </Text>
          </View>
          <Text style={styles.email}>{user?.email || 'Not logged in'}</Text>
          <Text style={styles.userId}>
            User ID: {user?.id?.slice(0, 8) || 'N/A'}
          </Text>
        </Card>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  profileCard: {
    padding: 24,
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '600',
    color: 'white',
  },
  email: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 8,
  },
  userId: {
    fontSize: 14,
    color: '#666',
  },
});
