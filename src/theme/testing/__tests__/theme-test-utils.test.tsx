/**
 * Theme Test Utilities Tests
 */

import { render } from '@testing-library/react-native';
import React from 'react';
import { Text, View } from 'react-native';

import { useTheme } from '@/theme';

import {
  createMockTheme,
  getThemeStyles,
  renderWithTheme,
  testThemeVariants,
  ThemeTestWrapper,
} from '@/theme/testing';

// Test component
const TestComponent: React.FC = () => {
  const { colorScheme, highContrast } = useTheme();
  return (
    <View testID="test-container">
      <Text testID="color-scheme">{colorScheme}</Text>
      <Text testID="high-contrast">{highContrast ? 'true' : 'false'}</Text>
    </View>
  );
};

// eslint-disable-next-line max-lines-per-function
describe('Theme Test Utilities', () => {
  describe('renderWithTheme', () => {
    it('should render component with default light theme', () => {
      const { getByTestId } = renderWithTheme(<TestComponent />);

      // eslint-disable-next-line testing-library/prefer-screen-queries
      expect(getByTestId('color-scheme')).toHaveTextContent('light');
      expect(getByTestId('high-contrast')).toHaveTextContent('false');
    });

    it('should render component with dark theme', () => {
      const { getByTestId } = renderWithTheme(<TestComponent />, {
        colorScheme: 'dark',
      });

      expect(getByTestId('color-scheme')).toHaveTextContent('dark');
    });

    it('should render component with high contrast mode', () => {
      const { getByTestId } = renderWithTheme(<TestComponent />, {
        contrastMode: 'high',
      });

      expect(getByTestId('high-contrast')).toHaveTextContent('true');
    });

    it('should support rerendering', () => {
      const { rerender, getByTestId } = renderWithTheme(<TestComponent />);

      expect(getByTestId('color-scheme')).toHaveTextContent('light');

      // Rerender should maintain theme wrapper
      rerender(<TestComponent />);
      expect(getByTestId('color-scheme')).toHaveTextContent('light');
    });
  });

  describe('ThemeTestWrapper', () => {
    it('should wrap children with theme provider', () => {
      const { getByTestId } = render(
        <ThemeTestWrapper colorScheme="dark">
          <TestComponent />
        </ThemeTestWrapper>
      );

      expect(getByTestId('color-scheme')).toHaveTextContent('dark');
    });

    it('should accept custom theme settings', () => {
      const { getByTestId } = render(
        <ThemeTestWrapper colorScheme="light" contrastMode="high">
          <TestComponent />
        </ThemeTestWrapper>
      );

      expect(getByTestId('high-contrast')).toHaveTextContent('true');
    });
  });

  describe('createMockTheme', () => {
    it('should create light theme by default', () => {
      const theme = createMockTheme();

      expect(theme.colors.background.primary).toBe('#FFFFFF');
      expect(theme.colors.content.primary).toBe('#0A0A0A');
    });

    it('should create dark theme', () => {
      const theme = createMockTheme('dark');

      expect(theme.colors.background.primary).toBe('#0A0A0A');
      expect(theme.colors.content.primary).toBe('#FAFAFA');
    });

    it('should create high contrast theme', () => {
      const theme = createMockTheme('light', true);

      expect(theme.colors.content.primary).toBe('#000000');
      expect(theme.colors.border.default).toBe('#000000');
    });

    it('should have all required theme properties', () => {
      const theme = createMockTheme();

      expect(theme).toHaveProperty('colors');
      expect(theme).toHaveProperty('typography');
      expect(theme).toHaveProperty('spacing');
      expect(theme).toHaveProperty('animation');
      expect(theme).toHaveProperty('layout');
      expect(theme).toHaveProperty('borderRadius');
      expect(theme).toHaveProperty('shadows');
      expect(theme).toHaveProperty('zIndex');
    });
  });

  describe('getThemeStyles', () => {
    it('should return light theme styles', () => {
      const styles = getThemeStyles('light');

      expect(styles.container.backgroundColor).toBe('#FFFFFF');
      expect(styles.text.color).toBe('#0A0A0A');
      expect(styles.button.backgroundColor).toBe('#2F95DC');
    });

    it('should return dark theme styles', () => {
      const styles = getThemeStyles('dark');

      expect(styles.container.backgroundColor).toBe('#0A0A0A');
      expect(styles.text.color).toBe('#FAFAFA');
    });
  });

  describe('testThemeVariants', () => {
    it('should create all theme variant combinations', () => {
      const SimpleComponent = () => <View testID="simple" />;
      const variants = testThemeVariants(SimpleComponent);

      expect(variants).toHaveLength(4);
      expect(variants[0].name).toBe('light-normal');
      expect(variants[1].name).toBe('dark-normal');
      expect(variants[2].name).toBe('light-high');
      expect(variants[3].name).toBe('dark-high');
    });

    it('should pass props to component in all variants', () => {
      const ComponentWithProps = ({ title }: { title: string }) => (
        <Text testID="title">{title}</Text>
      );

      const variants = testThemeVariants(ComponentWithProps, { title: 'Test' });

      variants.forEach((variant) => {
        const { getByTestId } = render(variant.element);
        expect(getByTestId('title')).toHaveTextContent('Test');
      });
    });
  });
});
