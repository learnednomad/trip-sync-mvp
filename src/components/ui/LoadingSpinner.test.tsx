/**
 * LoadingSpinner Component Tests
 * Tests for MVP LoadingSpinner with size variants
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { LoadingSpinner } from './LoadingSpinner';
import { ThemeProvider } from '@/theme/mvp';

// Test wrapper with theme
const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
};

describe('LoadingSpinner Component', () => {
  it('renders correctly', () => {
    const { getByLabelText } = renderWithTheme(
      <LoadingSpinner />
    );
    expect(getByLabelText('Loading')).toBeTruthy();
  });

  it('uses primary color from theme', () => {
    const { getByLabelText } = renderWithTheme(
      <LoadingSpinner />
    );
    
    const spinner = getByLabelText('Loading');
    expect(spinner.props.color).toBe('#007AFF'); // Light theme primary
  });

  it('renders small size correctly', () => {
    const { getByLabelText } = renderWithTheme(
      <LoadingSpinner size="small" />
    );
    
    const spinner = getByLabelText('Loading');
    expect(spinner.props.size).toBe('small');
  });

  it('renders medium size correctly', () => {
    const { getByLabelText } = renderWithTheme(
      <LoadingSpinner size="medium" />
    );
    
    const spinner = getByLabelText('Loading');
    expect(spinner.props.size).toBe('large'); // Maps to RN 'large'
  });

  it('renders large size correctly', () => {
    const { getByLabelText } = renderWithTheme(
      <LoadingSpinner size="large" />
    );
    
    const spinner = getByLabelText('Loading');
    expect(spinner.props.size).toBe(48); // Custom size value
  });

  it('defaults to medium size', () => {
    const { getByLabelText } = renderWithTheme(
      <LoadingSpinner />
    );
    
    const spinner = getByLabelText('Loading');
    expect(spinner.props.size).toBe('large'); // Default medium maps to RN 'large'
  });

  it('is animating', () => {
    const { getByLabelText } = renderWithTheme(
      <LoadingSpinner />
    );
    
    const spinner = getByLabelText('Loading');
    expect(spinner.props.animating).toBe(true);
  });

  it('has accessibility label', () => {
    const { getByLabelText } = renderWithTheme(
      <LoadingSpinner />
    );
    
    expect(getByLabelText('Loading')).toBeTruthy();
  });
});