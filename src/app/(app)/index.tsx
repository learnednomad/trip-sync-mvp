import React from 'react';
import { View, Text, PlatformButton } from '@/components/ui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSupabaseAuth } from '@/lib/auth/supabase-auth';
import { useRouter } from 'expo-router';

export default function TripsScreen() {
  const user = useSupabaseAuth.use.user();
  const router = useRouter();
  
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 p-6">
        {/* Welcome Message */}
        <View className="mb-6">
          <Text className="text-2xl font-bold">
            Welcome{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ''}!
          </Text>
          <Text className="text-base opacity-60 mt-1">
            Start planning your next adventure
          </Text>
        </View>
        
        {/* Empty State */}
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg text-center mb-4 opacity-60">
            No trips yet
          </Text>
          <Text className="text-sm text-center mb-6 opacity-50 px-8">
            Create your first trip to start tracking expenses with friends
          </Text>
          
          {/* TODO: Implement create trip functionality */}
          <PlatformButton 
            label="Create Trip" 
            onPress={() => {
              // TODO: Navigate to create trip screen
              console.log('Create trip pressed');
            }}
            variant="primary"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}