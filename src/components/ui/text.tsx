import React from 'react';
import type { TextProps as RNTextProps, TextStyle } from 'react-native';
import { I18nManager, StyleSheet, Text as NNText, Platform } from 'react-native';
import { twMerge } from 'tailwind-merge';

import type { TxKeyPath } from '@/lib/i18n';
import { translate } from '@/lib/i18n';
import { typography, getTypographyStyle } from '../../core/theme/typography';
import type { IOSTypographyKey, AndroidTypographyKey } from '../../core/theme/typography';

type TypographyVariant = IOSTypographyKey | AndroidTypographyKey | 'body' | 'headline' | 'caption';

interface Props extends RNTextProps {
  className?: string;
  tx?: TxKeyPath;
  variant?: TypographyVariant;
  color?: 'primary' | 'secondary' | 'tertiary' | 'quaternary' | 'danger' | 'success' | 'warning' | 'info';
  children?: React.ReactNode;
}

export const Text = ({
  className = '',
  style,
  tx,
  children,
  variant = 'body',
  color = 'primary',
  accessibilityRole = 'text',
  ...props
}: Props) => {
  // Map cross-platform variants to platform-specific ones
  const getPlatformVariant = (): string => {
    if (Platform.OS === 'ios') {
      switch (variant) {
        case 'body':
        case 'bodyMedium':
        case 'bodyLarge':
          return 'body';
        case 'headline':
        case 'headlineMedium':
        case 'headlineLarge':
          return 'headline';
        case 'caption':
        case 'caption1':
        case 'labelSmall':
          return 'caption1';
        default:
          return variant in typography ? variant : 'body';
      }
    } else {
      switch (variant) {
        case 'body':
        case 'body':
          return 'bodyMedium';
        case 'headline':
          return 'headlineMedium';
        case 'caption':
        case 'caption1':
          return 'labelSmall';
        default:
          return variant in typography ? variant : 'bodyMedium';
      }
    }
  };

  const colorClasses = {
    primary: 'text-text-primary',
    secondary: 'text-text-secondary',
    tertiary: 'text-text-tertiary',
    quaternary: 'text-text-quaternary',
    danger: 'text-danger-base',
    success: 'text-success-base',
    warning: 'text-warning-base',
    info: 'text-info-base',
  };

  const textStyle = React.useMemo(
    () => twMerge(colorClasses[color], className),
    [className, color]
  );

  const typographyStyle = React.useMemo(() => {
    const platformVariant = getPlatformVariant();
    return getTypographyStyle(platformVariant);
  }, [variant]);

  const nStyle = React.useMemo(
    () =>
      StyleSheet.flatten([
        typographyStyle,
        {
          writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
        },
        style,
      ]) as TextStyle,
    [style, typographyStyle]
  );

  return (
    <NNText 
      className={textStyle} 
      style={nStyle} 
      accessibilityRole={accessibilityRole}
      {...props}
    >
      {tx ? translate(tx) : children}
    </NNText>
  );
};

Text.displayName = 'Text';