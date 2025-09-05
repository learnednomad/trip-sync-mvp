/**
 * Layout Constants
 * Migrated to new theme system
 * @deprecated Use theme spacing system instead
 */

import { Dimensions } from 'react-native';
import { spacing, spacingCombinations } from '../theme/spacing';

const { width, height } = Dimensions.get('window');

export default {
  window: {
    width,
    height,
  },
  isSmallDevice: width < 375,
  // Legacy spacing - mapped to new theme spacing
  spacing: {
    xs: spacing[0.5], // 4px
    sm: spacing[1],   // 8px
    md: spacing[2],   // 16px
    lg: spacing[3],   // 24px
    xl: spacing[4],   // 32px
  },
  // New spacing references
  ...spacingCombinations,
};

// Export new spacing system for gradual migration
export { spacing, getSpacing, createSpacing, spacingUtilities } from '../theme/spacing';