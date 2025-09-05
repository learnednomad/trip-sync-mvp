/* eslint-disable react/no-unstable-nested-components */
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import {
  Settings as SettingsIcon,
} from '@/components/ui/icons';
// TODO: Add trip and expense icons when available

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Platform.select({
          ios: '#007AFF',
          android: '#1976D2',
        }),
        headerShown: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Trips',
          tabBarIcon: ({ color, size }) => (
            // Placeholder icon - replace with trip icon
            <SettingsIcon color={color} size={size} />
          ),
          tabBarButtonTestID: 'trips-tab',
        }}
      />
      
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <SettingsIcon color={color} size={size} />
          ),
          tabBarButtonTestID: 'settings-tab',
        }}
      />
    </Tabs>
  );
}
