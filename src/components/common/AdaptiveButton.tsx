/**
 * AdaptiveButton - Platform-adaptive button component
 * Renders as Liquid Glass on iOS and Material 3 on Android
 */

import React, { useCallback } from 'react';
import { 
  Pressable, 
  Platform, 
  ActivityIndicator,
  PressableStateCallbackType,
  ViewStyle,
  View,
} from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';
import { useAdaptiveTheme } from '@/hooks/useAdaptiveTheme';
import { AdaptiveText } from '@/components/base/AdaptiveText';
import { AdaptiveView } from '@/components/base/AdaptiveView';
import { DynamicIcon } from './DynamicIcon';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface AdaptiveButtonProps {
  // Behavior
  onPress: () => void;
  onLongPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  
  // Appearance
  variant?: 'filled' | 'tonal' | 'outlined' | 'text' | 'elevated';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  
  // Content
  children: React.ReactNode;
  icon?: string;
  iconPosition?: 'start' | 'end';
  
  // Testing
  testID?: string;
}

export const AdaptiveButton: React.FC<AdaptiveButtonProps> = ({
  onPress,
  onLongPress,
  disabled = false,
  loading = false,
  variant = 'filled',
  size = 'medium',
  fullWidth = false,
  children,
  icon,
  iconPosition = 'start',
  testID,
}) => {
  const { trigger } = useHapticFeedback();
  const { theme, platform, colorScheme } = useAdaptiveTheme();
  const colors = theme.colors[colorScheme];
  
  // Animation values
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  
  // Handle press events
  const handlePressIn = useCallback(() => {
    'worklet';
    if (platform === 'ios') {
      scale.value = withSpring(0.96, { damping: 15 });
      opacity.value = withTiming(0.8, { duration: 100 });
    } else {
      scale.value = withSpring(0.98, { damping: 20 });
    }
  }, [platform]);
  
  const handlePressOut = useCallback(() => {
    'worklet';
    scale.value = withSpring(1, { damping: 15 });
    opacity.value = withTiming(1, { duration: 100 });
  }, []);
  
  const handlePress = useCallback(() => {
    if (disabled || loading) return;
    
    trigger(platform === 'ios' ? 'impactLight' : 'click');
    onPress();
  }, [disabled, loading, platform, trigger, onPress]);
  
  const handleLongPress = useCallback(() => {
    if (disabled || loading || !onLongPress) return;
    
    trigger(platform === 'ios' ? 'impactMedium' : 'longPress');
    onLongPress();
  }, [disabled, loading, platform, trigger, onLongPress]);
  
  // Animated styles
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: platform === 'ios' ? opacity.value : 1,
  }));
  
  // Get button dimensions
  const dimensions = getButtonDimensions(size);
  const isTextOnly = variant === 'text';
  
  // Build button styles
  const buttonStyle: ViewStyle = {
    height: isTextOnly ? undefined : dimensions.height,
    minWidth: fullWidth ? undefined : dimensions.minWidth,
    paddingHorizontal: dimensions.paddingHorizontal,
    paddingVertical: isTextOnly ? dimensions.paddingVertical : 0,
    borderRadius: dimensions.borderRadius,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...(fullWidth && { width: '100%' }),
  };
  
  // Get variant-specific styles
  const variantStyles = getVariantStyles(variant, colors, colorScheme, platform, disabled);
  
  // Render loading indicator
  if (loading) {
    return (
      <AdaptiveView
        style={[buttonStyle, variantStyles.container]}
        testID={testID}
      >
        <ActivityIndicator
          size={size === 'small' ? 'small' : 'small'}
          color={variantStyles.contentColor}
        />
      </AdaptiveView>
    );
  }
  
  return (
    <AnimatedPressable
      onPress={handlePress}
      onLongPress={handleLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      testID={testID}
      style={[buttonStyle, variantStyles.container, animatedStyle]}
      android_ripple={
        platform === 'android' && !disabled
          ? {
              color: variantStyles.rippleColor,
              borderless: false,
            }
          : undefined
      }
    >
      {({ pressed }: PressableStateCallbackType) => (
        <>
          {/* Render iOS state layer */}
          {platform === 'ios' && pressed && !disabled && (
            <View
              style={{
                ...StyleSheet.absoluteFillObject,
                backgroundColor: variantStyles.stateLayerColor,
                opacity: 0.12,
                borderRadius: dimensions.borderRadius,
              }}
            />
          )}
          
          {/* Icon start */}
          {icon && iconPosition === 'start' && (
            <DynamicIcon
              name={icon}
              size={dimensions.iconSize}
              color={variantStyles.contentColor}
            />
          )}
          
          {/* Label */}
          <AdaptiveText
            variant={dimensions.textVariant}
            weight="medium"
            style={{ color: variantStyles.contentColor }}
          >
            {children}
          </AdaptiveText>
          
          {/* Icon end */}
          {icon && iconPosition === 'end' && (
            <DynamicIcon
              name={icon}
              size={dimensions.iconSize}
              color={variantStyles.contentColor}
            />
          )}
        </>
      )}
    </AnimatedPressable>
  );
};

// Helper functions
function getButtonDimensions(size: string) {
  const dimensions = {
    small: {
      height: 32,
      minWidth: 64,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      iconSize: 16,
      textVariant: 'labelMedium' as const,
    },
    medium: {
      height: 40,
      minWidth: 80,
      paddingHorizontal: 20,
      paddingVertical: 8,
      borderRadius: 20,
      iconSize: 18,
      textVariant: 'labelLarge' as const,
    },
    large: {
      height: 48,
      minWidth: 96,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 24,
      iconSize: 20,
      textVariant: 'labelLarge' as const,
    },
  };
  
  return dimensions[size as keyof typeof dimensions] || dimensions.medium;
}

function getVariantStyles(
  variant: string,
  colors: any,
  colorScheme: string,
  platform: string,
  disabled: boolean
) {
  const opacity = disabled ? 0.38 : 1;
  
  const variants = {
    filled: {
      container: {
        backgroundColor: colors.primary,
        opacity,
      },
      contentColor: colors.onPrimary,
      rippleColor: colors.onPrimary,
      stateLayerColor: colors.onPrimary,
    },
    tonal: {
      container: {
        backgroundColor: colors.primaryContainer || colors.primary + '20',
        opacity,
      },
      contentColor: colors.onPrimaryContainer || colors.primary,
      rippleColor: colors.primary,
      stateLayerColor: colors.primary,
    },
    outlined: {
      container: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: disabled ? colors.outline + '40' : colors.outline,
        opacity,
      },
      contentColor: colors.primary,
      rippleColor: colors.primary,
      stateLayerColor: colors.primary,
    },
    text: {
      container: {
        backgroundColor: 'transparent',
        opacity,
      },
      contentColor: colors.primary,
      rippleColor: colors.primary,
      stateLayerColor: colors.primary,
    },
    elevated: {
      container: {
        backgroundColor: colorScheme === 'light' 
          ? colors.surface
          : colors.surfaceVariant,
        opacity,
        ...(platform === 'android' && {
          elevation: disabled ? 0 : 2,
        }),
        ...(platform === 'ios' && {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: disabled ? 0 : 0.08,
          shadowRadius: 3,
        }),
      },
      contentColor: colors.primary,
      rippleColor: colors.primary,
      stateLayerColor: colors.primary,
    },
  };
  
  return variants[variant as keyof typeof variants] || variants.filled;
}

import { StyleSheet } from 'react-native';