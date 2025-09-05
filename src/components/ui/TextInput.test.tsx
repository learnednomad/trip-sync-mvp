/**
 * TextInput Component Tests
 * Tests for MVP TextInput with basic functionality and error state
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { TextInput } from './TextInput';
import { ThemeProvider } from '@/theme/mvp';

// Test wrapper with theme
const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
};

describe('TextInput Component', () => {
  it('renders correctly with placeholder', () => {
    const { getByPlaceholderText } = renderWithTheme(
      <TextInput
        placeholder="Enter text"
        value=""
        onChangeText={() => {}}
      />
    );
    expect(getByPlaceholderText('Enter text')).toBeTruthy();
  });

  it('displays value correctly', () => {
    const { getByDisplayValue } = renderWithTheme(
      <TextInput
        placeholder="Enter text"
        value="Test Value"
        onChangeText={() => {}}
      />
    );
    expect(getByDisplayValue('Test Value')).toBeTruthy();
  });

  it('calls onChangeText when text changes', () => {
    const onChangeText = jest.fn();
    const { getByPlaceholderText } = renderWithTheme(
      <TextInput
        placeholder="Enter text"
        value=""
        onChangeText={onChangeText}
      />
    );
    
    fireEvent.changeText(getByPlaceholderText('Enter text'), 'New Text');
    expect(onChangeText).toHaveBeenCalledWith('New Text');
  });

  it('displays error message when error prop is provided', () => {
    const { getByText } = renderWithTheme(
      <TextInput
        placeholder="Enter text"
        value=""
        onChangeText={() => {}}
        error="This field is required"
      />
    );
    
    expect(getByText('This field is required')).toBeTruthy();
  });

  it('applies error styling when error is present', () => {
    const { getByPlaceholderText } = renderWithTheme(
      <TextInput
        placeholder="Enter text"
        value=""
        onChangeText={() => {}}
        error="Error message"
      />
    );
    
    const input = getByPlaceholderText('Enter text');
    expect(input.props.style.borderColor).toBe('#FF3B30'); // Error color
  });

  it('uses theme colors', () => {
    const { getByPlaceholderText } = renderWithTheme(
      <TextInput
        placeholder="Enter text"
        value=""
        onChangeText={() => {}}
      />
    );
    
    const input = getByPlaceholderText('Enter text');
    expect(input.props.style.backgroundColor).toBe('#FFFFFF'); // Light theme surface
  });

  it('has proper accessibility attributes', () => {
    const { getByPlaceholderText } = renderWithTheme(
      <TextInput
        placeholder="Enter email"
        value=""
        onChangeText={() => {}}
        error="Invalid email"
      />
    );
    
    const input = getByPlaceholderText('Enter email');
    expect(input.props.accessibilityRole).toBe('text');
    expect(input.props.accessibilityHint).toBe('Enter email');
    expect(input.props.accessibilityLabel).toBe('Error: Invalid email');
  });
});