import React from 'react';
import type { PressableProps, View } from 'react-native';
import { ActivityIndicator, Pressable, Text } from 'react-native';
import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

/**
 * Legacy Button Component
 * @deprecated Use PlatformButton for new features
 * This component is maintained for backward compatibility only
 */
const button = tv({
  slots: {
    container: 'my-2 flex flex-row items-center justify-center rounded-md px-4',
    label: 'text-base font-semibold',
    indicator: 'h-6',
  },

  variants: {
    variant: {
      default: {
        container: 'bg-primary-600',
        label: 'text-white',
        indicator: 'text-white',
      },
      secondary: {
        container: 'bg-neutral-900',
        label: 'text-white',
        indicator: 'text-white',
      },
      outline: {
        container: 'border border-neutral-400 bg-transparent',
        label: 'text-text-primary',
        indicator: 'text-text-primary',
      },
      destructive: {
        container: 'bg-danger-base',
        label: 'text-white',
        indicator: 'text-white',
      },
      ghost: {
        container: 'bg-transparent',
        label: 'text-text-primary underline',
        indicator: 'text-text-primary',
      },
      link: {
        container: 'bg-transparent',
        label: 'text-primary-600',
        indicator: 'text-primary-600',
      },
    },
    size: {
      default: {
        container: 'h-10 px-4',
        label: 'text-base',
      },
      lg: {
        container: 'h-12 px-8',
        label: 'text-xl',
      },
      sm: {
        container: 'h-8 px-3',
        label: 'text-sm',
        indicator: 'h-4',
      },
      icon: { container: 'size-9' },
    },
    disabled: {
      true: {
        container: 'opacity-50',
        label: 'text-text-tertiary',
        indicator: 'text-text-tertiary',
      },
    },
    fullWidth: {
      true: {
        container: 'w-full',
      },
      false: {
        container: 'self-center',
      },
    },
  },
  defaultVariants: {
    variant: 'default',
    disabled: false,
    fullWidth: true,
    size: 'default',
  },
});

type ButtonVariants = VariantProps<typeof button>;

interface Props extends ButtonVariants, Omit<PressableProps, 'disabled'> {
  label?: string;
  loading?: boolean;
  className?: string;
  textClassName?: string;
}

/**
 * @deprecated Use PlatformButton component instead for new features
 * This component will be removed in v2.0
 */
export const Button = React.forwardRef<View, Props>(
  (
    {
      label: text,
      loading = false,
      variant = 'default',
      disabled = false,
      size = 'default',
      fullWidth = true,
      className = '',
      testID,
      textClassName = '',
      ...props
    },
    ref
  ) => {
    const styles = React.useMemo(
      () => button({ variant, disabled, size, fullWidth }),
      [variant, disabled, size, fullWidth]
    );

    // Log deprecation warning in development
    if (__DEV__) {
      console.warn(
        'Button component is deprecated. Please use PlatformButton for new features.'
      );
    }

    return (
      <Pressable
        disabled={disabled || loading}
        className={styles.container({ className })}
        accessibilityRole="button"
        accessibilityState={{ disabled: disabled || loading }}
        {...props}
        ref={ref}
        testID={testID}
      >
        {props.children ? (
          props.children
        ) : (
          <>
            {loading ? (
              <ActivityIndicator
                size="small"
                className={styles.indicator()}
                testID={testID ? `${testID}-activity-indicator` : undefined}
                accessibilityLabel="Loading"
              />
            ) : (
              <Text
                testID={testID ? `${testID}-label` : undefined}
                className={styles.label({ className: textClassName })}
                accessibilityRole="text"
              >
                {text}
              </Text>
            )}
          </>
        )}
      </Pressable>
    );
  }
);

Button.displayName = 'Button';
