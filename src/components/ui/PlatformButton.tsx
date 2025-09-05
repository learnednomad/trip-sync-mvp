import React from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  Text,
  View,
  type PressableProps,
} from 'react-native';
import { tv, type VariantProps } from 'tailwind-variants';
import { colors, getPlatformColor } from '../../core/theme/colors';
import { typography, getTypographyStyle } from '../../core/theme/typography';
import { getBorderRadius, getElevation, animation } from '../../core/theme/tokens';

// Platform-specific button variants
const platformButton = tv({
  slots: {
    container: 'flex flex-row items-center justify-center px-4',
    label: 'font-semibold text-center',
    indicator: 'text-white',
  },

  variants: {
    variant: {
      // iOS variants
      iosPrimary: {
        container: 'bg-blue-500',
        label: 'text-white',
        indicator: 'text-white',
      },
      iosSecondary: {
        container: 'bg-gray-200 dark:bg-gray-700',
        label: 'text-blue-500',
        indicator: 'text-blue-500',
      },
      iosPlain: {
        container: 'bg-transparent',
        label: 'text-blue-500',
        indicator: 'text-blue-500',
      },
      iosDestructive: {
        container: 'bg-transparent',
        label: 'text-red-500',
        indicator: 'text-red-500',
      },
      // Android Material variants
      androidFilled: {
        container: 'bg-purple-600',
        label: 'text-white',
        indicator: 'text-white',
      },
      androidOutlined: {
        container: 'border-2 border-purple-600 bg-transparent',
        label: 'text-purple-600',
        indicator: 'text-purple-600',
      },
      androidText: {
        container: 'bg-transparent',
        label: 'text-purple-600',
        indicator: 'text-purple-600',
      },
      androidElevated: {
        container: 'bg-purple-50',
        label: 'text-purple-600',
        indicator: 'text-purple-600',
      },
      androidTonal: {
        container: 'bg-purple-100',
        label: 'text-purple-900',
        indicator: 'text-purple-900',
      },
    },
    size: {
      sm: {
        container: Platform.OS === 'ios' ? 'h-8' : 'h-9',
        label: Platform.OS === 'ios' ? 'text-sm' : 'text-sm',
      },
      md: {
        container: Platform.OS === 'ios' ? 'h-11' : 'h-10',
        label: Platform.OS === 'ios' ? 'text-base' : 'text-sm',
      },
      lg: {
        container: Platform.OS === 'ios' ? 'h-12' : 'h-14',
        label: Platform.OS === 'ios' ? 'text-lg' : 'text-base',
      },
    },
    fullWidth: {
      true: { container: 'w-full' },
      false: { container: 'self-center' },
    },
    disabled: {
      true: {
        container: 'opacity-50',
      },
    },
  },
  defaultVariants: {
    size: 'md',
    fullWidth: false,
    disabled: false,
  },
});

type PlatformButtonVariants = VariantProps<typeof platformButton>;

interface PlatformButtonProps
  extends Omit<PressableProps, 'disabled' | 'style'>,
    PlatformButtonVariants {
  children?: React.ReactNode;
  label?: string;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'plain' | 'destructive' | 'filled' | 'outlined' | 'text' | 'elevated' | 'tonal';
  onPress?: () => void;
}

export const PlatformButton = React.forwardRef<View, PlatformButtonProps>(
  (
    {
      children,
      label,
      loading = false,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      disabled = false,
      onPress,
      ...props
    },
    ref
  ) => {
    // Map generic variants to platform-specific variants
    const getPlatformVariant = () => {
      if (Platform.OS === 'ios') {
        switch (variant) {
          case 'primary':
          case 'filled':
            return 'iosPrimary';
          case 'secondary':
          case 'outlined':
            return 'iosSecondary';
          case 'plain':
          case 'text':
            return 'iosPlain';
          case 'destructive':
            return 'iosDestructive';
          default:
            return 'iosPrimary';
        }
      } else {
        switch (variant) {
          case 'primary':
          case 'filled':
            return 'androidFilled';
          case 'secondary':
          case 'outlined':
            return 'androidOutlined';
          case 'plain':
          case 'text':
            return 'androidText';
          case 'elevated':
            return 'androidElevated';
          case 'tonal':
            return 'androidTonal';
          default:
            return 'androidFilled';
        }
      }
    };

    const platformVariant = getPlatformVariant();
    const styles = React.useMemo(
      () => platformButton({ variant: platformVariant, size, fullWidth, disabled }),
      [platformVariant, size, fullWidth, disabled]
    );

    // Platform-specific styling
    const containerStyle = React.useMemo(() => {
      const baseStyle: any = {
        borderRadius: getBorderRadius('button'),
        ...styles.container(),
      };

      // Add platform-specific shadows/elevation
      if (Platform.OS === 'android' && (platformVariant === 'androidFilled' || platformVariant === 'androidElevated')) {
        Object.assign(baseStyle, getElevation(2));
      }

      return baseStyle;
    }, [styles, platformVariant]);

    const labelStyle = React.useMemo(() => {
      const baseTypography = Platform.OS === 'ios' 
        ? getTypographyStyle('headline')
        : getTypographyStyle('labelLarge');
      
      return {
        ...baseTypography,
        ...styles.label(),
      };
    }, [styles]);

    return (
      <Pressable
        ref={ref}
        disabled={disabled || loading}
        onPress={onPress}
        style={({ pressed }) => [
          containerStyle,
          pressed && { opacity: 0.8 },
        ]}
        {...props}
      >
        {loading ? (
          <ActivityIndicator
            size="small"
            color={styles.indicator().color}
            style={{ height: 20 }}
          />
        ) : children ? (
          children
        ) : (
          <Text style={labelStyle}>{label}</Text>
        )}
      </Pressable>
    );
  }
);

PlatformButton.displayName = 'PlatformButton';