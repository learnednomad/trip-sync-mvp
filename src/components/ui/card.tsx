import React from 'react';
import { View, Pressable, Platform, type ViewProps, type PressableProps } from 'react-native';
import { tv } from 'tailwind-variants';
import { getElevation, getBorderRadius } from '../../core/theme/tokens';

const cardTv = tv({
  slots: {
    container: 'bg-background-primary overflow-hidden',
    content: 'p-4',
  },
  variants: {
    variant: {
      elevated: {
        container: 'bg-background-elevated',
      },
      filled: {
        container: 'bg-background-secondary',
      },
      outlined: {
        container: 'border border-ios-systemGray5',
      },
    },
    size: {
      sm: {
        content: 'p-3',
      },
      md: {
        content: 'p-4',
      },
      lg: {
        content: 'p-6',
      },
    },
    pressable: {
      true: {},
      false: {},
    },
  },
  defaultVariants: {
    variant: 'elevated',
    size: 'md',
    pressable: false,
  },
});

type CardVariant = 'elevated' | 'filled' | 'outlined';
type CardSize = 'sm' | 'md' | 'lg';

interface CardProps extends ViewProps {
  variant?: CardVariant;
  size?: CardSize;
  children: React.ReactNode;
  className?: string;
}

interface PressableCardProps extends Omit<PressableProps, 'style'>, Omit<CardProps, 'style'> {
  onPress: () => void;
}

export const Card = ({ 
  variant = 'elevated', 
  size = 'md', 
  children, 
  className,
  style,
  ...props 
}: CardProps) => {
  const styles = React.useMemo(
    () => cardTv({ variant, size, pressable: false }),
    [variant, size]
  );

  const containerStyle = React.useMemo(() => {
    const baseStyle: any = {
      borderRadius: getBorderRadius('card'),
    };

    if (variant === 'elevated') {
      Object.assign(baseStyle, getElevation(Platform.OS === 'ios' ? 2 : 4));
    }

    return [baseStyle, style];
  }, [variant, style]);

  return (
    <View 
      className={styles.container({ className })} 
      style={containerStyle}
      accessibilityRole="none"
      {...props}
    >
      <View className={styles.content()}>
        {children}
      </View>
    </View>
  );
};

export const PressableCard = ({ 
  variant = 'elevated', 
  size = 'md', 
  children, 
  className,
  onPress,
  disabled,
  ...props 
}: PressableCardProps) => {
  const styles = React.useMemo(
    () => cardTv({ variant, size, pressable: true }),
    [variant, size]
  );

  const containerStyle = React.useMemo(() => {
    const baseStyle: any = {
      borderRadius: getBorderRadius('card'),
    };

    if (variant === 'elevated') {
      Object.assign(baseStyle, getElevation(Platform.OS === 'ios' ? 2 : 4));
    }

    return baseStyle;
  }, [variant]);

  return (
    <Pressable 
      onPress={onPress}
      disabled={disabled}
      className={styles.container({ className })} 
      style={({ pressed }) => [
        containerStyle,
        pressed && { opacity: 0.8 },
      ]}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      {...props}
    >
      <View className={styles.content()}>
        {children}
      </View>
    </Pressable>
  );
};

Card.displayName = 'Card';
PressableCard.displayName = 'PressableCard';