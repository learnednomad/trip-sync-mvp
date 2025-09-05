/**
 * Theme Showcase Component
 * Demonstrates all theme features and design tokens
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useTheme, useThemeColors, useThemeTypography, useThemeSpacing } from '../ThemeProvider';
import { textStyles } from '../typography';

export const ThemeShowcase: React.FC = () => {
  const { colorScheme, highContrast, toggleColorScheme, setContrastMode } = useTheme();
  const colors = useThemeColors();
  const typography = useThemeTypography();
  const spacing = useThemeSpacing();

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background.primary }]}>
      {/* Header */}
      <View style={[styles.section, { paddingTop: spacing[6] }]}>
        <Text style={[textStyles.displayLarge, { color: colors.content.primary }]}>
          Theme Showcase
        </Text>
        <Text style={[textStyles.bodyLarge, { color: colors.content.secondary }]}>
          Trip Sync Design System
        </Text>
      </View>

      {/* Theme Controls */}
      <View style={[styles.section, styles.controls]}>
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: colors.primary[500],
              paddingHorizontal: spacing[3],
              paddingVertical: spacing[2],
            },
          ]}
          onPress={toggleColorScheme}
        >
          <Text style={[textStyles.button, { color: colors.content.inverse }]}>
            Theme: {colorScheme}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: colors.secondary[500],
              paddingHorizontal: spacing[3],
              paddingVertical: spacing[2],
            },
          ]}
          onPress={() => setContrastMode(highContrast ? 'normal' : 'high')}
        >
          <Text style={[textStyles.button, { color: colors.content.inverse }]}>
            Contrast: {highContrast ? 'High' : 'Normal'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Color Palette */}
      <View style={styles.section}>
        <Text style={[textStyles.headingLarge, { color: colors.content.primary }]}>
          Color Palette
        </Text>
        
        {/* Primary Colors */}
        <Text style={[textStyles.labelLarge, styles.subsectionTitle, { color: colors.content.primary }]}>
          Primary Colors
        </Text>
        <View style={styles.colorRow}>
          {Object.entries(colors.primary).map(([key, value]) => (
            <View key={key} style={styles.colorItem}>
              <View
                style={[
                  styles.colorSwatch,
                  { backgroundColor: value },
                ]}
              />
              <Text style={[textStyles.caption, { color: colors.content.tertiary }]}>
                {key}
              </Text>
            </View>
          ))}
        </View>

        {/* Semantic Colors */}
        <Text style={[textStyles.labelLarge, styles.subsectionTitle, { color: colors.content.primary }]}>
          Semantic Colors
        </Text>
        <View style={styles.semanticColors}>
          <ColorRow label="Error" color={colors.error[500]} textColor={colors.content.inverse} />
          <ColorRow label="Warning" color={colors.warning[500]} textColor={colors.content.primary} />
          <ColorRow label="Success" color={colors.success[500]} textColor={colors.content.inverse} />
          <ColorRow label="Info" color={colors.info[500]} textColor={colors.content.inverse} />
        </View>

        {/* Surface Colors */}
        <Text style={[textStyles.labelLarge, styles.subsectionTitle, { color: colors.content.primary }]}>
          Surface Colors
        </Text>
        <View style={styles.surfaceColors}>
          <SurfaceCard
            title="Primary Surface"
            backgroundColor={colors.surface.primary}
            borderColor={colors.border.default}
            textColor={colors.content.primary}
          />
          <SurfaceCard
            title="Secondary Surface"
            backgroundColor={colors.surface.secondary}
            borderColor={colors.border.subtle}
            textColor={colors.content.secondary}
          />
          <SurfaceCard
            title="Elevated Surface"
            backgroundColor={colors.surface.elevated}
            borderColor={colors.border.default}
            textColor={colors.content.primary}
            elevated
          />
        </View>
      </View>

      {/* Typography */}
      <View style={styles.section}>
        <Text style={[textStyles.headingLarge, { color: colors.content.primary }]}>
          Typography
        </Text>
        
        <TypographySample
          label="Display Large"
          style={textStyles.displayLarge}
          color={colors.content.primary}
          text="Trip Sync"
        />
        <TypographySample
          label="Display Medium"
          style={textStyles.displayMedium}
          color={colors.content.primary}
          text="Design System"
        />
        <TypographySample
          label="Heading Large"
          style={textStyles.headingLarge}
          color={colors.content.primary}
          text="Section Title"
        />
        <TypographySample
          label="Body Large"
          style={textStyles.bodyLarge}
          color={colors.content.primary}
          text="This is body text used for main content."
        />
        <TypographySample
          label="Body Medium"
          style={textStyles.bodyMedium}
          color={colors.content.secondary}
          text="Secondary body text for descriptions."
        />
        <TypographySample
          label="Label Medium"
          style={textStyles.labelMedium}
          color={colors.content.primary}
          text="LABEL TEXT"
        />
        <TypographySample
          label="Caption"
          style={textStyles.caption}
          color={colors.content.tertiary}
          text="Small caption text"
        />
      </View>

      {/* Spacing */}
      <View style={styles.section}>
        <Text style={[textStyles.headingLarge, { color: colors.content.primary }]}>
          Spacing System
        </Text>
        
        <View style={styles.spacingGrid}>
          {[0.5, 1, 2, 3, 4, 6, 8].map((key) => (
            <View key={key} style={styles.spacingItem}>
              <View
                style={[
                  styles.spacingBox,
                  {
                    width: spacing[key as keyof typeof spacing],
                    height: spacing[key as keyof typeof spacing],
                    backgroundColor: colors.primary[500],
                  },
                ]}
              />
              <Text style={[textStyles.caption, { color: colors.content.tertiary }]}>
                {key} ({spacing[key as keyof typeof spacing]}px)
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Components */}
      <View style={[styles.section, { paddingBottom: spacing[8] }]}>
        <Text style={[textStyles.headingLarge, { color: colors.content.primary }]}>
          Component Examples
        </Text>
        
        {/* Buttons */}
        <View style={styles.componentRow}>
          <TouchableOpacity
            style={[
              styles.exampleButton,
              {
                backgroundColor: colors.primary[500],
                paddingHorizontal: spacing[3],
                paddingVertical: spacing[2],
              },
            ]}
          >
            <Text style={[textStyles.button, { color: colors.content.inverse }]}>
              Primary Button
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.exampleButton,
              {
                backgroundColor: colors.surface.secondary,
                borderWidth: 1,
                borderColor: colors.border.default,
                paddingHorizontal: spacing[3],
                paddingVertical: spacing[2],
              },
            ]}
          >
            <Text style={[textStyles.button, { color: colors.content.primary }]}>
              Secondary Button
            </Text>
          </TouchableOpacity>
        </View>

        {/* Cards */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.surface.primary,
              borderColor: colors.border.default,
              padding: spacing[3],
              marginTop: spacing[2],
            },
          ]}
        >
          <Text style={[textStyles.headingMedium, { color: colors.content.primary }]}>
            Card Title
          </Text>
          <Text
            style={[
              textStyles.bodyMedium,
              { color: colors.content.secondary, marginTop: spacing[1] },
            ]}
          >
            This is a card component with proper spacing and typography.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

// Helper Components
const ColorRow: React.FC<{
  label: string;
  color: string;
  textColor: string;
}> = ({ label, color, textColor }) => (
  <View style={[styles.semanticColorItem, { backgroundColor: color }]}>
    <Text style={[textStyles.labelMedium, { color: textColor }]}>{label}</Text>
  </View>
);

const SurfaceCard: React.FC<{
  title: string;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  elevated?: boolean;
}> = ({ title, backgroundColor, borderColor, textColor, elevated }) => {
  const { shadows } = useTheme().theme;
  
  return (
    <View
      style={[
        styles.surfaceCard,
        {
          backgroundColor,
          borderColor,
          borderWidth: 1,
        },
        elevated && shadows.md,
      ]}
    >
      <Text style={[textStyles.labelMedium, { color: textColor }]}>{title}</Text>
    </View>
  );
};

const TypographySample: React.FC<{
  label: string;
  style: any;
  color: string;
  text: string;
}> = ({ label, style, color, text }) => {
  const { content } = useThemeColors();
  
  return (
    <View style={styles.typographyItem}>
      <Text style={[textStyles.caption, { color: content.tertiary }]}>{label}</Text>
      <Text style={[style, { color }]}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  colorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 8,
  },
  colorItem: {
    alignItems: 'center',
  },
  colorSwatch: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginBottom: 4,
  },
  subsectionTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  semanticColors: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  semanticColorItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  surfaceColors: {
    gap: 12,
    marginTop: 12,
  },
  surfaceCard: {
    padding: 16,
    borderRadius: 12,
  },
  typographyItem: {
    marginVertical: 8,
  },
  spacingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 16,
  },
  spacingItem: {
    alignItems: 'center',
  },
  spacingBox: {
    marginBottom: 4,
  },
  componentRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  exampleButton: {
    flex: 1,
    borderRadius: 8,
    alignItems: 'center',
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
  },
});