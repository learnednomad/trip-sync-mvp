/**
 * AdaptiveCard - Platform-adaptive card component
 * iOS: Liquid Glass material with blur effects
 * Android: Material 3 expressive container with elevation
 */

import React, { useCallback } from 'react';
import {
  Pressable,
  type PressableStateCallbackType,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { material3Container } from '@/design/theme/android/Material3';
import { liquidGlass } from '@/design/theme/ios/LiquidGlass';
import { useAdaptiveTheme } from '@/hooks/useAdaptiveTheme';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface AdaptiveCardProps {
  // Behavior
  onPress?: () => void;
  onLongPress?: () => void;
  disabled?: boolean;

  // Appearance
  variant?: 'surface' | 'filled' | 'elevated' | 'outlined';
  elevation?: 0 | 1 | 2 | 3 | 4 | 5;
  padding?: 'none' | 'small' | 'medium' | 'large';
  margin?: 'none' | 'small' | 'medium' | 'large';

  // iOS specific
  iosIntensity?: 'ultraThin' | 'thin' | 'regular' | 'thick';

  // Content
  children: React.ReactNode;

  // Testing
  testID?: string;

  // Accessibility
  accessibilityLabel?: string;
  accessibilityRole?: 'button' | 'none';
  accessibilityState?: any;
}

export const AdaptiveCard: React.FC<AdaptiveCardProps> = ({
  onPress,
  onLongPress,
  disabled = false,
  variant = 'surface',
  elevation = 1,
  padding = 'medium',
  margin = 'none',
  iosIntensity = 'regular',
  children,
  testID,
  accessibilityLabel,
  accessibilityRole = onPress ? 'button' : 'none',
  accessibilityState,
}) => {
  const { trigger } = useHapticFeedback();
  const { theme, platform, colorScheme } = useAdaptiveTheme();
  const colors = theme.colors[colorScheme];

  // Animation values
  const scale = useSharedValue(1);
  const shadowScale = useSharedValue(1);
  const elevationValue = useSharedValue(elevation);

  // Handle press animations
  const handlePressIn = useCallback(() => {
    'worklet';
    if (platform === 'ios') {
      scale.value = withSpring(0.98, {
        damping: 15,
        stiffness: 400,
      });
      shadowScale.value = withTiming(0.9, { duration: 150 });
    } else {
      scale.value = withTiming(0.99, {
        duration: 100,
        easing: Easing.out(Easing.quad),
      });
      elevationValue.value = withTiming(elevation + 2, { duration: 150 });
    }
  }, [platform, elevation]);

  const handlePressOut = useCallback(() => {
    'worklet';
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 400,
    });
    shadowScale.value = withTiming(1, { duration: 200 });
    elevationValue.value = withTiming(elevation, { duration: 200 });
  }, [elevation]);

  const handlePress = useCallback(() => {
    if (disabled || !onPress) return;

    trigger(platform === 'ios' ? 'impactLight' : 'click');
    onPress();
  }, [disabled, onPress, platform, trigger]);

  const handleLongPress = useCallback(() => {
    if (disabled || !onLongPress) return;

    trigger(platform === 'ios' ? 'impactMedium' : 'longPress');
    onLongPress();
  }, [disabled, onLongPress, platform, trigger]);

  // Build card styles
  const paddingValue = theme.spacing[padding];
  const marginValue = margin === 'none' ? 0 : theme.spacing[margin];

  const baseCardStyle: ViewStyle = {
    padding: padding === 'none' ? 0 : paddingValue,
    margin: marginValue,
    borderRadius: platform === 'ios' ? 20 : 16,
    overflow: 'hidden',
  };

  // Platform-specific styles
  let platformStyles: ViewStyle = {};

  if (platform === 'ios') {
    // iOS Liquid Glass
    if (variant === 'surface' || variant === 'elevated') {
      platformStyles = liquidGlass(iosIntensity, colorScheme, {
        shadowIntensity: elevation * 0.05,
      });
    } else if (variant === 'filled') {
      platformStyles = {
        backgroundColor: colors.primaryContainer || colors.primary + '20',
      };
    } else if (variant === 'outlined') {
      platformStyles = {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.outline + '40',
      };
    }

    // iOS continuous corners
    // @ts-ignore
    platformStyles.borderCurve = 'continuous';
  } else {
    // Android Material 3
    const androidVariant = variant === 'filled' ? 'primary' : 'surface';
    platformStyles = material3Container(
      androidVariant,
      elevation,
      'large',
      colors
    );

    if (variant === 'outlined') {
      platformStyles.backgroundColor = 'transparent';
      platformStyles.borderWidth = 1;
      platformStyles.borderColor = colors.outline;
      platformStyles.elevation = 0;
    }
  }

  // Animated styles
  const animatedStyle = useAnimatedStyle(() => {
    const shadowStyles =
      platform === 'ios'
        ? {
            shadowOpacity: interpolate(
              shadowScale.value,
              [0.9, 1],
              [elevation * 0.03, elevation * 0.05]
            ),
            shadowRadius: interpolate(
              shadowScale.value,
              [0.9, 1],
              [elevation * 2, elevation * 3]
            ),
          }
        : {
            elevation: elevationValue.value,
          };

    return {
      transform: [{ scale: scale.value }],
      ...shadowStyles,
    };
  });

  // Disabled styles
  if (disabled) {
    platformStyles.opacity = 0.6;
  }

  const cardContent = (
    <View style={[baseCardStyle, platformStyles]}>{children}</View>
  );

  // If not pressable, return static card
  if (!onPress && !onLongPress) {
    return (
      <View testID={testID} accessibilityRole="none">
        {cardContent}
      </View>
    );
  }

  // Return pressable card
  return (
    <AnimatedPressable
      onPress={handlePress}
      onLongPress={handleLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      testID={testID}
      style={animatedStyle}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityRole}
      accessibilityState={{
        disabled,
        ...accessibilityState,
      }}
      android_ripple={
        platform === 'android' && !disabled
          ? {
              color: colors.primary + '20',
              borderless: false,
              radius: 16,
            }
          : undefined
      }
    >
      {({ pressed }: PressableStateCallbackType) => (
        <>
          {/* Card content */}
          {cardContent}

          {/* iOS press overlay */}
          {platform === 'ios' && pressed && !disabled && (
            <View
              style={{
                ...StyleSheet.absoluteFillObject,
                backgroundColor: colorScheme === 'light' ? '#000' : '#FFF',
                opacity: 0.05,
                borderRadius: 20,
              }}
              pointerEvents="none"
            />
          )}
        </>
      )}
    </AnimatedPressable>
  );
};
