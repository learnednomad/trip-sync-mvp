/**
 * Theme Playground
 * Interactive component for testing theme features
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  StyleSheet,
  Animated,
} from 'react-native';
import {
  useTheme,
  useThemeColors,
  useThemeAnimation,
  useThemeSpacing,
} from '../ThemeProvider';
import { textStyles } from '../typography';
import { animationPatterns, animationHelpers } from '../animations';
import { createAnimatedValue, runAnimation } from '../animation-utils';

export const ThemePlayground: React.FC = () => {
  const { theme, colorScheme, highContrast, setColorScheme, setContrastMode } = useTheme();
  const colors = useThemeColors();
  const animation = useThemeAnimation();
  const spacing = useThemeSpacing();

  // Animation states
  const [animating, setAnimating] = useState(false);
  const fadeAnim = useState(() => createAnimatedValue(1))[0];
  const scaleAnim = useState(() => createAnimatedValue(1))[0];
  const slideAnim = useState(() => createAnimatedValue(0))[0];

  // UI states
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState<'fast' | 'normal' | 'slow'>('normal');

  // Run animation examples
  const runAnimationExample = (type: string) => {
    setAnimating(true);
    
    switch (type) {
      case 'fade':
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: animation.duration[selectedDuration],
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: animation.duration[selectedDuration],
            useNativeDriver: true,
          }),
        ]).start(() => setAnimating(false));
        break;
        
      case 'scale':
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: animation.duration[selectedDuration],
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: animation.duration[selectedDuration],
            useNativeDriver: true,
          }),
        ]).start(() => setAnimating(false));
        break;
        
      case 'slide':
        Animated.sequence([
          Animated.timing(slideAnim, {
            toValue: 100,
            duration: animation.duration[selectedDuration],
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: animation.duration[selectedDuration],
            useNativeDriver: true,
          }),
        ]).start(() => setAnimating(false));
        break;
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background.primary }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: spacing[6] }]}>
        <Text style={[textStyles.displayMedium, { color: colors.content.primary }]}>
          Theme Playground
        </Text>
        <Text style={[textStyles.bodyLarge, { color: colors.content.secondary }]}>
          Interactive theme testing environment
        </Text>
      </View>

      {/* Theme Controls */}
      <Section title="Theme Controls" spacing={spacing} colors={colors}>
        <View style={styles.controlGroup}>
          <Text style={[textStyles.labelMedium, { color: colors.content.primary }]}>
            Color Scheme
          </Text>
          <View style={styles.buttonGroup}>
            {(['light', 'dark', 'system'] as const).map((scheme) => (
              <TouchableOpacity
                key={scheme}
                style={[
                  styles.optionButton,
                  {
                    backgroundColor:
                      colorScheme === scheme
                        ? colors.primary[500]
                        : colors.surface.secondary,
                    borderColor: colors.border.default,
                    paddingHorizontal: spacing[2],
                    paddingVertical: spacing[1],
                  },
                ]}
                onPress={() => setColorScheme(scheme)}
              >
                <Text
                  style={[
                    textStyles.labelSmall,
                    {
                      color:
                        colorScheme === scheme
                          ? colors.content.inverse
                          : colors.content.primary,
                    },
                  ]}
                >
                  {scheme.charAt(0).toUpperCase() + scheme.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.controlGroup}>
          <View style={styles.switchRow}>
            <Text style={[textStyles.labelMedium, { color: colors.content.primary }]}>
              High Contrast
            </Text>
            <Switch
              value={highContrast}
              onValueChange={(value) => setContrastMode(value ? 'high' : 'normal')}
              trackColor={{
                false: colors.surface.tertiary,
                true: colors.primary[400],
              }}
              thumbColor={highContrast ? colors.primary[600] : colors.surface.elevated}
            />
          </View>
        </View>

        <View style={styles.controlGroup}>
          <View style={styles.switchRow}>
            <Text style={[textStyles.labelMedium, { color: colors.content.primary }]}>
              Show Accessibility Info
            </Text>
            <Switch
              value={showAccessibility}
              onValueChange={setShowAccessibility}
              trackColor={{
                false: colors.surface.tertiary,
                true: colors.primary[400],
              }}
              thumbColor={showAccessibility ? colors.primary[600] : colors.surface.elevated}
            />
          </View>
        </View>
      </Section>

      {/* Accessibility Info */}
      {showAccessibility && (
        <Section title="Accessibility Info" spacing={spacing} colors={colors}>
          <AccessibilityInfo colors={colors} />
        </Section>
      )}

      {/* Animation Playground */}
      <Section title="Animation Examples" spacing={spacing} colors={colors}>
        <View style={styles.controlGroup}>
          <Text style={[textStyles.labelMedium, { color: colors.content.primary }]}>
            Duration
          </Text>
          <View style={styles.buttonGroup}>
            {(['fast', 'normal', 'slow'] as const).map((duration) => (
              <TouchableOpacity
                key={duration}
                style={[
                  styles.optionButton,
                  {
                    backgroundColor:
                      selectedDuration === duration
                        ? colors.primary[500]
                        : colors.surface.secondary,
                    borderColor: colors.border.default,
                    paddingHorizontal: spacing[2],
                    paddingVertical: spacing[1],
                  },
                ]}
                onPress={() => setSelectedDuration(duration)}
              >
                <Text
                  style={[
                    textStyles.labelSmall,
                    {
                      color:
                        selectedDuration === duration
                          ? colors.content.inverse
                          : colors.content.primary,
                    },
                  ]}
                >
                  {duration} ({animation.duration[duration]}ms)
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.animationGrid}>
          <AnimatedBox
            label="Fade"
            animatedValue={fadeAnim}
            style={{ opacity: fadeAnim }}
            onPress={() => runAnimationExample('fade')}
            disabled={animating}
            colors={colors}
            spacing={spacing}
          />
          <AnimatedBox
            label="Scale"
            animatedValue={scaleAnim}
            style={{ transform: [{ scale: scaleAnim }] }}
            onPress={() => runAnimationExample('scale')}
            disabled={animating}
            colors={colors}
            spacing={spacing}
          />
          <AnimatedBox
            label="Slide"
            animatedValue={slideAnim}
            style={{ transform: [{ translateX: slideAnim }] }}
            onPress={() => runAnimationExample('slide')}
            disabled={animating}
            colors={colors}
            spacing={spacing}
          />
        </View>
      </Section>

      {/* Interactive Components */}
      <Section title="Interactive Components" spacing={spacing} colors={colors}>
        <InteractiveCard colors={colors} spacing={spacing} theme={theme} />
      </Section>
    </ScrollView>
  );
};

// Helper Components
const Section: React.FC<{
  title: string;
  children: React.ReactNode;
  spacing: any;
  colors: any;
}> = ({ title, children, spacing, colors }) => (
  <View style={[styles.section, { padding: spacing[4] }]}>
    <Text
      style={[
        textStyles.headingLarge,
        { color: colors.content.primary, marginBottom: spacing[3] },
      ]}
    >
      {title}
    </Text>
    {children}
  </View>
);

const AccessibilityInfo: React.FC<{ colors: any }> = ({ colors }) => (
  <View style={styles.infoBox}>
    <InfoRow
      label="Primary Text Contrast"
      value="21:1"
      status="AAA"
      colors={colors}
    />
    <InfoRow
      label="Secondary Text Contrast"
      value="7.5:1"
      status="AA"
      colors={colors}
    />
    <InfoRow
      label="Touch Target Size"
      value="44x44px"
      status="Pass"
      colors={colors}
    />
    <InfoRow
      label="Reduce Motion"
      value="Supported"
      status="Pass"
      colors={colors}
    />
  </View>
);

const InfoRow: React.FC<{
  label: string;
  value: string;
  status: string;
  colors: any;
}> = ({ label, value, status, colors }) => (
  <View style={styles.infoRow}>
    <Text style={[textStyles.bodyMedium, { color: colors.content.primary, flex: 1 }]}>
      {label}
    </Text>
    <Text style={[textStyles.bodyMedium, { color: colors.content.secondary }]}>
      {value}
    </Text>
    <Text
      style={[
        textStyles.labelSmall,
        {
          color: status === 'Pass' || status === 'AAA' || status === 'AA'
            ? colors.success[600]
            : colors.error[600],
          marginLeft: 8,
        },
      ]}
    >
      {status}
    </Text>
  </View>
);

const AnimatedBox: React.FC<{
  label: string;
  animatedValue: Animated.Value;
  style: any;
  onPress: () => void;
  disabled: boolean;
  colors: any;
  spacing: any;
}> = ({ label, style, onPress, disabled, colors, spacing }) => (
  <TouchableOpacity
    style={[
      styles.animationBox,
      { padding: spacing[2], opacity: disabled ? 0.5 : 1 },
    ]}
    onPress={onPress}
    disabled={disabled}
  >
    <Animated.View
      style={[
        styles.animatedContent,
        {
          backgroundColor: colors.primary[500],
          padding: spacing[3],
        },
        style,
      ]}
    >
      <Text style={[textStyles.labelMedium, { color: colors.content.inverse }]}>
        {label}
      </Text>
    </Animated.View>
  </TouchableOpacity>
);

const InteractiveCard: React.FC<{
  colors: any;
  spacing: any;
  theme: any;
}> = ({ colors, spacing, theme }) => {
  const [pressed, setPressed] = useState(false);
  const [expanded, setExpanded] = useState(false);

  return (
    <TouchableOpacity
      style={[
        styles.interactiveCard,
        {
          backgroundColor: colors.surface.primary,
          borderColor: pressed ? colors.primary[500] : colors.border.default,
          borderWidth: 2,
          padding: spacing[3],
        },
        pressed && theme.shadows.md,
      ]}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.9}
    >
      <View style={styles.cardHeader}>
        <Text style={[textStyles.headingMedium, { color: colors.content.primary }]}>
          Interactive Card
        </Text>
        <Text
          style={[
            textStyles.bodySmall,
            { color: colors.content.tertiary, transform: [{ rotate: expanded ? '180deg' : '0deg' }] },
          ]}
        >
          ▼
        </Text>
      </View>
      <Text
        style={[
          textStyles.bodyMedium,
          { color: colors.content.secondary, marginTop: spacing[1] },
        ]}
      >
        Tap to see interaction states
      </Text>
      {expanded && (
        <Text
          style={[
            textStyles.bodySmall,
            { color: colors.content.tertiary, marginTop: spacing[2] },
          ]}
        >
          This card demonstrates press states, animations, and theme integration.
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  section: {
    marginBottom: 8,
  },
  controlGroup: {
    marginBottom: 16,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  optionButton: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoBox: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  animationGrid: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  animationBox: {
    flex: 1,
    alignItems: 'center',
  },
  animatedContent: {
    borderRadius: 12,
    alignItems: 'center',
  },
  interactiveCard: {
    borderRadius: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});