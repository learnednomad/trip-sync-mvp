/**
 * AdaptiveText - Typography component with platform-specific styling
 */

import React from 'react';
import { Text, TextProps, Platform, TextStyle } from 'react-native';
import { useAdaptiveTheme } from '@/hooks/useAdaptiveTheme';
import { getPlatformTypography } from '@/design/theme/theme.config';

export interface AdaptiveTextProps extends TextProps {
  // Typography variant
  variant?: 
    | 'displayLarge' | 'displayMedium' | 'displaySmall'
    | 'headlineLarge' | 'headlineMedium' | 'headlineSmall'
    | 'titleLarge' | 'titleMedium' | 'titleSmall'
    | 'bodyLarge' | 'bodyMedium' | 'bodySmall'
    | 'labelLarge' | 'labelMedium' | 'labelSmall';
    
  // Text properties
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
  color?: 'primary' | 'secondary' | 'tertiary' | 'error' | 'warning' | 'success' | 'onSurface' | 'onSurfaceVariant' | 'onPrimary' | 'onSecondary';
  align?: 'left' | 'center' | 'right' | 'justify';
  
  // Behavior
  adaptive?: boolean; // Apply platform-specific optimizations
  mono?: boolean; // Use monospace font
  
  children: React.ReactNode;
}

export const AdaptiveText = React.forwardRef<Text, AdaptiveTextProps>(
  (
    {
      variant = 'bodyMedium',
      weight,
      color = 'onSurface',
      align,
      adaptive = false,
      mono = false,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const { theme, platform, colorScheme } = useAdaptiveTheme();
    const typography = getPlatformTypography();
    
    // Get variant styles
    const variantStyles = typography[variant] || typography.bodyMedium;
    
    // Build text styles
    const textStyles: TextStyle = {
      ...variantStyles,
      fontFamily: mono 
        ? typography.fonts.mono 
        : typography.fonts[weight || variantStyles.weight || 'regular'],
    };
    
    // Apply weight override if specified
    if (weight) {
      textStyles.fontWeight = getTextWeight(weight, platform);
    }
    
    // Apply color
    const colors = theme.colors[colorScheme];
    switch (color) {
      case 'primary':
        textStyles.color = colors.primary;
        break;
      case 'secondary':
        textStyles.color = colors.secondary;
        break;
      case 'tertiary':
        textStyles.color = colors.tertiary;
        break;
      case 'error':
        textStyles.color = colors.error;
        break;
      case 'warning':
        textStyles.color = theme.brand.warning;
        break;
      case 'success':
        textStyles.color = theme.brand.success;
        break;
      case 'onSurface':
        textStyles.color = colors.onSurface;
        break;
      case 'onSurfaceVariant':
        textStyles.color = Platform.OS === 'ios' 
          ? theme.ios.systemColors.secondaryLabel[colorScheme]
          : colors.onSurfaceVariant;
        break;
      case 'onPrimary':
        textStyles.color = colors.onPrimary;
        break;
      case 'onSecondary':
        textStyles.color = colors.onSecondary;
        break;
    }
    
    // Apply alignment
    if (align) {
      textStyles.textAlign = align;
    }
    
    // Platform-specific optimizations
    if (adaptive) {
      if (platform === 'ios') {
        // iOS text optimizations
        textStyles.includeFontPadding = false;
        if (variant.startsWith('display') || variant.startsWith('headline')) {
          // @ts-ignore - iOS specific
          textStyles.dynamicTypeRamp = 'largeTitle';
        }
      } else {
        // Android text optimizations
        textStyles.includeFontPadding = true;
        textStyles.textAlignVertical = 'center';
      }
    }
    
    return (
      <Text
        ref={ref}
        style={[textStyles, style]}
        allowFontScaling={true}
        maxFontSizeMultiplier={1.5} // Accessibility: limit extreme scaling
        {...props}
      >
        {children}
      </Text>
    );
  }
);

AdaptiveText.displayName = 'AdaptiveText';

// Helper function to get platform-specific font weights
function getTextWeight(weight: string, platform: string): TextStyle['fontWeight'] {
  if (platform === 'ios') {
    // iOS uses numeric weights
    switch (weight) {
      case 'regular': return '400';
      case 'medium': return '500';
      case 'semibold': return '600';
      case 'bold': return '700';
      default: return '400';
    }
  } else {
    // Android uses named weights
    switch (weight) {
      case 'regular': return 'normal';
      case 'medium': return '500';
      case 'semibold': return '600';
      case 'bold': return 'bold';
      default: return 'normal';
    }
  }
}