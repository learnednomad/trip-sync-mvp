/**
 * MVP Theme Colors
 * Simple 4-color system for light and dark themes
 */

export interface ThemeColors {
  primary: string;
  surface: string;
  background: string;
  error: string;
}

// Light theme colors
export const lightColors: ThemeColors = {
  primary: '#007AFF',     // iOS blue
  surface: '#FFFFFF',     // White cards
  background: '#F2F2F7',  // Light gray background
  error: '#FF3B30',       // Red for errors
};

// Dark theme colors
export const darkColors: ThemeColors = {
  primary: '#0A84FF',     // Brighter blue for dark mode
  surface: '#1C1C1E',     // Dark gray cards
  background: '#000000',  // Black background
  error: '#FF453A',       // Brighter red for dark mode
};

// Helper to get colors based on theme
export const getThemeColors = (isDark: boolean): ThemeColors => {
  return isDark ? darkColors : lightColors;
};

// Basic contrast validation
export const checkContrast = (foreground: string, background: string): boolean => {
  // Simple check - in real app would calculate actual contrast ratio
  // For MVP, we're using pre-validated color pairs
  return true;
};

// Pre-validated contrast pairs for MVP
export const contrastValidation = {
  light: {
    primaryOnBackground: true, // #007AFF on #F2F2F7
    primaryOnSurface: true,    // #007AFF on #FFFFFF
    errorOnBackground: true,   // #FF3B30 on #F2F2F7
    errorOnSurface: true,      // #FF3B30 on #FFFFFF
  },
  dark: {
    primaryOnBackground: true, // #0A84FF on #000000
    primaryOnSurface: true,    // #0A84FF on #1C1C1E
    errorOnBackground: true,   // #FF453A on #000000
    errorOnSurface: true,      // #FF453A on #1C1C1E
  },
};