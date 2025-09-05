import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { User, Session } from '@supabase/supabase-js'
import { MMKV } from 'react-native-mmkv'
import { supabase } from '@/lib/supabase'

const storage = new MMKV({ id: 'auth-storage' })

const zustandStorage = {
  getItem: (name: string) => {
    const value = storage.getString(name)
    return value ?? null
  },
  setItem: (name: string, value: string) => {
    storage.set(name, value)
  },
  removeItem: (name: string) => {
    storage.delete(name)
  },
}

interface AuthState {
  user: User | null
  session: Session | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  
  // Actions
  setUser: (user: User) => void
  setSession: (session: Session | null) => void
  clearUser: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: true,
          error: null,
        }),

      setSession: (session) =>
        set({
          session,
          isAuthenticated: !!session,
          user: session?.user ?? null,
        }),

      clearUser: () =>
        set({
          user: null,
          session: null,
          isAuthenticated: false,
          error: null,
        }),

      setLoading: (isLoading) => set({ isLoading }),
      
      setError: (error) => set({ error }),

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null })
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          })
          
          if (error) throw error
          
          set({
            user: data.user,
            session: data.session,
            isAuthenticated: true,
            error: null,
          })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Login failed',
            isAuthenticated: false 
          })
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      logout: async () => {
        try {
          set({ isLoading: true, error: null })
          const { error } = await supabase.auth.signOut()
          
          if (error) throw error
          
          set({
            user: null,
            session: null,
            isAuthenticated: false,
            error: null,
          })
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Logout failed' })
          throw error
        } finally {
          set({ isLoading: false })
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({ 
        user: state.user,
        session: state.session,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
)