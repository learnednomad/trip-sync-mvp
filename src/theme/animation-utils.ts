/**
 * Animation Utilities
 * Helper functions for creating and managing animations
 */

import { Animated, LayoutAnimation, Platform } from 'react-native';
import {
  animation,
  nativeEasing,
  reanimatedConfigs,
  themeSwitchAnimation,
} from './animations';

// Layout animation presets
export const layoutAnimationPresets = {
  // Quick layout changes
  fast: {
    duration: animation.duration.fast,
    create: {
      type: LayoutAnimation.Types.easeInEaseOut,
      property: LayoutAnimation.Properties.opacity,
    },
    update: {
      type: LayoutAnimation.Types.easeInEaseOut,
    },
    delete: {
      type: LayoutAnimation.Types.easeInEaseOut,
      property: LayoutAnimation.Properties.opacity,
    },
  },
  
  // Standard layout changes
  normal: {
    duration: animation.duration.normal,
    create: {
      type: LayoutAnimation.Types.easeInEaseOut,
      property: LayoutAnimation.Properties.scaleXY,
    },
    update: {
      type: LayoutAnimation.Types.easeInEaseOut,
    },
    delete: {
      type: LayoutAnimation.Types.easeInEaseOut,
      property: LayoutAnimation.Properties.scaleXY,
    },
  },
  
  // Smooth layout changes
  smooth: {
    duration: animation.duration.slow,
    create: {
      type: LayoutAnimation.Types.spring,
      property: LayoutAnimation.Properties.scaleXY,
      springDamping: 0.7,
    },
    update: {
      type: LayoutAnimation.Types.spring,
      springDamping: 0.7,
    },
    delete: {
      type: LayoutAnimation.Types.easeInEaseOut,
      property: LayoutAnimation.Properties.scaleXY,
    },
  },
};

// Animated value creators
export const createAnimatedValue = (initialValue: number = 0) => {
  return new Animated.Value(initialValue);
};

export const createAnimatedXY = (x: number = 0, y: number = 0) => {
  return new Animated.ValueXY({ x, y });
};

// Animation runners
export const runAnimation = (
  animatedValue: Animated.Value,
  toValue: number,
  config = { duration: animation.duration.normal }
) => {
  return Animated.timing(animatedValue, {
    toValue,
    duration: config.duration,
    easing: nativeEasing.easeInOutCubic,
    useNativeDriver: true,
  }).start();
};

// Parallel animation helper
export const runParallel = (animations: Animated.CompositeAnimation[]) => {
  return Animated.parallel(animations).start();
};

// Sequence animation helper
export const runSequence = (animations: Animated.CompositeAnimation[]) => {
  return Animated.sequence(animations).start();
};

// Stagger animation helper
export const runStagger = (delay: number, animations: Animated.CompositeAnimation[]) => {
  return Animated.stagger(delay, animations).start();
};

// Loop animation helper
export const createLoop = (
  animation: Animated.CompositeAnimation,
  config = { iterations: -1 }
) => {
  return Animated.loop(animation, config);
};

// Theme transition helper
export const animateThemeChange = (callback: () => void) => {
  if (Platform.OS === 'ios') {
    LayoutAnimation.configureNext(
      layoutAnimationPresets.fast,
      callback
    );
  } else {
    // Android requires explicit layout animation setup
    LayoutAnimation.configureNext(
      {
        duration: themeSwitchAnimation.duration,
        create: {
          type: LayoutAnimation.Types.easeInEaseOut,
          property: LayoutAnimation.Properties.opacity,
        },
        update: {
          type: LayoutAnimation.Types.easeInEaseOut,
        },
      },
      callback
    );
  }
};

// Interpolation helpers
export const interpolateColor = (
  animatedValue: Animated.Value,
  inputRange: number[],
  outputRange: string[]
) => {
  return animatedValue.interpolate({
    inputRange,
    outputRange,
  });
};

export const interpolateScale = (
  animatedValue: Animated.Value,
  inputRange = [0, 1],
  outputRange = [0.9, 1]
) => {
  return animatedValue.interpolate({
    inputRange,
    outputRange,
  });
};

export const interpolateRotation = (
  animatedValue: Animated.Value,
  inputRange = [0, 1],
  outputRange = ['0deg', '360deg']
) => {
  return animatedValue.interpolate({
    inputRange,
    outputRange,
  });
};

// Gesture response animations
export const createGestureResponse = (
  animatedValue: Animated.Value,
  gestureState: any
) => {
  return Animated.spring(animatedValue, {
    toValue: gestureState.moveX,
    velocity: gestureState.vx,
    useNativeDriver: true,
  });
};

// Accessibility-aware animations
export const shouldReduceMotion = () => {
  // This would connect to the system's reduce motion preference
  // For now, return false, but in production, check accessibility settings
  return false;
};

export const getAccessibleDuration = (baseDuration: number) => {
  if (shouldReduceMotion()) {
    return Math.min(baseDuration * 0.5, 100); // Faster animations when reduced motion
  }
  return baseDuration;
};

export const getAccessibleAnimation = (animationConfig: any) => {
  if (shouldReduceMotion()) {
    return {
      ...animationConfig,
      duration: getAccessibleDuration(animationConfig.duration),
      // Remove spring and bounce effects
      type: LayoutAnimation.Types.easeInEaseOut,
    };
  }
  return animationConfig;
};