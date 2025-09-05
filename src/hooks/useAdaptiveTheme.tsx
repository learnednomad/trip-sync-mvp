/**
 * useAdaptiveTheme Hook
 * Provides access to the dynamic theme system
 */

import React, { useContext, createContext, useEffect, useState } from 'react';
import { Platform, ColorSchemeName, useColorScheme } from 'react-native';
import { themeConfig } from '@/design/theme/theme.config';
import { DynamicTheme, dynamicTheme } from '@/design/theme/DynamicTheme';

export interface AdaptiveThemeContextValue {
  theme: typeof themeConfig & {
    colors: DynamicTheme['colors'][ColorSchemeName & string];
  };
  platform: 'ios' | 'android';
  colorScheme: ColorSchemeName;
  isHighContrast: boolean;
  prefersReducedMotion: boolean;
  updateTheme: () => Promise<void>;
}

const AdaptiveThemeContext = createContext<AdaptiveThemeContextValue | null>(null);

export function useAdaptiveTheme() {
  const context = useContext(AdaptiveThemeContext);
  
  if (!context) {
    throw new Error(
      'useAdaptiveTheme must be used within AdaptiveThemeProvider'
    );
  }
  
  return context;
}

/**
 * AdaptiveThemeProvider Component
 * Wraps the app and provides theme context
 */
export function AdaptiveThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<DynamicTheme | null>(null);
  
  // Initialize theme
  useEffect(() => {
    const initTheme = async () => {
      try {
        const theme = await dynamicTheme.initialize();
        setCurrentTheme(theme);
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize theme:', error);
        setIsInitialized(true);
      }
    };
    
    initTheme();
    
    // Subscribe to theme changes
    const unsubscribe = dynamicTheme.subscribe((theme) => {
      setCurrentTheme(theme);
    });
    
    return unsubscribe;
  }, []);
  
  // Update theme manually
  const updateTheme = async () => {
    try {
      await dynamicTheme.initialize();
    } catch (error) {
      console.error('Failed to update theme:', error);
    }
  };
  
  if (!isInitialized || !currentTheme) {
    // Return loading state or splash screen
    return null;
  }
  
  const colorScheme = currentTheme.colorScheme || systemColorScheme || 'light';
  
  const contextValue: AdaptiveThemeContextValue = {
    theme: {
      ...themeConfig,
      colors: currentTheme.colors[colorScheme],
    },
    platform: Platform.OS as 'ios' | 'android',
    colorScheme,
    isHighContrast: currentTheme.isHighContrast,
    prefersReducedMotion: currentTheme.prefersReducedMotion,
    updateTheme,
  };
  
  return (
    <AdaptiveThemeContext.Provider value={contextValue}>
      {children}
    </AdaptiveThemeContext.Provider>
  );
}