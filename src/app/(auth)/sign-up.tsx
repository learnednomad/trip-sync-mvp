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

export default function SignUpScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const signUp = useSupabaseAuth.use.signUp();
  const isLoading = useSupabaseAuth.use.isLoading();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

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

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    try {
      await signUp(email, password, fullName);

      // Show success message and redirect to sign in
      Alert.alert(
        'Check Your Email',
        'We sent you a verification link. Please check your email to complete registration.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(auth)/sign-in'),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert(
        'Sign Up Failed',
        error.message || 'Please try again later.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleSignIn = () => {
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
            {/* Header */}
            <View className="mb-8">
              <Text className="text-3xl font-bold text-center mb-2">
                Create Account
              </Text>
              <Text className="text-base text-center opacity-60">
                Start planning amazing trips together
              </Text>
            </View>

            {/* Form */}
            <View className="space-y-4">
              <View>
                <Input
                  label="Full Name"
                  placeholder="John Doe"
                  value={fullName}
                  onChangeText={(text) => {
                    setFullName(text);
                    if (errors.fullName) {
                      setErrors({ ...errors, fullName: undefined });
                    }
                  }}
                  autoComplete="name"
                  textContentType="name"
                  error={errors.fullName}
                  editable={!isLoading}
                />
              </View>

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
                  autoComplete="password-new"
                  textContentType="newPassword"
                  error={errors.password}
                  editable={!isLoading}
                />
              </View>

              <View>
                <Input
                  label="Confirm Password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    if (errors.confirmPassword) {
                      setErrors({ ...errors, confirmPassword: undefined });
                    }
                  }}
                  secureTextEntry
                  autoComplete="password-new"
                  textContentType="newPassword"
                  error={errors.confirmPassword}
                  editable={!isLoading}
                />
              </View>
            </View>

            {/* Sign Up Button */}
            <View className="mt-8">
              <PlatformButton
                label="Create Account"
                onPress={handleSignUp}
                loading={isLoading}
                disabled={
                  isLoading ||
                  !email ||
                  !password ||
                  !fullName ||
                  !confirmPassword
                }
                fullWidth
                variant="primary"
              />
            </View>

            {/* Terms Text */}
            <Text className="text-xs text-center mt-4 opacity-60 px-8">
              By creating an account, you agree to our Terms of Service and
              Privacy Policy
            </Text>

            {/* Sign In Link */}
            <View className="mt-6 flex-row justify-center items-center">
              <Text className="text-sm opacity-60">
                Already have an account?{' '}
              </Text>
              <PlatformButton
                label="Sign In"
                variant="text"
                size="sm"
                onPress={handleSignIn}
                disabled={isLoading}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
