/**
 * Modal Component Tests
 * Tests for MVP Modal with center overlay and backdrop
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';
import { Modal } from './Modal';
import { ThemeProvider } from '@/theme/mvp';

// Test wrapper with theme
const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
};

describe('Modal Component', () => {
  it('renders children when visible', () => {
    const { getByText } = renderWithTheme(
      <Modal visible onClose={() => {}}>
        <Text>Modal Content</Text>
      </Modal>
    );
    expect(getByText('Modal Content')).toBeTruthy();
  });

  it('does not render when not visible', () => {
    const { queryByText } = renderWithTheme(
      <Modal visible={false} onClose={() => {}}>
        <Text>Modal Content</Text>
      </Modal>
    );
    expect(queryByText('Modal Content')).toBeNull();
  });

  it('calls onClose when backdrop is pressed', () => {
    const onClose = jest.fn();
    const { getByLabelText } = renderWithTheme(
      <Modal visible onClose={onClose}>
        <Text>Modal Content</Text>
      </Modal>
    );
    
    fireEvent.press(getByLabelText('Close modal'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not close when modal content is pressed', () => {
    const onClose = jest.fn();
    const { getByText } = renderWithTheme(
      <Modal visible onClose={onClose}>
        <Text>Modal Content</Text>
      </Modal>
    );
    
    fireEvent.press(getByText('Modal Content'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('has dark background overlay', () => {
    const { getByLabelText } = renderWithTheme(
      <Modal visible onClose={() => {}}>
        <Text>Content</Text>
      </Modal>
    );
    
    const backdrop = getByLabelText('Close modal');
    expect(backdrop.props.style.backgroundColor).toBe('rgba(0, 0, 0, 0.5)');
  });

  it('centers content', () => {
    const { getByLabelText } = renderWithTheme(
      <Modal visible onClose={() => {}}>
        <Text>Content</Text>
      </Modal>
    );
    
    const backdrop = getByLabelText('Close modal');
    expect(backdrop.props.style.justifyContent).toBe('center');
    expect(backdrop.props.style.alignItems).toBe('center');
  });

  it('uses surface color for modal content', () => {
    const { getByRole } = renderWithTheme(
      <Modal visible onClose={() => {}}>
        <Text>Content</Text>
      </Modal>
    );
    
    const dialog = getByRole('dialog');
    expect(dialog.props.style.backgroundColor).toBe('#FFFFFF'); // Light theme surface
  });

  it('has proper accessibility attributes', () => {
    const { getByRole } = renderWithTheme(
      <Modal visible onClose={() => {}}>
        <Text>Content</Text>
      </Modal>
    );
    
    const dialog = getByRole('dialog');
    expect(dialog.props.accessibilityModal).toBe(true);
  });
});