import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useTheme } from '@/theme/ThemeContext';
import { MVPButton } from '@/components/ui';
import { Ionicons } from '@expo/vector-icons';

export default function UserProfileModal() {
  const { theme } = useTheme();
  const { userId } = useLocalSearchParams<{ userId: string }>();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    closeButton: {
      padding: 8,
    },
    content: {
      flex: 1,
      padding: 16,
    },
    profileSection: {
      alignItems: 'center',
      marginBottom: 32,
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
    },
    avatarText: {
      fontSize: 36,
      fontWeight: 'bold',
      color: theme.colors.background,
    },
    name: {
      fontSize: 24,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 8,
    },
    email: {
      fontSize: 16,
      color: theme.colors.textSecondary,
    },
    statsSection: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingVertical: 24,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: theme.colors.border,
      marginBottom: 24,
    },
    statItem: {
      alignItems: 'center',
    },
    statValue: {
      fontSize: 24,
      fontWeight: '600',
      color: theme.colors.text,
    },
    statLabel: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginTop: 4,
    },
    actionSection: {
      gap: 12,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>User Profile</Text>
        <MVPButton
          variant="ghost"
          size="small"
          onPress={() => router.back()}
        >
          <Ionicons name="close" size={24} color={theme.colors.text} />
        </MVPButton>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>JD</Text>
          </View>
          <Text style={styles.name}>John Doe</Text>
          <Text style={styles.email}>john.doe@example.com</Text>
        </View>

        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Trips</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>48</Text>
            <Text style={styles.statLabel}>Friends</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>156</Text>
            <Text style={styles.statLabel}>Expenses</Text>
          </View>
        </View>

        <View style={styles.actionSection}>
          <MVPButton
            variant="primary"
            fullWidth
            onPress={() => {
              // Add friend action
            }}
          >
            Add Friend
          </MVPButton>
          <MVPButton
            variant="secondary"
            fullWidth
            onPress={() => {
              // View trips action
            }}
          >
            View Shared Trips
          </MVPButton>
        </View>
      </ScrollView>
    </View>
  );
}