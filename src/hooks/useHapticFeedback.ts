/**
 * useHapticFeedback Hook
 * Provides platform-specific haptic feedback
 */

import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export type HapticFeedbackType =
  // iOS specific
  | 'selection'
  | 'impactLight'
  | 'impactMedium'
  | 'impactHeavy'
  | 'notificationSuccess'
  | 'notificationWarning'
  | 'notificationError'
  // Cross-platform
  | 'click'
  | 'longPress'
  | 'disabled';

export function useHapticFeedback() {
  const trigger = async (type: HapticFeedbackType) => {
    // Skip haptics if not available
    if (!Haptics) return;

    try {
      if (Platform.OS === 'ios') {
        // iOS haptic feedback
        switch (type) {
          case 'selection':
          case 'click':
            await Haptics.selectionAsync();
            break;

          case 'impactLight':
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            break;

          case 'impactMedium':
          case 'longPress':
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            break;

          case 'impactHeavy':
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            break;

          case 'notificationSuccess':
            await Haptics.notificationAsync(
              Haptics.NotificationFeedbackType.Success
            );
            break;

          case 'notificationWarning':
            await Haptics.notificationAsync(
              Haptics.NotificationFeedbackType.Warning
            );
            break;

          case 'notificationError':
          case 'disabled':
            await Haptics.notificationAsync(
              Haptics.NotificationFeedbackType.Error
            );
            break;

          default:
            await Haptics.selectionAsync();
        }
      } else {
        // Android haptic feedback
        switch (type) {
          case 'selection':
          case 'click':
          case 'impactLight':
            // Light haptic feedback
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            break;

          case 'impactMedium':
          case 'longPress':
          case 'notificationSuccess':
          case 'notificationWarning':
            // Medium haptic feedback
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            break;

          case 'impactHeavy':
          case 'notificationError':
          case 'disabled':
            // Heavy haptic feedback
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            break;

          default:
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      }
    } catch (error) {
      // Silently fail if haptics are not available
      console.debug('Haptic feedback failed:', error);
    }
  };

  return { trigger };
}
