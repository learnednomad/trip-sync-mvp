/**
 * useSystemColors Hook
 * Extracts system colors from iOS and Android
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { NativeEventEmitter, NativeModules, Platform } from 'react-native';

interface SystemColors {
  accentColor?: string;
  primaryColor?: string;
  secondaryColor?: string;
  tertiaryColor?: string;
  isDynamicColorAvailable: boolean;
}

// Mock native module interface (would be implemented natively)
const SystemColorsModule = NativeModules.SystemColors || {
  getSystemColors: async () => ({
    accentColor: '#007AFF', // iOS default blue
    isDynamicColorAvailable: false,
  }),
  getMaterialYouColors: async () => ({
    primaryColor: '#2563EB',
    secondaryColor: '#7C3AED',
    tertiaryColor: '#0891B2',
    isDynamicColorAvailable: false,
  }),
};

export function useSystemColors() {
  const [colors, setColors] = useState<SystemColors>({
    isDynamicColorAvailable: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSystemColors = async () => {
      try {
        if (Platform.OS === 'ios') {
          // iOS: Get accent color from system
          const iosColors = await SystemColorsModule.getSystemColors();
          setColors({
            accentColor: iosColors.accentColor,
            primaryColor: iosColors.accentColor,
            isDynamicColorAvailable: iosColors.isDynamicColorAvailable,
          });
        } else if (Platform.OS === 'android' && Platform.Version >= 31) {
          // Android 12+: Get Material You colors
          const androidColors = await SystemColorsModule.getMaterialYouColors();
          setColors({
            primaryColor: androidColors.primaryColor,
            secondaryColor: androidColors.secondaryColor,
            tertiaryColor: androidColors.tertiaryColor,
            isDynamicColorAvailable: androidColors.isDynamicColorAvailable,
          });

          // Cache Material You colors
          await AsyncStorage.setItem(
            'materialYouColors',
            JSON.stringify(androidColors)
          );
        } else {
          // Fallback: Use default brand colors
          setColors({
            primaryColor: '#2563EB',
            secondaryColor: '#7C3AED',
            tertiaryColor: '#0891B2',
            isDynamicColorAvailable: false,
          });
        }
      } catch (error) {
        console.error('Failed to fetch system colors:', error);

        // Try to load cached colors
        try {
          const cached = await AsyncStorage.getItem('materialYouColors');
          if (cached) {
            setColors(JSON.parse(cached));
          }
        } catch {
          // Use defaults
          setColors({
            primaryColor: '#2563EB',
            isDynamicColorAvailable: false,
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchSystemColors();

    // Listen for system color changes
    if (Platform.OS === 'android' && NativeModules.SystemColors) {
      const emitter = new NativeEventEmitter(SystemColorsModule);
      const subscription = emitter.addListener(
        'onDynamicColorsChanged',
        fetchSystemColors
      );

      return () => subscription.remove();
    }
  }, []);

  return {
    colors,
    isLoading,
    isDynamicColorAvailable: colors.isDynamicColorAvailable,
  };
}

/**
 * Extract iOS accent color (would be implemented natively)
 */
export async function extractIOSAccentColor(): Promise<string> {
  if (Platform.OS !== 'ios') {
    throw new Error('extractIOSAccentColor is only available on iOS');
  }

  try {
    const result = await SystemColorsModule.getSystemColors();
    return result.accentColor || '#007AFF';
  } catch {
    return '#007AFF'; // iOS default blue
  }
}

/**
 * Extract Android Material You colors (would be implemented natively)
 */
export async function extractAndroidDynamicColors(): Promise<{
  primary: string;
  secondary: string;
  tertiary: string;
}> {
  if (Platform.OS !== 'android' || Platform.Version < 31) {
    throw new Error('Material You colors are only available on Android 12+');
  }

  try {
    const result = await SystemColorsModule.getMaterialYouColors();
    return {
      primary: result.primaryColor || '#2563EB',
      secondary: result.secondaryColor || '#7C3AED',
      tertiary: result.tertiaryColor || '#0891B2',
    };
  } catch {
    return {
      primary: '#2563EB',
      secondary: '#7C3AED',
      tertiary: '#0891B2',
    };
  }
}
