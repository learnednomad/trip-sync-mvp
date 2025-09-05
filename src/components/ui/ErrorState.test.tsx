/**
 * ErrorState Component Tests
 * Tests for MVP ErrorState with message and retry functionality
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ErrorState } from './ErrorState';
import { ThemeProvider } from '@/theme/mvp';

// Test wrapper with theme
const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
};

describe('ErrorState Component', () => {
  it('displays error message', () => {
    const { getByText } = renderWithTheme(
      <ErrorState message="Something went wrong" />
    );
    expect(getByText('Something went wrong')).toBeTruthy();
  });

  it('displays error icon', () => {
    const { getByLabelText } = renderWithTheme(
      <ErrorState message="Error occurred" />
    );
    expect(getByLabelText('Error icon')).toBeTruthy();
  });

  it('shows retry button when onRetry is provided', () => {
    const onRetry = jest.fn();
    const { getByText } = renderWithTheme(
      <ErrorState message="Error" onRetry={onRetry} />
    );
    expect(getByText('Try Again')).toBeTruthy();
  });

  it('does not show retry button when onRetry is not provided', () => {
    const { queryByText } = renderWithTheme(
      <ErrorState message="Error" />
    );
    expect(queryByText('Try Again')).toBeNull();
  });

  it('calls onRetry when retry button is pressed', () => {
    const onRetry = jest.fn();
    const { getByText } = renderWithTheme(
      <ErrorState message="Error" onRetry={onRetry} />
    );
    
    fireEvent.press(getByText('Try Again'));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('uses error color for icon', () => {
    const { getByLabelText } = renderWithTheme(
      <ErrorState message="Error" />
    );
    
    const icon = getByLabelText('Error icon');
    expect(icon.props.style.color).toBe('#FF3B30'); // Light theme error color
  });

  it('has alert accessibility role', () => {
    const { getByRole } = renderWithTheme(
      <ErrorState message="Error" />
    );
    
    expect(getByRole('alert')).toBeTruthy();
  });

  it('centers content', () => {
    const { getByRole } = renderWithTheme(
      <ErrorState message="Error" />
    );
    
    const container = getByRole('alert');
    expect(container.props.style.alignItems).toBe('center');
    expect(container.props.style.justifyContent).toBe('center');
  });
});