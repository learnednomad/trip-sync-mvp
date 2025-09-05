import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSupabaseAuth } from '@/lib/auth/supabase-auth';
import { Card } from '@/components/ui/card';
import { MVPLoadingSpinner as LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { MVPErrorState as ErrorState } from '@/components/ui/ErrorState';

export default function HomeScreen() {
  const user = useSupabaseAuth.use.user();
  const isLoading = useSupabaseAuth.use.isLoading();

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <LoadingSpinner />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.welcomeCard}>
          <Text style={styles.welcomeText}>
            Welcome{user?.email ? `, ${user.email}` : ''}!
          </Text>
          <Text style={styles.subText}>
            Your trip dashboard will appear here
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
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeCard: {
    padding: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  subText: {
    fontSize: 16,
    color: '#666',
  },
});
