/**
 * ThemeProvider Component
 * Manages dynamic theming for the entire app
 */

import React, { useEffect, useState } from 'react';
import { Appearance, useColorScheme, View, ActivityIndicator } from 'react-native';
import { AdaptiveThemeProvider } from '@/hooks/useAdaptiveTheme';
import { dynamicTheme } from '@/design/theme/DynamicTheme';
import { useSystemColors } from '@/hooks/useSystemColors';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const { colors, isLoading: isLoadingSystemColors } = useSystemColors();
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    const initializeTheme = async () => {
      try {
        // Wait for system colors to load
        if (isLoadingSystemColors) {
          return;
        }
        
        // Initialize dynamic theme
        await dynamicTheme.initialize();
        
        // Apply system colors if available
        if (colors.isDynamicColorAvailable) {
          // Update theme with system colors
          const dynamicColors = {
            light: {
              primary: colors.primaryColor || '#2563EB',
              secondary: colors.secondaryColor || '#7C3AED',
              tertiary: colors.tertiaryColor || '#0891B2',
              surface: '#FFFFFF',
              background: '#F5F5F5',
              error: '#EF4444',
              onPrimary: '#FFFFFF',
              onSecondary: '#FFFFFF',
              onTertiary: '#FFFFFF',
              onSurface: '#000000',
              onBackground: '#000000',
              onError: '#FFFFFF',
            },
            dark: {
              primary: colors.primaryColor || '#2563EB',
              secondary: colors.secondaryColor || '#7C3AED',
              tertiary: colors.tertiaryColor || '#0891B2',
              surface: '#1C1C1E',
              background: '#000000',
              error: '#EF4444',
              onPrimary: '#000000',
              onSecondary: '#000000',
              onTertiary: '#000000',
              onSurface: '#FFFFFF',
              onBackground: '#FFFFFF',
              onError: '#000000',
            },
          };
          
          await dynamicTheme.updateMaterialYouColors(dynamicColors);
        }
        
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize theme:', error);
        setIsInitialized(true); // Continue with defaults
      }
    };
    
    initializeTheme();
  }, [isLoadingSystemColors, colors]);
  
  // Listen for appearance changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(() => {
      // Re-initialize theme on appearance change
      dynamicTheme.initialize();
    });
    
    return () => subscription?.remove();
  }, []);
  
  if (!isInitialized) {
    // Show loading screen while theme initializes
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: systemColorScheme === 'dark' ? '#000' : '#FFF',
      }}>
        <ActivityIndicator 
          size="large" 
          color={systemColorScheme === 'dark' ? '#FFF' : '#000'} 
        />
      </View>
    );
  }
  
  return (
    <AdaptiveThemeProvider>
      {children}
    </AdaptiveThemeProvider>
  );
};

/**
 * Theme persistence utilities
 */
export const ThemePersistence = {
  async saveThemePreference(preference: 'light' | 'dark' | 'system') {
    try {
      await AsyncStorage.setItem('themePreference', preference);
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  },
  
  async getThemePreference(): Promise<'light' | 'dark' | 'system'> {
    try {
      const preference = await AsyncStorage.getItem('themePreference');
      return (preference as 'light' | 'dark' | 'system') || 'system';
    } catch (error) {
      console.error('Failed to get theme preference:', error);
      return 'system';
    }
  },
  
  async saveAccentColor(color: string) {
    try {
      await AsyncStorage.setItem('customAccentColor', color);
    } catch (error) {
      console.error('Failed to save accent color:', error);
    }
  },
  
  async getAccentColor(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('customAccentColor');
    } catch (error) {
      console.error('Failed to get accent color:', error);
      return null;
    }
  },
};