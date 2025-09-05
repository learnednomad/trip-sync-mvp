/**
 * Modal exports including bottom sheet implementation and hooks
 */

import {
  BottomSheetModal,
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  type BottomSheetModalProps,
} from '@gorhom/bottom-sheet';
import * as React from 'react';

// Export the MVP Modal for simple cases
export { MVPModal } from './MVPModal';
export type { MVPModalProps } from './MVPModal';

// Export keyboard-aware scroll view
export * from './modal-keyboard-aware-scroll-view';

// Export Modal component based on BottomSheetModal
export const Modal = React.forwardRef<BottomSheetModal, BottomSheetModalProps>(
  ({ children, ...props }, ref) => {
    const renderBackdrop = React.useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
        />
      ),
      []
    );

    return (
      <BottomSheetModal
        ref={ref}
        backdropComponent={renderBackdrop}
        {...props}
      >
        {children}
      </BottomSheetModal>
    );
  }
);

Modal.displayName = 'Modal';

// useModal hook
export function useModal() {
  const ref = React.useRef<BottomSheetModal>(null);

  const present = React.useCallback(() => {
    ref.current?.present();
  }, []);

  const dismiss = React.useCallback(() => {
    ref.current?.dismiss();
  }, []);

  return { ref, present, dismiss };
}