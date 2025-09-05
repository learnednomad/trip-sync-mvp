import { Tabs, Redirect } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import {
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useSupabaseAuth } from '@/lib/auth/supabase-auth';

export const unstable_settings = {
  initialRouteName: 'home',
};

export default function TabLayout() {
  const primaryColor = useThemeColor({}, 'primary');
  const textColor = useThemeColor({}, 'text');
  const isAuthenticated = useSupabaseAuth.use.isAuthenticated();
  const isLoading = useSupabaseAuth.use.isLoading();

  // Protected route: Redirect to auth if not authenticated
  if (!isLoading && !isAuthenticated) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: primaryColor,
        tabBarInactiveTintColor: textColor,
        headerShown: false, // We'll handle headers in stack navigators
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
          lazy: true, // Enable lazy loading
        }}
      />

      <Tabs.Screen
        name="trips"
        options={{
          title: 'Trips',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="card-travel" size={size} color={color} />
          ),
          lazy: true, // Enable lazy loading
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="compass" size={size} color={color} />
          ),
          lazy: true, // Enable lazy loading
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
          lazy: true, // Enable lazy loading
        }}
      />
    </Tabs>
  );
}
