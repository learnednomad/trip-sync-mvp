/**
 * Theme Animation System
 * Animation constants for consistent motion design
 */

import { Easing } from 'react-native';
import { ThemeAnimation } from './types';

// Animation durations
export const animation: ThemeAnimation = {
  duration: {
    fast: 200,    // Quick transitions, hover effects
    normal: 300,  // Standard animations, default
    slow: 500,    // Deliberate animations, modals
  },
  
  easing: {
    // Linear - no acceleration
    linear: 'linear',
    
    // Standard easing curves
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    
    // Spring animation configuration
    spring: {
      damping: 15,
      mass: 1,
      stiffness: 100,
      velocity: 0,
    },
  },
};

// React Native Easing curves
export const nativeEasing = {
  // Standard curves
  linear: Easing.linear,
  easeIn: Easing.ease,
  easeOut: Easing.out(Easing.ease),
  easeInOut: Easing.inOut(Easing.ease),
  
  // Quad curves (accelerating from zero velocity)
  easeInQuad: Easing.quad,
  easeOutQuad: Easing.out(Easing.quad),
  easeInOutQuad: Easing.inOut(Easing.quad),
  
  // Cubic curves (accelerating from zero velocity)
  easeInCubic: Easing.cubic,
  easeOutCubic: Easing.out(Easing.cubic),
  easeInOutCubic: Easing.inOut(Easing.cubic),
  
  // Expo curves (exponential acceleration)
  easeInExpo: Easing.exp,
  easeOutExpo: Easing.out(Easing.exp),
  easeInOutExpo: Easing.inOut(Easing.exp),
  
  // Back curves (overshooting cubic easing)
  easeInBack: Easing.back(1.7),
  easeOutBack: Easing.out(Easing.back(1.7)),
  easeInOutBack: Easing.inOut(Easing.back(1.7)),
  
  // Elastic curves (exponentially decaying sine wave)
  easeInElastic: Easing.elastic(1),
  easeOutElastic: Easing.out(Easing.elastic(1)),
  easeInOutElastic: Easing.inOut(Easing.elastic(1)),
  
  // Bounce curves
  easeInBounce: Easing.bounce,
  easeOutBounce: Easing.out(Easing.bounce),
  easeInOutBounce: Easing.inOut(Easing.bounce),
};

// Reanimated v3 animation configs
export const reanimatedConfigs = {
  // Timing animations
  timing: {
    fast: {
      duration: animation.duration.fast,
      easing: Easing.out(Easing.cubic),
    },
    normal: {
      duration: animation.duration.normal,
      easing: Easing.inOut(Easing.cubic),
    },
    slow: {
      duration: animation.duration.slow,
      easing: Easing.inOut(Easing.cubic),
    },
  },
  
  // Spring animations
  spring: {
    // Snappy spring for quick responses
    snappy: {
      damping: 20,
      stiffness: 300,
      mass: 0.8,
    },
    // Default spring for most animations
    default: {
      damping: 15,
      stiffness: 100,
      mass: 1,
    },
    // Gentle spring for smooth animations
    gentle: {
      damping: 20,
      stiffness: 80,
      mass: 1.2,
    },
    // Bouncy spring for playful animations
    bouncy: {
      damping: 10,
      stiffness: 200,
      mass: 0.8,
    },
  },
};

// Common animation patterns
export const animationPatterns = {
  // Fade animations
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
    duration: animation.duration.fast,
    easing: nativeEasing.easeOut,
  },
  fadeOut: {
    from: { opacity: 1 },
    to: { opacity: 0 },
    duration: animation.duration.fast,
    easing: nativeEasing.easeIn,
  },
  
  // Scale animations
  scaleIn: {
    from: { transform: [{ scale: 0.9 }] },
    to: { transform: [{ scale: 1 }] },
    duration: animation.duration.normal,
    easing: nativeEasing.easeOutBack,
  },
  scaleOut: {
    from: { transform: [{ scale: 1 }] },
    to: { transform: [{ scale: 0.9 }] },
    duration: animation.duration.normal,
    easing: nativeEasing.easeInCubic,
  },
  
  // Slide animations
  slideInUp: {
    from: { transform: [{ translateY: 50 }], opacity: 0 },
    to: { transform: [{ translateY: 0 }], opacity: 1 },
    duration: animation.duration.normal,
    easing: nativeEasing.easeOutCubic,
  },
  slideInDown: {
    from: { transform: [{ translateY: -50 }], opacity: 0 },
    to: { transform: [{ translateY: 0 }], opacity: 1 },
    duration: animation.duration.normal,
    easing: nativeEasing.easeOutCubic,
  },
  slideInLeft: {
    from: { transform: [{ translateX: -50 }], opacity: 0 },
    to: { transform: [{ translateX: 0 }], opacity: 1 },
    duration: animation.duration.normal,
    easing: nativeEasing.easeOutCubic,
  },
  slideInRight: {
    from: { transform: [{ translateX: 50 }], opacity: 0 },
    to: { transform: [{ translateX: 0 }], opacity: 1 },
    duration: animation.duration.normal,
    easing: nativeEasing.easeOutCubic,
  },
  
  // Modal animations
  modalIn: {
    from: { opacity: 0, transform: [{ scale: 0.95 }, { translateY: 10 }] },
    to: { opacity: 1, transform: [{ scale: 1 }, { translateY: 0 }] },
    duration: animation.duration.normal,
    easing: nativeEasing.easeOutCubic,
  },
  modalOut: {
    from: { opacity: 1, transform: [{ scale: 1 }, { translateY: 0 }] },
    to: { opacity: 0, transform: [{ scale: 0.95 }, { translateY: 10 }] },
    duration: animation.duration.fast,
    easing: nativeEasing.easeInCubic,
  },
};

// Animation utility helpers
export const animationHelpers = {
  // Create timing config
  timing: (duration: number = animation.duration.normal, easing = nativeEasing.easeInOutCubic) => ({
    duration,
    easing,
    useNativeDriver: true,
  }),
  
  // Create spring config
  spring: (config = reanimatedConfigs.spring.default) => ({
    ...config,
    useNativeDriver: true,
  }),
  
  // Stagger animations
  stagger: (delay: number = 50, animations: any[]) => {
    return animations.map((anim, index) => ({
      ...anim,
      delay: index * delay,
    }));
  },
  
  // Sequence animations
  sequence: (animations: any[]) => {
    let totalDelay = 0;
    return animations.map((anim) => {
      const animWithDelay = {
        ...anim,
        delay: totalDelay,
      };
      totalDelay += anim.duration || animation.duration.normal;
      return animWithDelay;
    });
  },
};

// Theme switching animation config
export const themeSwitchAnimation = {
  duration: animation.duration.fast,
  easing: nativeEasing.easeInOutCubic,
  useNativeDriver: false, // Color animations can't use native driver
};

// Gesture animation configs
export const gestureAnimations = {
  swipe: {
    duration: animation.duration.fast,
    easing: nativeEasing.easeOutCubic,
  },
  pinch: {
    duration: animation.duration.fast,
    easing: nativeEasing.easeOutCubic,
  },
  rotation: {
    duration: animation.duration.fast,
    easing: nativeEasing.easeOutCubic,
  },
  longPress: {
    duration: animation.duration.slow,
    easing: nativeEasing.easeInOutCubic,
  },
};