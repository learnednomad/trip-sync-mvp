/**
 * Button Component Tests
 * Tests for MVP Button with primary style, loading and disabled states
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from './Button';
import { ThemeProvider } from '@/theme/mvp';

// Test wrapper with theme
const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
};

describe('Button Component', () => {
  it('renders correctly with text', () => {
    const { getByText } = renderWithTheme(
      <Button onPress={() => {}}>Click Me</Button>
    );
    expect(getByText('Click Me')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = renderWithTheme(
      <Button onPress={onPress}>Click Me</Button>
    );
    
    fireEvent.press(getByText('Click Me'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('shows loading indicator when loading', () => {
    const { queryByText, getByLabelText } = renderWithTheme(
      <Button onPress={() => {}} loading>
        Click Me
      </Button>
    );
    
    expect(queryByText('Click Me')).toBeNull();
    expect(getByLabelText('Loading')).toBeTruthy();
  });

  it('is disabled when disabled prop is true', () => {
    const onPress = jest.fn();
    const { getByText, getByRole } = renderWithTheme(
      <Button onPress={onPress} disabled>
        Click Me
      </Button>
    );
    
    const button = getByRole('button');
    expect(button.props.accessibilityState.disabled).toBe(true);
    
    fireEvent.press(getByText('Click Me'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('is disabled when loading', () => {
    const onPress = jest.fn();
    const { getByRole } = renderWithTheme(
      <Button onPress={onPress} loading>
        Click Me
      </Button>
    );
    
    const button = getByRole('button');
    expect(button.props.accessibilityState.disabled).toBe(true);
  });

  it('applies theme colors', () => {
    const { getByRole } = renderWithTheme(
      <Button onPress={() => {}}>Click Me</Button>
    );
    
    const button = getByRole('button');
    expect(button.props.style[0].backgroundColor).toBe('#007AFF'); // Light theme primary
  });
});