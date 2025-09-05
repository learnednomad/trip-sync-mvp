import { Stack } from 'expo-router';
import React from 'react';
import { useTheme } from '@/theme/ThemeContext';

/**
 * Modal Layout for shared screens
 * These screens can be accessed from any tab
 * and will present as modals on mobile
 */
export default function ModalLayout() {
  const { theme } = useTheme();

  return (
    <Stack
      screenOptions={{
        presentation: 'modal',
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.text,
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    >
      <Stack.Screen
        name="user-profile"
        options={{
          title: 'Profile',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="trip-invite"
        options={{
          title: 'Join Trip',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="expense-details"
        options={{
          title: 'Expense Details',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="trip-settings"
        options={{
          title: 'Trip Settings',
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}