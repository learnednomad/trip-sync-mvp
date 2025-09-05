/**
 * Dynamic Theme System
 * Extracts and applies platform-specific dynamic colors
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance, ColorSchemeName,Platform } from 'react-native';

import { themeConfig } from './theme.config';

export interface DynamicColors {
  primary: string;
  secondary: string;
  tertiary: string;
  surface: string;
  background: string;
  error: string;
  onPrimary: string;
  onSecondary: string;
  onTertiary: string;
  onSurface: string;
  onBackground: string;
  onError: string;
}

export interface DynamicTheme {
  colors: {
    light: DynamicColors;
    dark: DynamicColors;
  };
  colorScheme: ColorSchemeName;
  isHighContrast: boolean;
  prefersReducedMotion: boolean;
}

class DynamicThemeManager {
  private static instance: DynamicThemeManager;
  private currentTheme: DynamicTheme | null = null;
  private listeners: Set<(theme: DynamicTheme) => void> = new Set();
  
  static getInstance(): DynamicThemeManager {
    if (!DynamicThemeManager.instance) {
      DynamicThemeManager.instance = new DynamicThemeManager();
    }
    return DynamicThemeManager.instance;
  }
  
  async initialize(): Promise<DynamicTheme> {
    try {
      // Get current color scheme
      const colorScheme = Appearance.getColorScheme();
      
      // Extract platform-specific colors
      let dynamicColors: DynamicTheme['colors'];
      
      if (Platform.OS === 'ios') {
        dynamicColors = await this.extractIOSDynamicColors();
      } else {
        dynamicColors = await this.extractAndroidDynamicColors();
      }
      
      // Get accessibility settings
      const isHighContrast = await this.getHighContrastSetting();
      const prefersReducedMotion = await this.getReducedMotionSetting();
      
      this.currentTheme = {
        colors: dynamicColors,
        colorScheme,
        isHighContrast,
        prefersReducedMotion,
      };
      
      // Listen for system changes
      this.setupSystemListeners();
      
      return this.currentTheme;
    } catch (error) {
      console.error('Failed to initialize dynamic theme:', error);
      return this.getFallbackTheme();
    }
  }
  
  private async extractIOSDynamicColors(): Promise<DynamicTheme['colors']> {
    // In a real implementation, this would use native modules to get iOS accent colors
    // For now, we'll use the brand colors with iOS-specific adjustments
    
    const baseColors = themeConfig.brand;
    
    return {
      light: {
        primary: baseColors.primary,
        secondary: baseColors.secondary,
        tertiary: baseColors.tertiary,
        surface: themeConfig.ios.systemColors.secondarySystemBackground.light,
        background: themeConfig.ios.systemColors.systemBackground.light,
        error: baseColors.error,
        onPrimary: '#FFFFFF',
        onSecondary: '#FFFFFF',
        onTertiary: '#FFFFFF',
        onSurface: themeConfig.ios.systemColors.label.light,
        onBackground: themeConfig.ios.systemColors.label.light,
        onError: '#FFFFFF',
      },
      dark: {
        primary: this.adjustForDarkMode(baseColors.primary, 'ios'),
        secondary: this.adjustForDarkMode(baseColors.secondary, 'ios'),
        tertiary: this.adjustForDarkMode(baseColors.tertiary, 'ios'),
        surface: themeConfig.ios.systemColors.secondarySystemBackground.dark,
        background: themeConfig.ios.systemColors.systemBackground.dark,
        error: this.adjustForDarkMode(baseColors.error, 'ios'),
        onPrimary: '#000000',
        onSecondary: '#000000',
        onTertiary: '#000000',
        onSurface: themeConfig.ios.systemColors.label.dark,
        onBackground: themeConfig.ios.systemColors.label.dark,
        onError: '#000000',
      },
    };
  }
  
  private async extractAndroidDynamicColors(): Promise<DynamicTheme['colors']> {
    try {
      // Check for cached Material You colors
      const cachedColors = await AsyncStorage.getItem('materialYouColors');
      if (cachedColors) {
        return JSON.parse(cachedColors);
      }
    } catch (error) {
      console.warn('Failed to load cached Material You colors:', error);
    }
    
    // In a real implementation, this would use native modules to get Material You colors
    // For now, we'll generate them from brand colors
    
    const palettes = themeConfig.android.tonalPalettes;
    
    return {
      light: {
        primary: palettes.primary[40],
        secondary: palettes.secondary[40], 
        tertiary: palettes.tertiary[40],
        surface: palettes.neutral[99],
        background: palettes.neutral[99],
        error: palettes.error[40],
        onPrimary: palettes.primary[100],
        onSecondary: palettes.secondary[100],
        onTertiary: palettes.tertiary[100],
        onSurface: palettes.neutral[10],
        onBackground: palettes.neutral[10],
        onError: palettes.error[100],
      },
      dark: {
        primary: palettes.primary[80],
        secondary: palettes.secondary[80],
        tertiary: palettes.tertiary[80],
        surface: palettes.neutral[10],
        background: palettes.neutral[10],
        error: palettes.error[80],
        onPrimary: palettes.primary[20],
        onSecondary: palettes.secondary[20],
        onTertiary: palettes.tertiary[20],
        onSurface: palettes.neutral[90],
        onBackground: palettes.neutral[90],
        onError: palettes.error[20],
      },
    };
  }
  
  private adjustForDarkMode(color: string, platform: 'ios' | 'android'): string {
    // Platform-specific dark mode adjustments
    if (platform === 'ios') {
      // iOS prefers slightly brighter colors in dark mode
      return this.lightenColor(color, 0.2);
    } else {
      // Android Material 3 uses tonal palette shifts
      return this.lightenColor(color, 0.4);
    }
  }
  
  private lightenColor(color: string, percent: number): string {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(255 * percent);
    const R = Math.min(255, ((num >> 16) & 0xFF) + amt);
    const G = Math.min(255, ((num >> 8) & 0xFF) + amt);
    const B = Math.min(255, (num & 0xFF) + amt);
    
    return '#' + (
      0x1000000 +
      R * 0x10000 +
      G * 0x100 +
      B
    ).toString(16).slice(1);
  }
  
  private async getHighContrastSetting(): Promise<boolean> {
    // Check platform-specific high contrast settings
    try {
      const setting = await AsyncStorage.getItem('highContrastMode');
      return setting === 'true';
    } catch {
      return false;
    }
  }
  
  private async getReducedMotionSetting(): Promise<boolean> {
    // Check platform-specific reduced motion settings
    try {
      const setting = await AsyncStorage.getItem('reducedMotion');
      return setting === 'true';
    } catch {
      return false;
    }
  }
  
  private setupSystemListeners(): void {
    // Listen for color scheme changes
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (this.currentTheme) {
        this.currentTheme.colorScheme = colorScheme;
        this.notifyListeners();
      }
    });
    
    // In production, also listen for:
    // - Material You color changes (Android)
    // - Accent color changes (iOS)
    // - Accessibility setting changes
  }
  
  private getFallbackTheme(): DynamicTheme {
    return {
      colors: {
        light: {
          primary: themeConfig.brand.primary,
          secondary: themeConfig.brand.secondary,
          tertiary: themeConfig.brand.tertiary,
          surface: '#FFFFFF',
          background: '#F5F5F5',
          error: themeConfig.brand.error,
          onPrimary: '#FFFFFF',
          onSecondary: '#FFFFFF',
          onTertiary: '#FFFFFF',
          onSurface: '#000000',
          onBackground: '#000000',
          onError: '#FFFFFF',
        },
        dark: {
          primary: this.adjustForDarkMode(themeConfig.brand.primary, Platform.OS),
          secondary: this.adjustForDarkMode(themeConfig.brand.secondary, Platform.OS),
          tertiary: this.adjustForDarkMode(themeConfig.brand.tertiary, Platform.OS),
          surface: '#1C1C1E',
          background: '#000000',
          error: this.adjustForDarkMode(themeConfig.brand.error, Platform.OS),
          onPrimary: '#000000',
          onSecondary: '#000000',
          onTertiary: '#000000',
          onSurface: '#FFFFFF',
          onBackground: '#FFFFFF',
          onError: '#000000',
        },
      },
      colorScheme: Appearance.getColorScheme(),
      isHighContrast: false,
      prefersReducedMotion: false,
    };
  }
  
  subscribe(listener: (theme: DynamicTheme) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
  
  private notifyListeners(): void {
    if (this.currentTheme) {
      this.listeners.forEach(listener => listener(this.currentTheme!));
    }
  }
  
  getCurrentTheme(): DynamicTheme | null {
    return this.currentTheme;
  }
  
  async updateMaterialYouColors(colors: DynamicTheme['colors']): Promise<void> {
    // Called when Material You colors change on Android
    if (Platform.OS === 'android') {
      try {
        await AsyncStorage.setItem('materialYouColors', JSON.stringify(colors));
        if (this.currentTheme) {
          this.currentTheme.colors = colors;
          this.notifyListeners();
        }
      } catch (error) {
        console.error('Failed to update Material You colors:', error);
      }
    }
  }
}

export const dynamicTheme = DynamicThemeManager.getInstance();