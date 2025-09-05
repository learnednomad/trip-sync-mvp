import * as React from 'react';
import type {
  Control,
  FieldValues,
  Path,
  RegisterOptions,
} from 'react-hook-form';
import { useController } from 'react-hook-form';
import type { TextInputProps } from 'react-native';
import { I18nManager, StyleSheet, View, Platform } from 'react-native';
import { TextInput as NTextInput } from 'react-native';
import { tv } from 'tailwind-variants';

import { colors } from '../../core/theme/colors';
import { Text } from './text';

const inputTv = tv({
  slots: {
    container: 'mb-2',
    label: 'mb-1 text-base font-medium',
    input:
      'mt-0 border bg-background-secondary px-4 py-3 text-base font-medium leading-5',
  },

  variants: {
    platform: {
      ios: {
        input: 'rounded-lg border-neutral-300',
      },
      android: {
        input: 'rounded-md border-android-outline',
      },
    },
    focused: {
      true: {
        input: 'border-primary-600',
      },
    },
    error: {
      true: {
        input: 'border-danger-base bg-danger-background',
        label: 'text-danger-base',
      },
    },
    disabled: {
      true: {
        input: 'opacity-50 bg-background-tertiary',
      },
    },
  },
  defaultVariants: {
    platform: Platform.OS as 'ios' | 'android',
    focused: false,
    error: false,
    disabled: false,
  },
});

export interface NInputProps extends TextInputProps {
  label?: string;
  disabled?: boolean;
  error?: string;
}

type TRule<T extends FieldValues> =
  | Omit<
      RegisterOptions<T>,
      'disabled' | 'valueAsNumber' | 'valueAsDate' | 'setValueAs'
    >
  | undefined;

export type RuleType<T extends FieldValues> = { [name in keyof T]: TRule<T> };
export type InputControllerType<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  rules?: RuleType<T>;
};

interface ControlledInputProps<T extends FieldValues>
  extends NInputProps,
    InputControllerType<T> {}

export const Input = React.forwardRef<NTextInput, NInputProps>((props, ref) => {
  const { label, error, testID, ...inputProps } = props;
  const [isFocussed, setIsFocussed] = React.useState(false);
  const onBlur = React.useCallback(() => setIsFocussed(false), []);
  const onFocus = React.useCallback(() => setIsFocussed(true), []);

  const styles = React.useMemo(
    () =>
      inputTv({
        error: Boolean(error),
        focused: isFocussed,
        disabled: Boolean(props.disabled),
      }),
    [error, isFocussed, props.disabled]
  );

  const placeholderColor = React.useMemo(() => {
    if (Platform.OS === 'ios') {
      return colors.ios.systemGray3;
    }
    return colors.android.onSurfaceVariant;
  }, []);

  return (
    <View className={styles.container()}>
      {label && (
        <Text
          testID={testID ? `${testID}-label` : undefined}
          className={styles.label()}
          variant="subheadline"
          accessibilityRole="text"
        >
          {label}
        </Text>
      )}
      <NTextInput
        testID={testID}
        ref={ref}
        placeholderTextColor={placeholderColor}
        className={styles.input()}
        onBlur={onBlur}
        onFocus={onFocus}
        accessibilityLabel={label}
        accessibilityHint={props.placeholder}
        accessibilityState={{
          disabled: props.disabled,
        }}
        accessibilityValue={{
          text: props.value,
        }}
        {...inputProps}
        style={StyleSheet.flatten([
          { writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr' },
          { textAlign: I18nManager.isRTL ? 'right' : 'left' },
          inputProps.style,
        ])}
      />
      {error && (
        <Text
          testID={testID ? `${testID}-error` : undefined}
          className="mt-1 text-sm"
          color="danger"
          accessibilityRole="alert"
        >
          {error}
        </Text>
      )}
    </View>
  );
});

Input.displayName = 'Input';

// only used with react-hook-form
export function ControlledInput<T extends FieldValues>(
  props: ControlledInputProps<T>
) {
  const { name, control, rules, ...inputProps } = props;

  const { field, fieldState } = useController({ control, name, rules });
  return (
    <Input
      ref={field.ref}
      autoCapitalize="none"
      onChangeText={field.onChange}
      value={(field.value as string) || ''}
      {...inputProps}
      error={fieldState.error?.message}
    />
  );
}
