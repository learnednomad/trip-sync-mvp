// Import global CSS file
import '../../global.css';

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import FlashMessage from 'react-native-flash-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';

import { APIProvider } from '@/api';
import { loadSelectedTheme } from '@/lib';
import { useThemeConfig } from '@/lib/use-theme-config';
import { initializeAuth, useSupabaseAuth } from '@/lib/auth/supabase-auth';
import { ActivityIndicator, View } from 'react-native';
import { ThemeProvider } from '@/theme/ThemeContext';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'index',
};

loadSelectedTheme();
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
// Set the animation options. This is optional.
SplashScreen.setOptions({
  duration: 500,
  fade: true,
});

export default function RootLayout() {
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    // Initialize auth when app starts
    initializeAuth().finally(() => {
      setIsReady(true);
    });
  }, []);

  if (!isReady) {
    return null; // Splash screen will remain visible
  }

  return (
    <Providers>
      <RootLayoutNav />
    </Providers>
  );
}

function RootLayoutNav() {
  const segments = useSegments();
  const router = useRouter();
  const isAuthenticated = useSupabaseAuth.use.isAuthenticated();
  const isLoading = useSupabaseAuth.use.isLoading();
  const [isNavigationReady, setIsNavigationReady] = React.useState(false);

  useEffect(() => {
    if (isLoading) return;

    // Handle hot reload or empty segments scenario
    if (!segments || segments.length === 0) {
      // Default navigation based on auth state
      if (isAuthenticated) {
        router.replace('/(tabs)/home');
      } else {
        router.replace('/(auth)/sign-in');
      }
      
      // Mark navigation as ready
      if (!isNavigationReady) {
        setIsNavigationReady(true);
        SplashScreen.hideAsync();
      }
      return;
    }

    const inAuthGroup = segments[0] === '(auth)';
    const inTabsGroup = segments[0] === '(tabs)';

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to sign in if not authenticated
      router.replace('/(auth)/sign-in');
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect to home if authenticated and in auth screens
      router.replace('/(tabs)/home');
    }

    // Mark navigation as ready and hide splash screen
    if (!isNavigationReady) {
      setIsNavigationReady(true);
      SplashScreen.hideAsync();
    }
  }, [isAuthenticated, segments, isLoading, router, isNavigationReady]);

  if (isLoading || !isNavigationReady) {
    // Show loading indicator while checking auth
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack 
      screenOptions={{ 
        headerShown: false,
        animation: 'slide_from_right' // Better navigation animation
      }}
    >
      <Stack.Screen 
        name="index"
        options={{
          // Hide the index route from navigation
          animation: 'none',
        }}
      />
      <Stack.Screen 
        name="(tabs)" 
        options={{
          gestureEnabled: false // Prevent swipe back to auth
        }}
      />
      <Stack.Screen 
        name="(auth)" 
        options={{
          gestureEnabled: false // Prevent swipe in auth screens
        }}
      />
      <Stack.Screen
        name="(modals)"
        options={{
          presentation: 'modal',
          gestureEnabled: true,
        }}
      />
    </Stack>
  );
}

function Providers({ children }: { children: React.ReactNode }) {
  const theme = useThemeConfig();
  return (
    <GestureHandlerRootView
      style={styles.container}
      className={theme.dark ? `dark` : undefined}
    >
      <KeyboardProvider>
        <ThemeProvider>
          <NavigationThemeProvider value={theme}>
            <APIProvider>
              <BottomSheetModalProvider>
                {children}
                <FlashMessage position="top" />
              </BottomSheetModalProvider>
            </APIProvider>
          </NavigationThemeProvider>
        </ThemeProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
