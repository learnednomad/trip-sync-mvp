import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useTheme } from '@/theme/ThemeContext';
import { MVPButton } from '@/components/ui';

export default function TripSettingsModal() {
  const { theme } = useTheme();
  const { tripId } = useLocalSearchParams<{ tripId: string }>();
  const [isPublic, setIsPublic] = React.useState(false);
  const [autoSplit, setAutoSplit] = React.useState(true);
  const [notifications, setNotifications] = React.useState(true);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      padding: 20,
    },
    header: {
      marginBottom: 24,
    },
    title: {
      fontSize: 24,
      fontWeight: '600',
      color: theme.colors.text,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 16,
    },
    settingRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    settingLabel: {
      fontSize: 16,
      color: theme.colors.text,
      flex: 1,
    },
    settingDescription: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginTop: 4,
    },
    dangerSection: {
      marginTop: 32,
      paddingTop: 24,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    dangerButton: {
      marginBottom: 12,
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Trip Settings</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy</Text>
          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingLabel}>Public Trip</Text>
              <Text style={styles.settingDescription}>
                Allow others to discover and join this trip
              </Text>
            </View>
            <Switch
              value={isPublic}
              onValueChange={setIsPublic}
              trackColor={{ 
                false: theme.colors.border, 
                true: theme.colors.primary 
              }}
              thumbColor={theme.colors.background}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Expenses</Text>
          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingLabel}>Auto-split expenses</Text>
              <Text style={styles.settingDescription}>
                Automatically split new expenses equally
              </Text>
            </View>
            <Switch
              value={autoSplit}
              onValueChange={setAutoSplit}
              trackColor={{ 
                false: theme.colors.border, 
                true: theme.colors.primary 
              }}
              thumbColor={theme.colors.background}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingLabel}>Trip notifications</Text>
              <Text style={styles.settingDescription}>
                Get notified about trip updates and expenses
              </Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ 
                false: theme.colors.border, 
                true: theme.colors.primary 
              }}
              thumbColor={theme.colors.background}
            />
          </View>
        </View>

        <View style={styles.dangerSection}>
          <Text style={styles.sectionTitle}>Danger Zone</Text>
          <View style={styles.dangerButton}>
            <MVPButton
              variant="danger"
              fullWidth
              onPress={() => {
                // Handle leave trip
              }}
            >
              Leave Trip
            </MVPButton>
          </View>
          <MVPButton
            variant="danger"
            fullWidth
            onPress={() => {
              // Handle delete trip
            }}
          >
            Delete Trip
          </MVPButton>
        </View>

        <View style={{ marginTop: 24 }}>
          <MVPButton
            variant="secondary"
            fullWidth
            onPress={() => router.back()}
          >
            Done
          </MVPButton>
        </View>
      </ScrollView>
    </View>
  );
}