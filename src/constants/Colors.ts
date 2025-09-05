/**
 * Color Constants
 * Legacy color system - migrating to theme token system
 * @deprecated Use theme color system instead
 */

import { lightColors, darkColors } from '../theme/colors';

const tintColorLight = lightColors.primary[500];
const tintColorDark = lightColors.primary[400];

// Legacy color export for backward compatibility
export default {
  light: {
    text: lightColors.content.primary,
    background: lightColors.background.primary,
    tint: tintColorLight,
    tabIconDefault: lightColors.content.tertiary,
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: darkColors.content.primary,
    background: darkColors.background.primary,
    tint: tintColorDark,
    tabIconDefault: darkColors.content.tertiary,
    tabIconSelected: tintColorDark,
  },
};

// Export new theme colors for gradual migration
export { lightColors, darkColors, getThemeColors } from '../theme/colors';