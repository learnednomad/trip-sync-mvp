import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useTheme } from '@/theme/ThemeContext';
import { MVPButton } from '@/components/ui';

export default function TripInviteModal() {
  const { theme } = useTheme();
  const { code } = useLocalSearchParams<{ code: string }>();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: 24,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 16,
    },
    description: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: 32,
    },
    code: {
      fontSize: 32,
      fontWeight: 'bold',
      color: theme.colors.primary,
      marginBottom: 32,
    },
    buttonContainer: {
      width: '100%',
      gap: 12,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Join Trip</Text>
      <Text style={styles.description}>
        You've been invited to join a trip!
      </Text>
      {code && <Text style={styles.code}>{code}</Text>}
      
      <View style={styles.buttonContainer}>
        <MVPButton
          variant="primary"
          fullWidth
          onPress={() => {
            // Handle join trip
            router.back();
          }}
        >
          Accept Invitation
        </MVPButton>
        <MVPButton
          variant="secondary"
          fullWidth
          onPress={() => router.back()}
        >
          Cancel
        </MVPButton>
      </View>
    </View>
  );
}