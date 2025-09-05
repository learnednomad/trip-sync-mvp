/**
 * AdaptiveView - Base view component with platform-specific styling
 */

import React from 'react';
import { View, ViewProps, Platform, ViewStyle } from 'react-native';
import { useAdaptiveTheme } from '@/hooks/useAdaptiveTheme';
import { liquidGlass } from '@/design/theme/ios/LiquidGlass';
import { material3Container } from '@/design/theme/android/Material3';

export interface AdaptiveViewProps extends ViewProps {
  // Layout props
  direction?: 'row' | 'column';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  flex?: number;
  gap?: 'xxsmall' | 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
  padding?: 'none' | 'xxsmall' | 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
  
  // Visual props
  variant?: 'surface' | 'primary' | 'secondary' | 'tertiary' | 'tonal';
  elevation?: 0 | 1 | 2 | 3 | 4 | 5;
  borderRadius?: 'none' | 'small' | 'medium' | 'large' | 'continuous';
  backgroundColor?: string;
  
  // iOS specific
  iosIntensity?: 'ultraThin' | 'thin' | 'regular' | 'thick' | 'chrome';
  
  // Children
  children?: React.ReactNode;
}

export const AdaptiveView = React.forwardRef<View, AdaptiveViewProps>(
  (
    {
      // Layout
      direction = 'column',
      align = 'stretch',
      justify = 'start',
      flex,
      gap,
      padding = 'none',
      
      // Visual
      variant,
      elevation = 0,
      borderRadius = 'medium',
      backgroundColor,
      iosIntensity = 'regular',
      
      // Rest
      style,
      children,
      ...props
    },
    ref
  ) => {
    const { theme, platform, colorScheme } = useAdaptiveTheme();
    
    // Base layout styles
    const layoutStyles: ViewStyle = {
      flexDirection: direction,
      alignItems: getAlignItems(align),
      justifyContent: getJustifyContent(justify),
      ...(flex !== undefined && { flex }),
      ...(gap && { gap: theme.spacing[gap] }),
      ...(padding !== 'none' && { padding: theme.spacing[padding] }),
    };
    
    // Platform-specific visual styles
    let visualStyles: ViewStyle = {};
    
    if (variant) {
      if (platform === 'ios' && variant !== 'tonal') {
        // iOS Liquid Glass styling
        visualStyles = liquidGlass(iosIntensity, colorScheme, {
          shadowIntensity: elevation ? elevation * 0.02 : undefined,
        });
      } else {
        // Material 3 styling
        const colors = theme.colors[colorScheme];
        visualStyles = material3Container(
          variant === 'tonal' ? 'primary' : variant as any,
          elevation,
          getBorderRadius(borderRadius) as any,
          colors
        );
      }
    }
    
    // Apply border radius
    if (borderRadius !== 'none') {
      const radius = getBorderRadiusValue(borderRadius, platform);
      visualStyles.borderRadius = radius;
      
      if (platform === 'ios' && borderRadius === 'continuous') {
        // @ts-ignore - iOS specific
        visualStyles.borderCurve = 'continuous';
      }
    }
    
    // Apply custom background color
    if (backgroundColor) {
      visualStyles.backgroundColor = backgroundColor;
    }
    
    return (
      <View
        ref={ref}
        style={[layoutStyles, visualStyles, style]}
        {...props}
      >
        {children}
      </View>
    );
  }
);

AdaptiveView.displayName = 'AdaptiveView';

// Helper functions
function getAlignItems(align: string): ViewStyle['alignItems'] {
  switch (align) {
    case 'start': return 'flex-start';
    case 'center': return 'center';
    case 'end': return 'flex-end';
    case 'stretch': return 'stretch';
    default: return 'stretch';
  }
}

function getJustifyContent(justify: string): ViewStyle['justifyContent'] {
  switch (justify) {
    case 'start': return 'flex-start';
    case 'center': return 'center';
    case 'end': return 'flex-end';
    case 'between': return 'space-between';
    case 'around': return 'space-around';
    case 'evenly': return 'space-evenly';
    default: return 'flex-start';
  }
}

function getBorderRadius(radius: string): string {
  switch (radius) {
    case 'none': return 'none';
    case 'small': return 'small';
    case 'medium': return 'medium';
    case 'large': return 'large';
    case 'continuous': return 'extraLarge';
    default: return 'medium';
  }
}

function getBorderRadiusValue(radius: string, platform: string): number {
  const radiusMap = {
    none: 0,
    small: 8,
    medium: platform === 'ios' ? 12 : 12,
    large: platform === 'ios' ? 20 : 16,
    continuous: platform === 'ios' ? 20 : 28,
  };
  
  return radiusMap[radius as keyof typeof radiusMap] || 12;
}