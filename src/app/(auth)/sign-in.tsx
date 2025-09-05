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

export default function SignInScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const signIn = useSupabaseAuth.use.signIn();
  const isLoading = useSupabaseAuth.use.isLoading();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async () => {
    if (!validateForm()) return;

    try {
      await signIn(email, password);
      // Navigation will be handled by auth state change
    } catch (error: any) {
      Alert.alert(
        'Sign In Failed',
        error.message || 'Please check your credentials and try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleForgotPassword = () => {
    router.push('/(auth)/forgot-password');
  };

  const handleSignUp = () => {
    router.push('/(auth)/sign-up');
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
            {/* Header */}
            <View className="mb-8">
              <Text className="text-3xl font-bold text-center mb-2">
                Welcome Back
              </Text>
              <Text className="text-base text-center opacity-60">
                Sign in to continue planning your trips
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

              <View>
                <Input
                  label="Password"
                  placeholder="••••••••"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (errors.password) {
                      setErrors({ ...errors, password: undefined });
                    }
                  }}
                  secureTextEntry
                  autoComplete="password"
                  textContentType="password"
                  error={errors.password}
                  editable={!isLoading}
                />
              </View>

              {/* Forgot Password Link */}
              <View className="items-end">
                <PlatformButton
                  label="Forgot Password?"
                  variant="text"
                  size="sm"
                  onPress={handleForgotPassword}
                  disabled={isLoading}
                />
              </View>
            </View>

            {/* Sign In Button */}
            <View className="mt-8">
              <PlatformButton
                label="Sign In"
                onPress={handleSignIn}
                loading={isLoading}
                disabled={isLoading || !email || !password}
                fullWidth
                variant="primary"
              />
            </View>

            {/* Sign Up Link */}
            <View className="mt-6 flex-row justify-center items-center">
              <Text className="text-sm opacity-60">
                Don't have an account?{' '}
              </Text>
              <PlatformButton
                label="Sign Up"
                variant="text"
                size="sm"
                onPress={handleSignUp}
                disabled={isLoading}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
