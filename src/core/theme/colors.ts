/**
 * Trip Sync Design System - Color Tokens
 * Semantic color system with platform-specific variations
 */

export const colors = {
  // Semantic colors for light/dark mode
  background: {
    primary: { light: '#FFFFFF', dark: '#000000' },
    secondary: { light: '#F5F5F5', dark: '#1C1C1E' },
    tertiary: { light: '#FFFFFF', dark: '#2C2C2E' },
    elevated: { light: '#FFFFFF', dark: '#3A3A3C' },
  },
  
  text: {
    primary: { light: '#000000', dark: '#FFFFFF' },
    secondary: { light: '#3C3C43', dark: '#EBEBF5' },
    tertiary: { light: '#3C3C43', dark: '#EBEBF5' },
    quaternary: { light: '#3C3C43', dark: '#EBEBF5' },
  },
  
  // Platform-specific system colors
  ios: {
    systemBlue: '#007AFF',
    systemGreen: '#34C759',
    systemIndigo: '#5856D6',
    systemOrange: '#FF9500',
    systemPink: '#FF2D55',
    systemPurple: '#AF52DE',
    systemRed: '#FF3B30',
    systemTeal: '#5AC8FA',
    systemYellow: '#FFCC00',
    systemGray: '#8E8E93',
    systemGray2: '#AEAEB2',
    systemGray3: '#C7C7CC',
    systemGray4: '#D1D1D6',
    systemGray5: '#E5E5EA',
    systemGray6: '#F2F2F7',
    separator: { light: '#3C3C43', dark: '#545458' },
  },
  
  android: {
    // Material You dynamic colors
    primary: '#6750A4',
    onPrimary: '#FFFFFF',
    primaryContainer: '#EADDFF',
    onPrimaryContainer: '#21005D',
    secondary: '#625B71',
    onSecondary: '#FFFFFF',
    secondaryContainer: '#E8DEF8',
    onSecondaryContainer: '#1D192B',
    tertiary: '#7D5260',
    onTertiary: '#FFFFFF',
    tertiaryContainer: '#FFD8E4',
    onTertiaryContainer: '#31111D',
    error: '#B3261E',
    onError: '#FFFFFF',
    errorContainer: '#F9DEDC',
    onErrorContainer: '#410E0B',
    surface: '#FEF7FF',
    onSurface: '#1D1B20',
    surfaceVariant: '#E7E0EC',
    onSurfaceVariant: '#49454F',
    outline: '#79747E',
    outlineVariant: '#CAC4D0',
  },
  
  // Functional colors (cross-platform)
  functional: {
    success: {
      base: '#22C55E',
      light: '#4ADE80',
      dark: '#16A34A',
      background: '#F0FDF4',
      border: '#BBF7D0',
    },
    warning: {
      base: '#F59E0B',
      light: '#FBBF24',
      dark: '#D97706',
      background: '#FFFBEB',
      border: '#FDE68A',
    },
    danger: {
      base: '#EF4444',
      light: '#F87171',
      dark: '#DC2626',
      background: '#FEF2F2',
      border: '#FECACA',
    },
    info: {
      base: '#3B82F6',
      light: '#60A5FA',
      dark: '#2563EB',
      background: '#EFF6FF',
      border: '#BFDBFE',
    },
  },
  
  // Trip Sync brand colors
  brand: {
    primary: '#FF6C00',
    primaryLight: '#FF8933',
    primaryDark: '#E56100',
    secondary: '#1E1E1E',
    accent: '#FF7B1A',
  },
};

// Helper function to get platform-specific colors
export const getPlatformColor = (platform: 'ios' | 'android', colorKey: string) => {
  return platform === 'ios' ? colors.ios[colorKey] : colors.android[colorKey];
};

// Helper function to get semantic colors based on color scheme
export const getSemanticColor = (
  category: keyof typeof colors.background,
  variant: 'light' | 'dark'
) => {
  if (category in colors.background) {
    return colors.background[category][variant];
  }
  if (category in colors.text) {
    return colors.text[category][variant];
  }
  return null;
};