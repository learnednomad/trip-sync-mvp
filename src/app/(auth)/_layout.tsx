import { Stack, Redirect } from 'expo-router';
import React from 'react';
import { useTheme } from '@/theme/ThemeContext';
import { useSupabaseAuth } from '@/lib/auth/supabase-auth';

export const unstable_settings = {
  initialRouteName: 'sign-in',
};

export default function AuthLayout() {
  const { theme } = useTheme();
  const isAuthenticated = useSupabaseAuth.use.isAuthenticated();
  const isLoading = useSupabaseAuth.use.isLoading();

  // Redirect to tabs if already authenticated
  // This prevents authenticated users from accessing auth screens
  if (!isLoading && isAuthenticated) {
    return <Redirect href="/(tabs)/home" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: theme.colors.background,
        },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="sign-in"
        options={{
          title: 'Sign In',
        }}
      />
      <Stack.Screen
        name="sign-up"
        options={{
          title: 'Sign Up',
          animation: 'slide_from_bottom',
        }}
      />
      <Stack.Screen
        name="forgot-password"
        options={{
          title: 'Forgot Password',
          animation: 'fade',
        }}
      />
    </Stack>
  );
}
