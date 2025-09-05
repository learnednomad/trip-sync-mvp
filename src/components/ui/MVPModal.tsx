/**
 * MVP Modal Component
 * Simple center overlay modal with dark background
 */

import React from 'react';
import { Modal as RNModal, View, Pressable } from 'react-native';
import type { ModalProps as RNModalProps } from 'react-native';
import { useTheme } from '@/theme/mvp';

interface MVPModalProps extends Omit<RNModalProps, 'transparent' | 'animationType'> {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const MVPModal: React.FC<MVPModalProps> = ({
  visible,
  onClose,
  children,
  ...props
}) => {
  const { theme } = useTheme();

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
      accessibilityViewIsModal
      accessibilityLiveRegion="polite"
      {...props}
    >
      <Pressable
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel="Close modal backdrop"
        accessibilityHint="Tap to close the modal"
      >
        <Pressable
          style={{
            backgroundColor: theme.colors.surface,
            borderRadius: 12,
            padding: 20,
            marginHorizontal: 20,
            minWidth: 280,
            maxWidth: '90%',
          }}
          onPress={(e) => e.stopPropagation()}
          accessibilityRole="alert"
          accessibilityLabel="Modal dialog"
          importantForAccessibility="yes"
        >
          {children}
        </Pressable>
      </Pressable>
    </RNModal>
  );
};