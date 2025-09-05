/**
 * Animation System Tests
 */

import { Easing } from 'react-native';
import {
  animation,
  nativeEasing,
  reanimatedConfigs,
  animationPatterns,
  animationHelpers,
  themeSwitchAnimation,
  gestureAnimations,
} from '../animations';

describe('Animation System', () => {
  describe('Animation Durations', () => {
    it('should have three standard durations', () => {
      expect(animation.duration.fast).toBe(200);
      expect(animation.duration.normal).toBe(300);
      expect(animation.duration.slow).toBe(500);
    });

    it('should have progressive duration values', () => {
      expect(animation.duration.fast).toBeLessThan(animation.duration.normal);
      expect(animation.duration.normal).toBeLessThan(animation.duration.slow);
    });
  });

  describe('Easing Functions', () => {
    it('should have basic easing strings', () => {
      expect(animation.easing.linear).toBe('linear');
      expect(animation.easing.easeIn).toBe('ease-in');
      expect(animation.easing.easeOut).toBe('ease-out');
      expect(animation.easing.easeInOut).toBe('ease-in-out');
    });

    it('should have spring configuration', () => {
      const spring = animation.easing.spring;
      expect(spring).toHaveProperty('damping');
      expect(spring).toHaveProperty('mass');
      expect(spring).toHaveProperty('stiffness');
      expect(spring).toHaveProperty('velocity');
    });
  });

  describe('Native Easing', () => {
    it('should have React Native easing functions', () => {
      expect(typeof nativeEasing.linear).toBe('function');
      expect(typeof nativeEasing.easeIn).toBe('function');
      expect(typeof nativeEasing.easeOut).toBe('function');
    });

    it('should have advanced easing curves', () => {
      expect(nativeEasing).toHaveProperty('easeInQuad');
      expect(nativeEasing).toHaveProperty('easeInCubic');
      expect(nativeEasing).toHaveProperty('easeInExpo');
      expect(nativeEasing).toHaveProperty('easeInBack');
      expect(nativeEasing).toHaveProperty('easeInElastic');
      expect(nativeEasing).toHaveProperty('easeInBounce');
    });
  });

  describe('Reanimated Configs', () => {
    it('should have timing configurations', () => {
      expect(reanimatedConfigs.timing.fast.duration).toBe(200);
      expect(reanimatedConfigs.timing.normal.duration).toBe(300);
      expect(reanimatedConfigs.timing.slow.duration).toBe(500);
    });

    it('should have spring presets', () => {
      expect(reanimatedConfigs.spring).toHaveProperty('snappy');
      expect(reanimatedConfigs.spring).toHaveProperty('default');
      expect(reanimatedConfigs.spring).toHaveProperty('gentle');
      expect(reanimatedConfigs.spring).toHaveProperty('bouncy');
    });

    it('should have different spring characteristics', () => {
      const { snappy, gentle, bouncy } = reanimatedConfigs.spring;
      
      // Snappy should be stiffer
      expect(snappy.stiffness).toBeGreaterThan(gentle.stiffness);
      
      // Bouncy should have less damping
      expect(bouncy.damping).toBeLessThan(gentle.damping);
    });
  });

  describe('Animation Patterns', () => {
    it('should have fade animations', () => {
      expect(animationPatterns).toHaveProperty('fadeIn');
      expect(animationPatterns).toHaveProperty('fadeOut');
      
      expect(animationPatterns.fadeIn.from.opacity).toBe(0);
      expect(animationPatterns.fadeIn.to.opacity).toBe(1);
      expect(animationPatterns.fadeOut.from.opacity).toBe(1);
      expect(animationPatterns.fadeOut.to.opacity).toBe(0);
    });

    it('should have scale animations', () => {
      expect(animationPatterns).toHaveProperty('scaleIn');
      expect(animationPatterns).toHaveProperty('scaleOut');
      
      const scaleIn = animationPatterns.scaleIn;
      expect(scaleIn.from.transform[0].scale).toBeLessThan(1);
      expect(scaleIn.to.transform[0].scale).toBe(1);
    });

    it('should have slide animations', () => {
      expect(animationPatterns).toHaveProperty('slideInUp');
      expect(animationPatterns).toHaveProperty('slideInDown');
      expect(animationPatterns).toHaveProperty('slideInLeft');
      expect(animationPatterns).toHaveProperty('slideInRight');
    });

    it('should have modal animations', () => {
      expect(animationPatterns).toHaveProperty('modalIn');
      expect(animationPatterns).toHaveProperty('modalOut');
      
      const modalIn = animationPatterns.modalIn;
      expect(modalIn.from.opacity).toBe(0);
      expect(modalIn.to.opacity).toBe(1);
      expect(modalIn.duration).toBe(animation.duration.normal);
    });
  });

  describe('Animation Helpers', () => {
    it('should create timing config', () => {
      const timing = animationHelpers.timing();
      expect(timing).toHaveProperty('duration', animation.duration.normal);
      expect(timing).toHaveProperty('easing');
      expect(timing).toHaveProperty('useNativeDriver', true);
    });

    it('should create spring config', () => {
      const spring = animationHelpers.spring();
      expect(spring).toHaveProperty('damping');
      expect(spring).toHaveProperty('stiffness');
      expect(spring).toHaveProperty('useNativeDriver', true);
    });

    it('should stagger animations', () => {
      const animations = [
        { duration: 100 },
        { duration: 100 },
        { duration: 100 },
      ];
      
      const staggered = animationHelpers.stagger(50, animations);
      expect(staggered[0].delay).toBe(0);
      expect(staggered[1].delay).toBe(50);
      expect(staggered[2].delay).toBe(100);
    });

    it('should sequence animations', () => {
      const animations = [
        { duration: 100 },
        { duration: 200 },
        { duration: 150 },
      ];
      
      const sequenced = animationHelpers.sequence(animations);
      expect(sequenced[0].delay).toBe(0);
      expect(sequenced[1].delay).toBe(100);
      expect(sequenced[2].delay).toBe(300);
    });
  });

  describe('Theme Switch Animation', () => {
    it('should have fast duration', () => {
      expect(themeSwitchAnimation.duration).toBe(animation.duration.fast);
    });

    it('should not use native driver for color animations', () => {
      expect(themeSwitchAnimation.useNativeDriver).toBe(false);
    });
  });

  describe('Gesture Animations', () => {
    it('should have gesture-specific configs', () => {
      expect(gestureAnimations).toHaveProperty('swipe');
      expect(gestureAnimations).toHaveProperty('pinch');
      expect(gestureAnimations).toHaveProperty('rotation');
      expect(gestureAnimations).toHaveProperty('longPress');
    });

    it('should have appropriate durations for gestures', () => {
      expect(gestureAnimations.swipe.duration).toBe(animation.duration.fast);
      expect(gestureAnimations.longPress.duration).toBe(animation.duration.slow);
    });
  });
});