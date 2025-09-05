/**
 * Card Component Tests
 * Tests for MVP Card with surface color, rounded corners, and elevation
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { Text, Platform } from 'react-native';
import { Card } from './Card';
import { ThemeProvider } from '@/theme/mvp';

// Test wrapper with theme
const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
};

describe('Card Component', () => {
  it('renders children correctly', () => {
    const { getByText } = renderWithTheme(
      <Card>
        <Text>Card Content</Text>
      </Card>
    );
    expect(getByText('Card Content')).toBeTruthy();
  });

  it('applies theme surface color', () => {
    const { getByTestId } = renderWithTheme(
      <Card testID="card">
        <Text>Content</Text>
      </Card>
    );
    
    const card = getByTestId('card');
    expect(card.props.style[0].backgroundColor).toBe('#FFFFFF'); // Light theme surface
  });

  it('has rounded corners', () => {
    const { getByTestId } = renderWithTheme(
      <Card testID="card">
        <Text>Content</Text>
      </Card>
    );
    
    const card = getByTestId('card');
    expect(card.props.style[0].borderRadius).toBe(8);
  });

  it('has proper padding', () => {
    const { getByTestId } = renderWithTheme(
      <Card testID="card">
        <Text>Content</Text>
      </Card>
    );
    
    const card = getByTestId('card');
    expect(card.props.style[0].padding).toBe(16);
  });

  it('applies shadow on iOS', () => {
    Platform.OS = 'ios';
    const { getByTestId } = renderWithTheme(
      <Card testID="card">
        <Text>Content</Text>
      </Card>
    );
    
    const card = getByTestId('card');
    const styles = card.props.style[0];
    expect(styles.shadowColor).toBe('#000');
    expect(styles.shadowOpacity).toBe(0.1);
    expect(styles.shadowRadius).toBe(4);
  });

  it('applies elevation on Android', () => {
    Platform.OS = 'android';
    const { getByTestId } = renderWithTheme(
      <Card testID="card">
        <Text>Content</Text>
      </Card>
    );
    
    const card = getByTestId('card');
    expect(card.props.style[0].elevation).toBe(4);
  });

  it('accepts custom styles', () => {
    const customStyle = { margin: 20 };
    const { getByTestId } = renderWithTheme(
      <Card testID="card" style={customStyle}>
        <Text>Content</Text>
      </Card>
    );
    
    const card = getByTestId('card');
    expect(card.props.style[1]).toEqual(customStyle);
  });
});