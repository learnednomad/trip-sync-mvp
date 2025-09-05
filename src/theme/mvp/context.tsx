/**
 * MVP Theme Provider & Context
 * Simple theme management with light/dark mode
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { MMKV } from 'react-native-mmkv';
import { ThemeColors, getThemeColors } from './colors';
import { Typography, typography } from './typography';

// Storage instance
const storage = new MMKV({
  id: 'theme-storage-mvp',
});

// Storage key
const THEME_KEY = 'theme_preference';

// Theme type definition
export interface Theme {
  colors: ThemeColors;
  typography: Typography;
  isDark: boolean;
}

// Context value type
interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}

// Create context
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// Provider props
interface ThemeProviderProps {
  children: ReactNode;
}

// Theme Provider Component
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  
  // Initialize theme from storage or system
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = storage.getString(THEME_KEY);
    if (saved === 'light') return false;
    if (saved === 'dark') return true;
    // Default to system preference
    return systemColorScheme === 'dark';
  });

  // Build theme object
  const theme: Theme = {
    colors: getThemeColors(isDark),
    typography,
    isDark,
  };

  // Toggle theme function (no animation as per AC)
  const toggleTheme = useCallback(() => {
    const newValue = !isDark;
    setIsDark(newValue);
    storage.set(THEME_KEY, newValue ? 'dark' : 'light');
  }, [isDark]);

  // Set theme function
  const setTheme = useCallback((dark: boolean) => {
    setIsDark(dark);
    storage.set(THEME_KEY, dark ? 'dark' : 'light');
  }, []);

  // Context value
  const value: ThemeContextValue = {
    theme,
    toggleTheme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
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