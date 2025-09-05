/**
 * Unified Theme Configuration
 * Supports iOS 18 Liquid Glass and Material Design 3
 */

import { Platform } from 'react-native';

// Color token types
export interface ColorToken {
  light: string;
  dark: string;
}

export interface TonalPalette {
  0: string;    // Black
  10: string;
  20: string;
  30: string;
  40: string;
  50: string;
  60: string;
  70: string;
  80: string;
  90: string;
  95: string;
  99: string;   // Near white
  100: string;  // White
}

export interface LiquidGlassMaterial {
  ultraThin: string;
  thin: string;
  regular: string;
  thick: string;
  chrome: string;
}

// Main theme configuration
export const themeConfig = {
  // Brand Colors (shared across platforms)
  brand: {
    primary: '#2563EB',     // Sabron Blue
    secondary: '#7C3AED',   // Sabron Purple
    tertiary: '#0891B2',    // Sabron Cyan
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },

  // iOS 18 Liquid Glass Configuration
  ios: {
    materials: {
      ultraThin: {
        light: 'rgba(255, 255, 255, 0.3)',
        dark: 'rgba(0, 0, 0, 0.3)',
        blur: 20,
      },
      thin: {
        light: 'rgba(255, 255, 255, 0.5)',
        dark: 'rgba(28, 28, 30, 0.5)',
        blur: 30,
      },
      regular: {
        light: 'rgba(255, 255, 255, 0.7)',
        dark: 'rgba(28, 28, 30, 0.7)',
        blur: 40,
      },
      thick: {
        light: 'rgba(255, 255, 255, 0.9)',
        dark: 'rgba(28, 28, 30, 0.9)',
        blur: 50,
      },
      chrome: {
        light: 'rgba(255, 255, 255, 0.96)',
        dark: 'rgba(28, 28, 30, 0.96)',
        blur: 60,
      },
    },
    
    vibrancy: {
      label: 0.6,
      secondaryLabel: 0.5,
      tertiaryLabel: 0.3,
      quaternaryLabel: 0.18,
      placeholder: 0.3,
      separator: 0.2,
    },

    cornerRadius: {
      small: 8,
      medium: 12,
      large: 16,
      extraLarge: 20,
      continuous: true, // iOS continuous corners
    },

    animation: {
      spring: {
        response: 0.55,
        dampingFraction: 0.825,
        blendDuration: 0.2,
      },
      smooth: {
        duration: 0.35,
        curve: [0.34, 1.56, 0.64, 1],
      },
      bounce: {
        damping: 15,
        stiffness: 150,
        mass: 1,
      },
    },

    systemColors: {
      label: { light: '#000000', dark: '#FFFFFF' },
      secondaryLabel: { light: '#3C3C43', dark: '#EBEBF5' },
      tertiaryLabel: { light: '#3C3C43', dark: '#EBEBF5' },
      quaternaryLabel: { light: '#3C3C43', dark: '#EBEBF5' },
      systemBackground: { light: '#FFFFFF', dark: '#000000' },
      secondarySystemBackground: { light: '#F2F2F7', dark: '#1C1C1E' },
      tertiarySystemBackground: { light: '#FFFFFF', dark: '#2C2C2E' },
    },
  },

  // Material Design 3 Configuration
  android: {
    // Material 3 Tonal Palettes
    tonalPalettes: {
      primary: generateTonalPalette('#2563EB'),
      secondary: generateTonalPalette('#7C3AED'),
      tertiary: generateTonalPalette('#0891B2'),
      error: generateTonalPalette('#EF4444'),
      neutral: generateTonalPalette('#6B7280'),
      neutralVariant: generateTonalPalette('#71717A'),
    },

    elevation: {
      level0: 0,
      level1: 1,
      level2: 3,
      level3: 6,
      level4: 8,
      level5: 12,
    },

    stateLayerOpacity: {
      hover: 0.08,
      focus: 0.12,
      pressed: 0.12,
      dragged: 0.16,
    },

    motion: {
      easing: {
        standard: 'cubic-bezier(0.2, 0, 0, 1)',
        standardDecelerate: 'cubic-bezier(0, 0, 0, 1)',
        standardAccelerate: 'cubic-bezier(0.3, 0, 1, 1)',
        emphasized: 'cubic-bezier(0.2, 0, 0, 1)',
        emphasizedDecelerate: 'cubic-bezier(0.05, 0.7, 0.1, 1)',
        emphasizedAccelerate: 'cubic-bezier(0.3, 0, 0.8, 0.15)',
      },
      duration: {
        short1: 50,
        short2: 100,
        short3: 150,
        short4: 200,
        medium1: 250,
        medium2: 300,
        medium3: 350,
        medium4: 400,
        long1: 450,
        long2: 500,
        long3: 550,
        long4: 600,
        extraLong1: 700,
        extraLong2: 800,
        extraLong3: 900,
        extraLong4: 1000,
      },
    },

    shape: {
      corner: {
        none: 0,
        extraSmall: 4,
        small: 8,
        medium: 12,
        large: 16,
        extraLarge: 28,
        full: 999,
      },
    },
  },

  // Shared Typography Configuration
  typography: {
    // Font families
    fonts: {
      ios: {
        regular: 'System',
        medium: 'System',
        semibold: 'System',
        bold: 'System',
        mono: 'SF Mono',
      },
      android: {
        regular: 'Roboto',
        medium: 'Roboto-Medium',
        semibold: 'Roboto-Medium',
        bold: 'Roboto-Bold',
        mono: 'RobotoMono',
      },
    },

    // Type scale
    scale: {
      displayLarge: { size: 57, lineHeight: 64, weight: 'regular' },
      displayMedium: { size: 45, lineHeight: 52, weight: 'regular' },
      displaySmall: { size: 36, lineHeight: 44, weight: 'regular' },
      
      headlineLarge: { size: 32, lineHeight: 40, weight: 'regular' },
      headlineMedium: { size: 28, lineHeight: 36, weight: 'regular' },
      headlineSmall: { size: 24, lineHeight: 32, weight: 'regular' },
      
      titleLarge: { size: 22, lineHeight: 28, weight: 'medium' },
      titleMedium: { size: 16, lineHeight: 24, weight: 'medium' },
      titleSmall: { size: 14, lineHeight: 20, weight: 'medium' },
      
      bodyLarge: { size: 16, lineHeight: 24, weight: 'regular' },
      bodyMedium: { size: 14, lineHeight: 20, weight: 'regular' },
      bodySmall: { size: 12, lineHeight: 16, weight: 'regular' },
      
      labelLarge: { size: 14, lineHeight: 20, weight: 'medium' },
      labelMedium: { size: 12, lineHeight: 16, weight: 'medium' },
      labelSmall: { size: 11, lineHeight: 16, weight: 'medium' },
    },
  },

  // Spacing system
  spacing: {
    xxsmall: 4,
    xsmall: 8,
    small: 12,
    medium: 16,
    large: 24,
    xlarge: 32,
    xxlarge: 48,
  },

  // Layout breakpoints
  breakpoints: {
    phone: 0,
    tablet: 600,
    desktop: 1024,
  },
};

// Helper function to generate Material 3 tonal palette
function generateTonalPalette(baseColor: string): TonalPalette {
  // This is a simplified version - in production, use a proper color science library
  return {
    0: '#000000',
    10: adjustLightness(baseColor, -0.8),
    20: adjustLightness(baseColor, -0.6),
    30: adjustLightness(baseColor, -0.4),
    40: adjustLightness(baseColor, -0.2),
    50: baseColor,
    60: adjustLightness(baseColor, 0.2),
    70: adjustLightness(baseColor, 0.4),
    80: adjustLightness(baseColor, 0.6),
    90: adjustLightness(baseColor, 0.8),
    95: adjustLightness(baseColor, 0.9),
    99: '#FEFEFE',
    100: '#FFFFFF',
  };
}

// Helper function to adjust color lightness
function adjustLightness(color: string, percent: number): string {
  // Convert hex to RGB
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent * 100);
  const R = (num >> 16) + amt;
  const G = ((num >> 8) & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  
  return '#' + (
    0x1000000 +
    (R < 255 ? (R < 0 ? 0 : R) : 255) * 0x10000 +
    (G < 255 ? (G < 0 ? 0 : G) : 255) * 0x100 +
    (B < 255 ? (B < 0 ? 0 : B) : 255)
  ).toString(16).slice(1);
}

// Export platform-specific theme getter
export function getPlatformTheme() {
  return Platform.OS === 'ios' ? themeConfig.ios : themeConfig.android;
}

// Export typography for current platform
export function getPlatformTypography() {
  const fonts = Platform.OS === 'ios' 
    ? themeConfig.typography.fonts.ios 
    : themeConfig.typography.fonts.android;
    
  return {
    ...themeConfig.typography.scale,
    fonts,
  };
}