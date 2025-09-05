# Design System Architecture

## Overview

This document defines the design system architecture for Sabron Trip Sync, integrating the latest iOS 18 Human Interface Guidelines (with Liquid Glass) and Material Design 3 (Material You) principles. The system provides adaptive, personalized experiences while maintaining platform-specific excellence.

## Core Design Principles

### Universal Principles
1. **Adaptive Personalization**: Dynamic theming based on user preferences and system settings
2. **Platform Excellence**: Native feel on each platform while sharing core components
3. **Accessibility First**: WCAG 2.1 AA compliance with enhanced motion and contrast options
4. **Performance Conscious**: Optimized animations and interactions for 60fps
5. **Offline-First Design**: Visual states for offline, syncing, and conflict scenarios

### Platform-Specific Principles

#### iOS 18 (Liquid Glass)
- **Fluid Dynamics**: Organic, physics-based animations
- **Depth & Layering**: Multi-dimensional interface with context-aware materials
- **Adaptive Morphing**: Components that transform based on context
- **Harmonic Motion**: Synchronized animations across interface elements

#### Material Design 3 (Material You)
- **Dynamic Color**: System-wide theming from user's wallpaper
- **Expressive Containers**: Rounded, animated content areas
- **Enhanced Motion**: Purposeful animations guiding user attention
- **Adaptive Layouts**: Responsive design for all screen sizes

## Design Tokens Architecture

### Token Structure
```typescript
// src/design/tokens/index.ts
export interface DesignTokens {
  // Core Tokens
  colors: ColorTokens;
  typography: TypographyTokens;
  spacing: SpacingTokens;
  elevation: ElevationTokens;
  motion: MotionTokens;
  
  // Platform-Specific Tokens
  ios: iOSTokens;
  android: AndroidTokens;
  
  // Semantic Tokens
  semantic: SemanticTokens;
}

interface ColorTokens {
  // Dynamic Base Colors
  primary: DynamicColorToken;
  secondary: DynamicColorToken;
  tertiary: DynamicColorToken;
  
  // Surface Colors
  surface: SurfaceColorTokens;
  background: BackgroundColorTokens;
  
  // State Colors
  error: ColorScaleToken;
  warning: ColorScaleToken;
  success: ColorScaleToken;
  info: ColorScaleToken;
}

interface DynamicColorToken {
  // Base color that adapts to user's system theme
  base: string;
  // iOS Liquid Glass variants
  liquid: {
    light: string;
    dark: string;
    elevated: string;
  };
  // Material 3 tonal palette
  tonal: {
    0: string;    // Black
    10: string;   // Darkest
    20: string;
    30: string;
    40: string;
    50: string;
    60: string;
    70: string;
    80: string;
    90: string;
    95: string;
    99: string;   // Lightest
    100: string;  // White
  };
}
```

### Platform Adaptive Tokens
```typescript
// src/design/tokens/adaptive.ts
export const adaptiveTokens = {
  // iOS Liquid Glass Materials
  ios: {
    materials: {
      ultraThin: 'liquid.ultraThin',
      thin: 'liquid.thin',
      regular: 'liquid.regular',
      thick: 'liquid.thick',
      chrome: 'liquid.chrome',
    },
    vibrancy: {
      label: 0.6,
      secondaryLabel: 0.5,
      tertiaryLabel: 0.3,
      quaternaryLabel: 0.18,
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
    },
  },
  
  // Material 3 Elevation & Motion
  android: {
    elevation: {
      level0: 0,
      level1: 1,
      level2: 3,
      level3: 6,
      level4: 8,
      level5: 12,
    },
    motion: {
      easing: {
        standard: 'cubic-bezier(0.2, 0, 0, 1)',
        emphasized: 'cubic-bezier(0.2, 0, 0, 1)',
        decelerated: 'cubic-bezier(0, 0, 0, 1)',
        accelerated: 'cubic-bezier(0.3, 0, 1, 1)',
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
      },
    },
  },
};
```

## Component Architecture

### Base Component System
```typescript
// src/components/base/BaseComponent.tsx
import { Platform } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { motion } from '@/design/motion';

interface BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'small' | 'medium' | 'large';
  elevation?: number;
  adaptiveColor?: boolean;
  children: React.ReactNode;
}

export const BaseComponent: React.FC<BaseComponentProps> = ({
  variant = 'primary',
  size = 'medium',
  elevation,
  adaptiveColor = true,
  children,
}) => {
  const theme = useTheme();
  const platform = Platform.OS;
  
  // Platform-specific styling
  const styles = platform === 'ios' 
    ? getIOSLiquidGlassStyles(theme, variant, size)
    : getMaterial3Styles(theme, variant, size, elevation);
  
  // Platform-specific animation
  const animation = platform === 'ios'
    ? motion.ios.spring
    : motion.android.standard;
    
  return (
    <Animated.View style={[styles, animation]}>
      {children}
    </Animated.View>
  );
};
```

### Adaptive Components

#### Button Component (Cross-Platform)
```typescript
// src/components/common/AdaptiveButton.tsx
import React from 'react';
import { Platform, Pressable } from 'react-native';
import { styled } from 'nativewind';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';
import { useAdaptiveTheme } from '@/hooks/useAdaptiveTheme';
import { LiquidGlassView } from './ios/LiquidGlassView';
import { Material3Container } from './android/Material3Container';

interface AdaptiveButtonProps {
  onPress: () => void;
  variant?: 'filled' | 'tonal' | 'outlined' | 'text';
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

export const AdaptiveButton: React.FC<AdaptiveButtonProps> = ({
  onPress,
  variant = 'filled',
  size = 'medium',
  children,
  disabled = false,
  loading = false,
  fullWidth = false,
}) => {
  const { trigger } = useHapticFeedback();
  const { theme, platform } = useAdaptiveTheme();
  
  const handlePress = () => {
    trigger(platform === 'ios' ? 'impactLight' : 'click');
    onPress();
  };
  
  if (platform === 'ios') {
    return (
      <LiquidGlassView
        variant={variant}
        intensity={variant === 'filled' ? 'regular' : 'thin'}
        cornerRadius={theme.radius[size]}
      >
        <Pressable
          onPress={handlePress}
          disabled={disabled || loading}
          style={({ pressed }) => ({
            opacity: pressed ? 0.8 : 1,
            transform: pressed ? [{ scale: 0.98 }] : [],
          })}
        >
          {children}
        </Pressable>
      </LiquidGlassView>
    );
  }
  
  // Material 3 Implementation
  return (
    <Material3Container
      variant={variant}
      elevation={variant === 'filled' ? 1 : 0}
      ripple={!disabled}
    >
      <Pressable
        onPress={handlePress}
        disabled={disabled || loading}
        android_ripple={{
          color: theme.colors.primary.tonal[30],
          borderless: false,
        }}
      >
        {children}
      </Pressable>
    </Material3Container>
  );
};
```

#### Dynamic Card Component
```typescript
// src/components/common/AdaptiveCard.tsx
export const AdaptiveCard: React.FC<AdaptiveCardProps> = ({
  children,
  onPress,
  elevation = 1,
  padding = 'medium',
}) => {
  const { platform, theme } = useAdaptiveTheme();
  
  if (platform === 'ios') {
    return (
      <LiquidGlassCard
        material="regular"
        cornerRadius={20}
        shadowIntensity={0.15}
        onPress={onPress}
      >
        <View style={{ padding: theme.spacing[padding] }}>
          {children}
        </View>
      </LiquidGlassCard>
    );
  }
  
  return (
    <Material3ExpressiveContainer
      elevation={elevation}
      shape="extraLarge"
      animate="enter"
      onPress={onPress}
    >
      <View style={{ padding: theme.spacing[padding] }}>
        {children}
      </View>
    </Material3ExpressiveContainer>
  );
};
```

## Theme Configuration

### Dynamic Theme System
```typescript
// src/design/theme/DynamicTheme.ts
import { Platform } from 'react-native';
import { 
  extractIOSAccentColor, 
  extractAndroidDynamicColors 
} from '@/utils/systemColors';

export class DynamicTheme {
  private static instance: DynamicTheme;
  private baseTheme: ThemeConfig;
  private dynamicColors: DynamicColorScheme;
  
  static async initialize() {
    const instance = new DynamicTheme();
    
    if (Platform.OS === 'ios') {
      // Extract accent color from iOS system
      const accentColor = await extractIOSAccentColor();
      instance.dynamicColors = instance.generateIOSLiquidGlassPalette(accentColor);
    } else {
      // Extract Material You colors from Android
      const dynamicColors = await extractAndroidDynamicColors();
      instance.dynamicColors = instance.generateMaterial3Palette(dynamicColors);
    }
    
    this.instance = instance;
    return instance;
  }
  
  private generateIOSLiquidGlassPalette(accentColor: string): DynamicColorScheme {
    // Generate Liquid Glass color variations
    return {
      primary: this.createLiquidGlassColor(accentColor),
      secondary: this.createLiquidGlassColor(this.complementaryColor(accentColor)),
      surface: {
        ultraThin: 'rgba(255, 255, 255, 0.3)',
        thin: 'rgba(255, 255, 255, 0.5)',
        regular: 'rgba(255, 255, 255, 0.7)',
        thick: 'rgba(255, 255, 255, 0.9)',
        chrome: 'rgba(255, 255, 255, 0.95)',
      },
    };
  }
  
  private generateMaterial3Palette(source: MaterialYouColors): DynamicColorScheme {
    // Generate Material 3 tonal palette
    return {
      primary: this.createTonalPalette(source.primary),
      secondary: this.createTonalPalette(source.secondary),
      tertiary: this.createTonalPalette(source.tertiary),
      surface: this.createSurfaceColors(source),
    };
  }
}
```

### Theme Provider
```typescript
// src/providers/ThemeProvider.tsx
import React, { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { DynamicTheme } from '@/design/theme/DynamicTheme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState<DynamicTheme | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const initializeTheme = async () => {
      try {
        const dynamicTheme = await DynamicTheme.initialize();
        setTheme(dynamicTheme);
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeTheme();
    
    // Listen for system theme changes
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      // Re-initialize theme on system change
      initializeTheme();
    });
    
    return () => subscription?.remove();
  }, []);
  
  if (isLoading) {
    return <ThemeLoadingScreen />;
  }
  
  return (
    <ThemeContext.Provider value={{ theme, colorScheme: systemColorScheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

## Motion & Animation System

### Platform-Adaptive Animations
```typescript
// src/design/motion/adaptiveMotion.ts
import { Platform } from 'react-native';
import { 
  withSpring, 
  withTiming, 
  Easing,
  SharedValue 
} from 'react-native-reanimated';

export const adaptiveMotion = {
  // iOS Liquid Glass Spring Animations
  iosSpring: (value: SharedValue<number>, config?: SpringConfig) => {
    return withSpring(value, {
      damping: 20,
      stiffness: 300,
      mass: 0.8,
      overshootClamping: false,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 2,
      ...config,
    });
  },
  
  // Material 3 Emphasized Motion
  material3Emphasized: (value: SharedValue<number>, duration = 400) => {
    return withTiming(value, {
      duration,
      easing: Easing.bezier(0.2, 0, 0, 1),
    });
  },
  
  // Cross-platform entrance animation
  entrance: (platform: 'ios' | 'android') => {
    if (platform === 'ios') {
      return {
        opacity: { from: 0, to: 1 },
        transform: [
          { scale: { from: 0.9, to: 1 } },
          { translateY: { from: 10, to: 0 } },
        ],
        config: { type: 'spring', damping: 20 },
      };
    } else {
      return {
        opacity: { from: 0, to: 1 },
        transform: [
          { scale: { from: 0.95, to: 1 } },
        ],
        config: { type: 'timing', duration: 300 },
      };
    }
  },
};
```

### Gesture Animations
```typescript
// src/design/motion/gestureAnimations.ts
export const gestureAnimations = {
  // iOS Rubber Band Effect
  iosRubberBand: (value: number, min: number, max: number) => {
    'worklet';
    if (value < min) {
      return min - Math.sqrt(min - value) * 0.5;
    }
    if (value > max) {
      return max + Math.sqrt(value - max) * 0.5;
    }
    return value;
  },
  
  // Material 3 Swipe Actions
  material3Swipe: {
    threshold: 0.3,
    damping: 20,
    activationDistance: 75,
    rubberBandEffect: true,
    rubberBandFactor: 0.6,
  },
};
```

## Accessibility & Adaptive Features

### Accessibility Configuration
```typescript
// src/design/accessibility/config.ts
export const accessibilityConfig = {
  motion: {
    reducedMotion: {
      ios: {
        duration: 0.1,
        spring: { damping: 100 },
      },
      android: {
        duration: 0,
        instant: true,
      },
    },
  },
  
  contrast: {
    high: {
      colorMultiplier: 1.3,
      borderWidth: 2,
      focusIndicatorWidth: 4,
    },
  },
  
  fontSize: {
    scaling: {
      min: 0.85,
      max: 2.0,
      respectSystemSettings: true,
    },
  },
};
```

## Implementation Guidelines

### Component Creation Checklist
1. ✅ Support both iOS Liquid Glass and Material 3 styling
2. ✅ Implement platform-specific animations
3. ✅ Include accessibility props and states
4. ✅ Support dynamic color theming
5. ✅ Implement proper offline states
6. ✅ Add haptic feedback where appropriate
7. ✅ Test on both platforms with different color schemes

### Design Token Usage
```typescript
// Example: Using design tokens in components
import { useTheme } from '@/hooks/useTheme';

const MyComponent = () => {
  const { tokens, platform } = useTheme();
  
  return (
    <View
      style={{
        backgroundColor: tokens.colors.surface.primary,
        padding: tokens.spacing.medium,
        borderRadius: tokens.radius[platform === 'ios' ? 'large' : 'medium'],
        ...platform === 'ios' && {
          shadowColor: tokens.colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        ...platform === 'android' && {
          elevation: tokens.elevation.level2,
        },
      }}
    >
      {/* Component content */}
    </View>
  );
};
```

### Performance Guidelines
1. Use `React.memo` for all components
2. Implement proper animation cleanup
3. Lazy load heavy design assets
4. Cache dynamic color calculations
5. Use InteractionManager for heavy operations

## Migration Path

### Phase 1: Foundation (Week 1-2)
1. Implement dynamic theme system
2. Create base adaptive components
3. Set up design token architecture

### Phase 2: Core Components (Week 3-4)  
1. Migrate buttons, cards, and inputs
2. Implement platform-specific animations
3. Add accessibility features

### Phase 3: Feature Components (Week 5-6)
1. Update trip and expense components
2. Implement dynamic color throughout
3. Add offline state designs

### Phase 4: Polish & Testing (Week 7-8)
1. Performance optimization
2. Accessibility testing
3. Cross-platform validation