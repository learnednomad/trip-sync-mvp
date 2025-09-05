import { type User } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';

// eslint-disable-next-line max-lines-per-function
export function useAuth() {
  const [loading, setLoading] = useState(true);
  const { user, setUser, clearUser, isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Check initial session
    checkSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        clearUser();
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkSession = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
      }
    } catch (error) {
      console.error('Session check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        setUser(data.user);
        // Store session tokens securely
        if (data.session) {
          await SecureStore.setItemAsync(
            'refresh_token',
            data.session.refresh_token
          );
        }
      }

      return { success: true, user: data.user };
    } catch (error: any) {
      Alert.alert('Sign In Error', error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        // Create user profile
        const { error: profileError } = await supabase.from('users').insert([
          {
            id: data.user.id,
            email: data.user.email!,
            full_name: fullName,
          },
        ]);

        if (profileError) throw profileError;
      }

      return { success: true, user: data.user };
    } catch (error: any) {
      Alert.alert('Sign Up Error', error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      clearUser();
      await SecureStore.deleteItemAsync('refresh_token');
    } catch (error: any) {
      Alert.alert('Sign Out Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'sabrontrip://reset-password',
      });

      if (error) throw error;

      Alert.alert(
        'Password Reset',
        'Check your email for the password reset link'
      );
      return { success: true };
    } catch (error: any) {
      Alert.alert('Password Reset Error', error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.updateUser(updates);

      if (error) throw error;

      if (data.user) {
        setUser(data.user);
        // Also update the users table
        const { error: profileError } = await supabase
          .from('users')
          .update(updates)
          .eq('id', data.user.id);

        if (profileError) throw profileError;
      }

      return { success: true, user: data.user };
    } catch (error: any) {
      Alert.alert('Profile Update Error', error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
    checkSession,
  };
}
