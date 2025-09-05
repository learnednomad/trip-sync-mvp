/**
 * Material Design 3 (Material You) Implementation
 * Implements the latest Material 3 design system for Android
 */

import { ViewStyle, TextStyle, Platform } from 'react-native';

export type Material3Variant = 'surface' | 'primary' | 'secondary' | 'tertiary' | 'error';
export type Material3Elevation = 0 | 1 | 2 | 3 | 4 | 5;
export type Material3Shape = 'none' | 'extraSmall' | 'small' | 'medium' | 'large' | 'extraLarge' | 'full';

export interface Material3Config {
  variant: Material3Variant;
  elevation?: Material3Elevation;
  shape?: Material3Shape;
  stateLayerOpacity?: number;
}

export interface Material3Colors {
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  secondary: string;
  onSecondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;
  tertiary: string;
  onTertiary: string;
  tertiaryContainer: string;
  onTertiaryContainer: string;
  error: string;
  onError: string;
  errorContainer: string;
  onErrorContainer: string;
  surface: string;
  onSurface: string;
  surfaceVariant: string;
  onSurfaceVariant: string;
  outline: string;
  outlineVariant: string;
  shadow: string;
  scrim: string;
  inverseSurface: string;
  inverseOnSurface: string;
  inversePrimary: string;
}

export class Material3Theme {
  static readonly elevationShadows = {
    0: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    1: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    2: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 3,
      elevation: 3,
    },
    3: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 6,
    },
    4: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.12,
      shadowRadius: 5,
      elevation: 8,
    },
    5: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.14,
      shadowRadius: 6,
      elevation: 12,
    },
  };

  static readonly shapeRadii = {
    none: 0,
    extraSmall: 4,
    small: 8,
    medium: 12,
    large: 16,
    extraLarge: 28,
    full: 999,
  };

  static readonly stateLayerOpacities = {
    hover: 0.08,
    focus: 0.12,
    pressed: 0.12,
    dragged: 0.16,
  };

  static createExpressiveContainer(
    config: Material3Config,
    colors: Partial<Material3Colors>
  ): ViewStyle {
    const shape = this.shapeRadii[config.shape || 'medium'];
    const elevation = this.elevationShadows[config.elevation || 0];
    
    // Base container style
    const containerStyle: ViewStyle = {
      borderRadius: shape,
      overflow: 'hidden',
      ...elevation,
    };

    // Add variant-specific styling
    switch (config.variant) {
      case 'primary':
        containerStyle.backgroundColor = colors.primaryContainer;
        break;
      case 'secondary':
        containerStyle.backgroundColor = colors.secondaryContainer;
        break;
      case 'tertiary':
        containerStyle.backgroundColor = colors.tertiaryContainer;
        break;
      case 'error':
        containerStyle.backgroundColor = colors.errorContainer;
        break;
      case 'surface':
      default:
        containerStyle.backgroundColor = colors.surface;
        break;
    }

    // Add expressive animations for Material 3
    if (Platform.OS === 'android' && Platform.Version >= 31) {
      // Android 12+ specific features
      // @ts-ignore - Platform-specific property
      containerStyle.android_ripple = {
        color: this.getRippleColor(config.variant, colors),
        borderless: false,
      };
    }

    return containerStyle;
  }

  static createDynamicColor(
    tonalPalette: Record<number, string>,
    colorScheme: 'light' | 'dark'
  ): Material3Colors {
    // Generate Material 3 color roles from tonal palette
    if (colorScheme === 'light') {
      return {
        primary: tonalPalette[40],
        onPrimary: tonalPalette[100],
        primaryContainer: tonalPalette[90],
        onPrimaryContainer: tonalPalette[10],
        secondary: tonalPalette[40],
        onSecondary: tonalPalette[100],
        secondaryContainer: tonalPalette[90],
        onSecondaryContainer: tonalPalette[10],
        tertiary: tonalPalette[40],
        onTertiary: tonalPalette[100],
        tertiaryContainer: tonalPalette[90],
        onTertiaryContainer: tonalPalette[10],
        error: '#BA1A1A',
        onError: '#FFFFFF',
        errorContainer: '#FFDAD6',
        onErrorContainer: '#410002',
        surface: tonalPalette[99],
        onSurface: tonalPalette[10],
        surfaceVariant: tonalPalette[90],
        onSurfaceVariant: tonalPalette[30],
        outline: tonalPalette[50],
        outlineVariant: tonalPalette[80],
        shadow: '#000000',
        scrim: '#000000',
        inverseSurface: tonalPalette[20],
        inverseOnSurface: tonalPalette[95],
        inversePrimary: tonalPalette[80],
      };
    } else {
      // Dark theme
      return {
        primary: tonalPalette[80],
        onPrimary: tonalPalette[20],
        primaryContainer: tonalPalette[30],
        onPrimaryContainer: tonalPalette[90],
        secondary: tonalPalette[80],
        onSecondary: tonalPalette[20],
        secondaryContainer: tonalPalette[30],
        onSecondaryContainer: tonalPalette[90],
        tertiary: tonalPalette[80],
        onTertiary: tonalPalette[20],
        tertiaryContainer: tonalPalette[30],
        onTertiaryContainer: tonalPalette[90],
        error: '#FFB4AB',
        onError: '#690005',
        errorContainer: '#93000A',
        onErrorContainer: '#FFDAD6',
        surface: tonalPalette[10],
        onSurface: tonalPalette[90],
        surfaceVariant: tonalPalette[30],
        onSurfaceVariant: tonalPalette[80],
        outline: tonalPalette[60],
        outlineVariant: tonalPalette[30],
        shadow: '#000000',
        scrim: '#000000',
        inverseSurface: tonalPalette[90],
        inverseOnSurface: tonalPalette[20],
        inversePrimary: tonalPalette[40],
      };
    }
  }

  static createMotionSpec(
    duration: 'short' | 'medium' | 'long' | 'extraLong',
    easing: 'standard' | 'emphasized' | 'decelerated' | 'accelerated'
  ) {
    const durationMap = {
      short: 150,
      medium: 300,
      long: 500,
      extraLong: 800,
    };

    const easingMap = {
      standard: 'cubic-bezier(0.2, 0, 0, 1)',
      emphasized: 'cubic-bezier(0.2, 0, 0, 1)',
      decelerated: 'cubic-bezier(0, 0, 0, 1)',
      accelerated: 'cubic-bezier(0.3, 0, 1, 1)',
    };

    return {
      duration: durationMap[duration],
      easing: easingMap[easing],
    };
  }

  static createTypographyStyle(
    scale: 'display' | 'headline' | 'title' | 'body' | 'label',
    size: 'large' | 'medium' | 'small'
  ): TextStyle {
    const scaleMap = {
      display: {
        large: { fontSize: 57, lineHeight: 64, letterSpacing: -0.25 },
        medium: { fontSize: 45, lineHeight: 52, letterSpacing: 0 },
        small: { fontSize: 36, lineHeight: 44, letterSpacing: 0 },
      },
      headline: {
        large: { fontSize: 32, lineHeight: 40, letterSpacing: 0 },
        medium: { fontSize: 28, lineHeight: 36, letterSpacing: 0 },
        small: { fontSize: 24, lineHeight: 32, letterSpacing: 0 },
      },
      title: {
        large: { fontSize: 22, lineHeight: 28, letterSpacing: 0 },
        medium: { fontSize: 16, lineHeight: 24, letterSpacing: 0.15 },
        small: { fontSize: 14, lineHeight: 20, letterSpacing: 0.1 },
      },
      body: {
        large: { fontSize: 16, lineHeight: 24, letterSpacing: 0.5 },
        medium: { fontSize: 14, lineHeight: 20, letterSpacing: 0.25 },
        small: { fontSize: 12, lineHeight: 16, letterSpacing: 0.4 },
      },
      label: {
        large: { fontSize: 14, lineHeight: 20, letterSpacing: 0.1 },
        medium: { fontSize: 12, lineHeight: 16, letterSpacing: 0.5 },
        small: { fontSize: 11, lineHeight: 16, letterSpacing: 0.5 },
      },
    };

    const style = scaleMap[scale][size];

    return {
      ...style,
      fontFamily: 'Roboto',
      fontWeight: scale === 'display' || scale === 'headline' ? '400' : '500',
    };
  }

  static createStateLayer(
    state: 'hover' | 'focus' | 'pressed' | 'dragged',
    color: string
  ): ViewStyle {
    const opacity = this.stateLayerOpacities[state];
    
    return {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: color,
      opacity,
    };
  }

  private static getRippleColor(
    variant: Material3Variant,
    colors: Partial<Material3Colors>
  ): string {
    switch (variant) {
      case 'primary':
        return colors.primary || '#000';
      case 'secondary':
        return colors.secondary || '#000';
      case 'tertiary':
        return colors.tertiary || '#000';
      case 'error':
        return colors.error || '#000';
      default:
        return colors.onSurface || '#000';
    }
  }
}

// Helper function for easy use
export function material3Container(
  variant: Material3Variant,
  elevation: Material3Elevation = 0,
  shape: Material3Shape = 'medium',
  colors: Partial<Material3Colors>
): ViewStyle {
  return Material3Theme.createExpressiveContainer(
    { variant, elevation, shape },
    colors
  );
}