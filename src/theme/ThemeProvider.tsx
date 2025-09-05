/**
 * Theme Provider Component
 * Main entry point for the theme system
 */

import React from 'react';
import { ThemeProvider as ThemeContextProvider } from './ThemeContext';
import { ThemeProviderProps } from './types';

// Re-export the context provider with the same name for consistency
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultColorScheme = 'system',
  defaultContrastMode = 'normal',
}) => {
  return (
    <ThemeContextProvider
      defaultColorScheme={defaultColorScheme}
      defaultContrastMode={defaultContrastMode}
    >
      {children}
    </ThemeContextProvider>
  );
};

// Re-export all hooks from ThemeContext
export {
  useTheme,
  useThemeColors,
  useThemeTypography,
  useThemeSpacing,
  useThemeAnimation,
  useThemeColorScheme,
  useHighContrast,
} from './ThemeContext';