import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { Button, Input, Text } from '@/ui';
import { supabase } from '@/lib/supabase';

export default function TestAuthScreen() {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);

  async function testSignUp() {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Success', 'Check your email for verification!');
        console.log('User created:', data);
      }
    } catch (err) {
      Alert.alert('Error', String(err));
    } finally {
      setLoading(false);
    }
  }

  async function testSignIn() {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Success', 'Signed in successfully!');
        console.log('Session:', data.session);
      }
    } catch (err) {
      Alert.alert('Error', String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1 p-4 pt-12">
      <Text className="text-2xl font-bold mb-8">Test Supabase Auth</Text>
      
      <Input
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="test@example.com"
        autoCapitalize="none"
        className="mb-4"
      />
      
      <Input
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="password123"
        secureTextEntry
        className="mb-8"
      />
      
      <Button
        label="Sign Up"
        onPress={testSignUp}
        loading={loading}
        className="mb-4"
      />
      
      <Button
        label="Sign In"
        onPress={testSignIn}
        loading={loading}
        variant="outline"
      />
    </View>
  );
}