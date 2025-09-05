/**
 * iOS 18 Liquid Glass Material System
 * Implements the new Liquid Glass design language for iOS
 */

import { ViewStyle, Platform } from 'react-native';

export type LiquidGlassIntensity = 'ultraThin' | 'thin' | 'regular' | 'thick' | 'chrome';

export interface LiquidGlassConfig {
  intensity: LiquidGlassIntensity;
  tint?: string;
  luminosity?: number;
  blur?: number;
  shadowIntensity?: number;
}

export interface LiquidGlassStyle extends ViewStyle {
  // iOS-specific backdrop filter properties
  backdropFilter?: string;
  '-webkit-backdrop-filter'?: string;
}

export class LiquidGlassMaterial {
  static readonly presets = {
    ultraThin: {
      light: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        backdropFilter: 'blur(20px)',
        luminosity: 1.1,
      },
      dark: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(20px)',
        luminosity: 0.9,
      },
    },
    thin: {
      light: {
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        backdropFilter: 'blur(30px)',
        luminosity: 1.05,
      },
      dark: {
        backgroundColor: 'rgba(28, 28, 30, 0.5)',
        backdropFilter: 'blur(30px)',
        luminosity: 0.95,
      },
    },
    regular: {
      light: {
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(40px)',
        luminosity: 1.0,
      },
      dark: {
        backgroundColor: 'rgba(28, 28, 30, 0.7)',
        backdropFilter: 'blur(40px)',
        luminosity: 1.0,
      },
    },
    thick: {
      light: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(50px)',
        luminosity: 0.98,
      },
      dark: {
        backgroundColor: 'rgba(28, 28, 30, 0.9)',
        backdropFilter: 'blur(50px)',
        luminosity: 1.02,
      },
    },
    chrome: {
      light: {
        backgroundColor: 'rgba(255, 255, 255, 0.96)',
        backdropFilter: 'blur(60px) saturate(180%)',
        luminosity: 0.96,
      },
      dark: {
        backgroundColor: 'rgba(28, 28, 30, 0.96)',
        backdropFilter: 'blur(60px) saturate(180%)',
        luminosity: 1.04,
      },
    },
  };

  static createMaterial(
    config: LiquidGlassConfig,
    colorScheme: 'light' | 'dark' = 'light'
  ): LiquidGlassStyle {
    if (Platform.OS !== 'ios') {
      // Fallback for non-iOS platforms
      return this.createFallbackStyle(config, colorScheme);
    }

    const preset = this.presets[config.intensity][colorScheme];
    const blur = config.blur ?? parseInt(preset.backdropFilter.match(/\d+/)?.[0] || '40');
    
    const style: LiquidGlassStyle = {
      backgroundColor: preset.backgroundColor,
      // iOS backdrop filter support
      // @ts-ignore - React Native types don't include this yet
      backdropFilter: `blur(${blur}px)`,
      '-webkit-backdrop-filter': `blur(${blur}px)`,
    };

    // Add tint if specified
    if (config.tint) {
      style.backgroundColor = this.applyTint(
        preset.backgroundColor,
        config.tint,
        config.luminosity ?? preset.luminosity
      );
    }

    // Add shadow for depth
    if (config.shadowIntensity) {
      style.shadowColor = '#000';
      style.shadowOffset = { width: 0, height: 2 };
      style.shadowOpacity = config.shadowIntensity;
      style.shadowRadius = blur / 10;
    }

    return style;
  }

  static createVibrancyEffect(
    intensity: LiquidGlassIntensity,
    colorScheme: 'light' | 'dark'
  ): ViewStyle {
    // Create vibrancy effect for text and UI elements
    const vibrancyMap = {
      ultraThin: 0.6,
      thin: 0.5,
      regular: 0.4,
      thick: 0.3,
      chrome: 0.2,
    };

    const opacity = vibrancyMap[intensity];
    
    return {
      opacity,
      // Blend mode simulation for React Native
      ...(Platform.Version >= 13 && {
        // @ts-ignore - Experimental blend mode support
        mixBlendMode: colorScheme === 'light' ? 'multiply' : 'screen',
      }),
    };
  }

  static createAdaptiveMaterial(
    baseIntensity: LiquidGlassIntensity,
    elevationLevel: number = 0
  ): (colorScheme: 'light' | 'dark') => LiquidGlassStyle {
    // Creates materials that adapt based on elevation
    const intensityMap: LiquidGlassIntensity[] = [
      'ultraThin',
      'thin', 
      'regular',
      'thick',
      'chrome',
    ];

    return (colorScheme: 'light' | 'dark') => {
      const baseIndex = intensityMap.indexOf(baseIntensity);
      const adjustedIndex = Math.min(
        baseIndex + Math.floor(elevationLevel / 2),
        intensityMap.length - 1
      );
      
      const intensity = intensityMap[adjustedIndex];
      
      return this.createMaterial(
        {
          intensity,
          shadowIntensity: 0.1 + (elevationLevel * 0.02),
        },
        colorScheme
      );
    };
  }

  static createContinuousCorners(radius: number): ViewStyle {
    // iOS continuous corner radius (smoother than standard)
    if (Platform.OS === 'ios' && Platform.Version >= 13) {
      return {
        borderRadius: radius,
        // @ts-ignore - iOS specific property
        borderCurve: 'continuous',
      };
    }
    
    // Fallback for other platforms
    return {
      borderRadius: radius * 1.2, // Slightly larger radius to approximate
    };
  }

  private static createFallbackStyle(
    config: LiquidGlassConfig,
    colorScheme: 'light' | 'dark'
  ): ViewStyle {
    // Fallback for non-iOS platforms
    const opacityMap = {
      ultraThin: 0.3,
      thin: 0.5,
      regular: 0.7,
      thick: 0.9,
      chrome: 0.96,
    };

    const baseColor = colorScheme === 'light' 
      ? 'rgba(255, 255, 255'
      : 'rgba(28, 28, 30';

    return {
      backgroundColor: `${baseColor}, ${opacityMap[config.intensity]})`,
      ...(config.shadowIntensity && {
        elevation: Math.round(config.shadowIntensity * 10),
      }),
    };
  }

  private static applyTint(
    baseColor: string,
    tintColor: string,
    luminosity: number
  ): string {
    // Mix tint color with base material color
    // This is a simplified implementation
    const base = this.parseRGBA(baseColor);
    const tint = this.hexToRGB(tintColor);
    
    if (!base || !tint) return baseColor;

    const mixed = {
      r: Math.round((base.r * 0.7 + tint.r * 0.3) * luminosity),
      g: Math.round((base.g * 0.7 + tint.g * 0.3) * luminosity),
      b: Math.round((base.b * 0.7 + tint.b * 0.3) * luminosity),
      a: base.a,
    };

    return `rgba(${mixed.r}, ${mixed.g}, ${mixed.b}, ${mixed.a})`;
  }

  private static parseRGBA(color: string): { r: number; g: number; b: number; a: number } | null {
    const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (!match) return null;

    return {
      r: parseInt(match[1]),
      g: parseInt(match[2]),
      b: parseInt(match[3]),
      a: parseFloat(match[4] || '1'),
    };
  }

  private static hexToRGB(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return null;

    return {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    };
  }
}

// Helper function for easy use
export function liquidGlass(
  intensity: LiquidGlassIntensity,
  colorScheme: 'light' | 'dark',
  options?: Partial<LiquidGlassConfig>
): LiquidGlassStyle {
  return LiquidGlassMaterial.createMaterial(
    {
      intensity,
      ...options,
    },
    colorScheme
  );
}