import { Session, User } from '@supabase/supabase-js';
import { create } from 'zustand';
import { createSelectors } from '../utils';
import { supabase } from '../supabase';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV({ id: 'auth-storage' });

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Actions
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName?: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  initialize: () => Promise<void>;
  
  // Error state
  error: string | null;
  clearError: () => void;
}

const _useSupabaseAuth = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,

  signIn: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      set({
        user: data.user,
        session: data.session,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to sign in',
        isLoading: false,
      });
      throw error;
    }
  },

  signUp: async (email: string, password: string, fullName?: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName || email.split('@')[0],
          },
        },
      });

      if (error) throw error;

      // Note: User needs to verify email before they can sign in
      set({
        user: data.user,
        session: data.session,
        isAuthenticated: false, // Not authenticated until email verified
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to sign up',
        isLoading: false,
      });
      throw error;
    }
  },

  signOut: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Clear local storage
      storage.clearAll();

      set({
        user: null,
        session: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to sign out',
        isLoading: false,
      });
      throw error;
    }
  },

  resetPassword: async (email: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'sabrontrip://reset-password',
      });

      if (error) throw error;
      
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to send reset email',
        isLoading: false,
      });
      throw error;
    }
  },

  initialize: async () => {
    try {
      set({ isLoading: true });

      // Get initial session
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) throw error;

      if (session) {
        set({
          user: session.user,
          session,
          isAuthenticated: true,
        });
      }

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('Auth event:', event);
          
          if (session) {
            set({
              user: session.user,
              session,
              isAuthenticated: true,
            });
          } else {
            set({
              user: null,
              session: null,
              isAuthenticated: false,
            });
          }
        }
      );

      // Store subscription for cleanup if needed
      (window as any).__authSubscription = subscription;

      set({ isLoading: false });
    } catch (error: any) {
      console.error('Auth initialization error:', error);
      set({
        error: error.message || 'Failed to initialize auth',
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));

export const useSupabaseAuth = createSelectors(_useSupabaseAuth);

// Convenience functions
export const initializeAuth = () => _useSupabaseAuth.getState().initialize();
export const signIn = (email: string, password: string) => 
  _useSupabaseAuth.getState().signIn(email, password);
export const signUp = (email: string, password: string, fullName?: string) => 
  _useSupabaseAuth.getState().signUp(email, password, fullName);
export const signOut = () => _useSupabaseAuth.getState().signOut();
export const resetPassword = (email: string) => 
  _useSupabaseAuth.getState().resetPassword(email);