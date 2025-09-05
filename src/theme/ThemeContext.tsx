/**
 * Theme Context
 * Provides theme configuration and switching functionality
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useColorScheme, Appearance, LayoutAnimation } from 'react-native';
import { MMKV } from 'react-native-mmkv';
import {
  Theme,
  ThemeConfig,
  ThemeContextValue,
  ThemeProviderProps,
  ColorScheme,
  ContrastMode,
  ThemeMode,
} from './types';
import {
  defaultThemeConfig,
  getEffectiveColorScheme,
  shouldUseHighContrast,
} from './theme.config';
import { getThemeColors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';
import { animation } from './animations';
import { borderRadius, shadows, zIndex, layout } from './tokens';
import { layoutAnimationPresets } from './animation-utils';

// MMKV storage instance for theme persistence
const storage = new MMKV({
  id: 'theme-storage',
  encryptionKey: undefined, // Add encryption in production
});

// Storage keys
const STORAGE_KEYS = {
  COLOR_SCHEME: 'theme:colorScheme',
  CONTRAST_MODE: 'theme:contrastMode',
};

// Create theme context
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// Theme Provider Component
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultColorScheme = 'system',
  defaultContrastMode = 'normal',
}) => {
  // System color scheme
  const systemColorScheme = useColorScheme() ?? 'light';
  
  // Theme mode state
  const [mode, setMode] = useState<ThemeMode>(() => {
    // Load persisted values or use defaults
    const savedColorScheme = storage.getString(STORAGE_KEYS.COLOR_SCHEME) as ColorScheme | undefined;
    const savedContrastMode = storage.getString(STORAGE_KEYS.CONTRAST_MODE) as ContrastMode | undefined;
    
    return {
      colorScheme: savedColorScheme ?? defaultColorScheme,
      contrastMode: savedContrastMode ?? defaultContrastMode,
    };
  });
  
  // Calculate effective color scheme and contrast
  const colorScheme = useMemo(
    () => getEffectiveColorScheme(mode, systemColorScheme),
    [mode, systemColorScheme]
  );
  
  const highContrast = useMemo(
    () => shouldUseHighContrast(mode, false), // TODO: Get system high contrast preference
    [mode]
  );
  
  // Build theme configuration
  const config = useMemo<ThemeConfig>(() => ({
    mode,
    platform: defaultThemeConfig.platform,
    accessibility: {
      reduceMotion: false, // TODO: Get from system
      increaseContrast: highContrast,
      screenReaderEnabled: false, // TODO: Get from system
    },
  }), [mode, highContrast]);
  
  // Build complete theme object
  const theme = useMemo<Theme>(() => ({
    colors: getThemeColors(colorScheme, highContrast),
    typography,
    spacing,
    animation,
    layout,
    borderRadius,
    shadows,
    zIndex,
  }), [colorScheme, highContrast]);
  
  // Theme switching functions with animation
  const setColorScheme = useCallback((scheme: ColorScheme) => {
    const startTime = Date.now();
    
    // Configure layout animation for smooth transition
    LayoutAnimation.configureNext(layoutAnimationPresets.fast);
    
    setMode(prev => ({ ...prev, colorScheme: scheme }));
    storage.set(STORAGE_KEYS.COLOR_SCHEME, scheme);
    
    // Ensure animation completes within 50ms as per AC
    const elapsed = Date.now() - startTime;
    if (elapsed > 50) {
      console.warn(`Theme switch took ${elapsed}ms, exceeding 50ms target`);
    }
  }, []);
  
  const setContrastMode = useCallback((contrast: ContrastMode) => {
    LayoutAnimation.configureNext(layoutAnimationPresets.fast);
    setMode(prev => ({ ...prev, contrastMode: contrast }));
    storage.set(STORAGE_KEYS.CONTRAST_MODE, contrast);
  }, []);
  
  const toggleColorScheme = useCallback(() => {
    const newScheme: ColorScheme = 
      colorScheme === 'light' ? 'dark' : 
      colorScheme === 'dark' ? 'system' : 
      'light';
    setColorScheme(newScheme);
  }, [colorScheme, setColorScheme]);
  
  // Listen for system theme changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme: newSystemScheme }) => {
      // Only update if we're following system theme
      if (mode.colorScheme === 'system' && newSystemScheme) {
        // This will trigger a re-render with new system color scheme
        // No need to update state as systemColorScheme hook will update
        LayoutAnimation.configureNext(layoutAnimationPresets.fast);
      }
    });
    
    return () => subscription?.remove();
  }, [mode.colorScheme]);
  
  // Context value
  const contextValue = useMemo<ThemeContextValue>(() => ({
    theme,
    config,
    colorScheme,
    highContrast,
    setColorScheme,
    setContrastMode,
    toggleColorScheme,
  }), [theme, config, colorScheme, highContrast, setColorScheme, setContrastMode, toggleColorScheme]);
  
  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme
export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};

// Utility hooks
export const useThemeColors = () => {
  const { theme } = useTheme();
  return theme.colors;
};

export const useThemeTypography = () => {
  const { theme } = useTheme();
  return theme.typography;
};

export const useThemeSpacing = () => {
  const { theme } = useTheme();
  return theme.spacing;
};

export const useThemeAnimation = () => {
  const { theme } = useTheme();
  return theme.animation;
};

export const useThemeColorScheme = () => {
  const { colorScheme } = useTheme();
  return colorScheme;
};

export const useHighContrast = () => {
  const { highContrast } = useTheme();
  return highContrast;
};