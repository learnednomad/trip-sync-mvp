import React, { useState } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PlatformButton, Input, Text } from '@/components/ui';
import { useSupabaseAuth } from '@/lib/auth/supabase-auth';
import { useTheme } from '@/theme/ThemeContext';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const resetPassword = useSupabaseAuth.use.resetPassword();
  const isLoading = useSupabaseAuth.use.isLoading();
  
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ email?: string }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleResetPassword = async () => {
    if (!validateForm()) return;

    try {
      await resetPassword(email);
      
      Alert.alert(
        'Check Your Email',
        'If an account exists with this email, you will receive password reset instructions.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.message || 'Failed to send reset email. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 px-6 py-8">
            {/* Back Button */}
            <View className="mb-6">
              <PlatformButton
                label="← Back"
                variant="text"
                size="sm"
                onPress={handleBack}
                disabled={isLoading}
              />
            </View>

            {/* Header */}
            <View className="mb-8">
              <Text className="text-3xl font-bold text-center mb-2">
                Reset Password
              </Text>
              <Text className="text-base text-center opacity-60">
                Enter your email and we'll send you instructions to reset your password
              </Text>
            </View>

            {/* Form */}
            <View className="space-y-4">
              <View>
                <Input
                  label="Email"
                  placeholder="enter@email.com"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (errors.email) {
                      setErrors({ ...errors, email: undefined });
                    }
                  }}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoComplete="email"
                  textContentType="emailAddress"
                  error={errors.email}
                  editable={!isLoading}
                />
              </View>
            </View>

            {/* Reset Button */}
            <View className="mt-8">
              <PlatformButton
                label="Send Reset Email"
                onPress={handleResetPassword}
                loading={isLoading}
                disabled={isLoading || !email}
                fullWidth
                variant="primary"
              />
            </View>

            {/* Helper Text */}
            <Text className="text-sm text-center mt-6 opacity-60 px-8">
              Remember your password?{' '}
              <Text 
                className="underline"
                onPress={handleBack}
              >
                Sign In
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}