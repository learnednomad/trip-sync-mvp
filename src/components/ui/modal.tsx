import React from 'react';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  type BottomSheetModalProps,
} from '@gorhom/bottom-sheet';

// Hook to control BottomSheetModal via ref
export function useModal() {
  const ref = React.useRef<BottomSheetModal>(null);
  const present = React.useCallback(() => ref.current?.present(), []);
  const dismiss = React.useCallback(() => ref.current?.dismiss(), []);
  return { ref, present, dismiss } as const;
}

// Lightweight wrapper over BottomSheetModal with backdrop
export const Modal = React.forwardRef<BottomSheetModal, BottomSheetModalProps>(
  ({ children, ...props }, ref) => {
    const renderBackdrop = React.useCallback(
      (backdropProps) => (
        <BottomSheetBackdrop
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          pressBehavior="close"
          {...backdropProps}
        />
      ),
      []
    );

    return (
      <BottomSheetModal
        ref={ref}
        backdropComponent={renderBackdrop}
        enablePanDownToClose
        {...props}
      >
        {children}
      </BottomSheetModal>
    );
  }
);

Modal.displayName = 'Modal';
