import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useTheme } from '@/theme/ThemeContext';
import { MVPButton } from '@/components/ui';

export default function ExpenseDetailsModal() {
  const { theme } = useTheme();
  const { expenseId, tripId } = useLocalSearchParams<{ 
    expenseId: string; 
    tripId: string;
  }>();

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
      marginBottom: 8,
    },
    amount: {
      fontSize: 32,
      fontWeight: 'bold',
      color: theme.colors.primary,
    },
    detailsSection: {
      marginBottom: 24,
    },
    detailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    detailLabel: {
      fontSize: 16,
      color: theme.colors.textSecondary,
    },
    detailValue: {
      fontSize: 16,
      color: theme.colors.text,
      fontWeight: '500',
    },
    participantsSection: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 12,
    },
    participant: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 8,
    },
    participantName: {
      fontSize: 16,
      color: theme.colors.text,
    },
    participantAmount: {
      fontSize: 16,
      color: theme.colors.primary,
      fontWeight: '500',
    },
    buttonContainer: {
      gap: 12,
      paddingTop: 16,
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Restaurant Dinner</Text>
          <Text style={styles.amount}>$245.50</Text>
        </View>

        <View style={styles.detailsSection}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date</Text>
            <Text style={styles.detailValue}>Dec 15, 2024</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Category</Text>
            <Text style={styles.detailValue}>Food & Dining</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Paid by</Text>
            <Text style={styles.detailValue}>John Doe</Text>
          </View>
        </View>

        <View style={styles.participantsSection}>
          <Text style={styles.sectionTitle}>Split Between</Text>
          <View style={styles.participant}>
            <Text style={styles.participantName}>John Doe</Text>
            <Text style={styles.participantAmount}>$81.83</Text>
          </View>
          <View style={styles.participant}>
            <Text style={styles.participantName}>Jane Smith</Text>
            <Text style={styles.participantAmount}>$81.83</Text>
          </View>
          <View style={styles.participant}>
            <Text style={styles.participantName}>Bob Johnson</Text>
            <Text style={styles.participantAmount}>$81.84</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <MVPButton
            variant="primary"
            fullWidth
            onPress={() => {
              // Handle edit expense
            }}
          >
            Edit Expense
          </MVPButton>
          <MVPButton
            variant="danger"
            fullWidth
            onPress={() => {
              // Handle delete expense
            }}
          >
            Delete Expense
          </MVPButton>
          <MVPButton
            variant="secondary"
            fullWidth
            onPress={() => router.back()}
          >
            Close
          </MVPButton>
        </View>
      </ScrollView>
    </View>
  );
}