# Supabase Authentication Implementation Guide for React Native

## Overview

This guide provides comprehensive implementation details for all authentication methods in the Sabron Trip Sync app using Supabase Auth with React Native and Expo.

## Table of Contents

1. [Initial Setup](#initial-setup)
2. [Authentication Methods](#authentication-methods)
3. [Session Management](#session-management)
4. [Security Best Practices](#security-best-practices)
5. [Implementation Examples](#implementation-examples)
6. [Troubleshooting](#troubleshooting)

## Initial Setup

### 1. Install Dependencies

```bash
# Core dependencies
npx expo install @supabase/supabase-js @react-native-async-storage/async-storage react-native-url-polyfill

# For secure storage (optional but recommended)
npx expo install expo-secure-store

# For OAuth and deep linking
npx expo install expo-auth-session expo-web-browser expo-linking

# For biometric authentication
npx expo install expo-local-authentication

# For Apple Sign In
npx expo install expo-apple-authentication

# For Google Sign In
npx expo install @react-native-google-signin/google-signin
```

### 2. Configure Supabase Client

Create `src/lib/supabase.ts`:

```typescript
import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient, Session } from '@supabase/supabase-js'
import { Platform, AppState } from 'react-native'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!

// For production, use SecureStore for encryption
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    ...(Platform.OS !== "web" ? { storage: AsyncStorage } : {}),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    lock: processLock, // Prevents race conditions
  },
})

// Handle app state changes for token refresh
if (Platform.OS !== 'web') {
  AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      supabase.auth.startAutoRefresh()
    } else {
      supabase.auth.stopAutoRefresh()
    }
  })
}
```

### 3. Configure Deep Linking

In `app.json`:

```json
{
  "expo": {
    "scheme": "sabronsync",
    "ios": {
      "bundleIdentifier": "com.sabron.tripsync",
      "associatedDomains": ["applinks:your-supabase-project.supabase.co"]
    },
    "android": {
      "package": "com.sabron.tripsync",
      "intentFilters": [
        {
          "action": "VIEW",
          "autoVerify": true,
          "data": {
            "scheme": "sabronsync",
            "host": "auth"
          },
          "category": ["BROWSABLE", "DEFAULT"]
        }
      ]
    }
  }
}
```

## Authentication Methods

### 1. Email/Password Authentication

```typescript
// Sign up with email
export async function signUpWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: 'sabronsync://auth/callback',
      data: {
        // Additional user metadata
        full_name: '',
        avatar_url: '',
      }
    }
  })
  
  if (error) throw error
  
  // Check if email verification is required
  if (!data.session) {
    return { needsEmailVerification: true, user: data.user }
  }
  
  return { session: data.session, user: data.user }
}

// Sign in with email
export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) throw error
  return data
}

// Reset password
export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'sabronsync://auth/reset-password',
  })
  
  if (error) throw error
}
```

### 2. Apple Sign In (iOS)

```typescript
import * as AppleAuthentication from 'expo-apple-authentication'
import * as Crypto from 'expo-crypto'

export async function signInWithApple() {
  try {
    // Generate nonce for security
    const nonce = Math.random().toString(36).substring(2, 10)
    const hashedNonce = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      nonce,
      { encoding: Crypto.CryptoEncoding.HEX }
    )
    
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
      nonce: hashedNonce,
    })
    
    // Sign in with Supabase
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'apple',
      token: credential.identityToken!,
      nonce,
      options: {
        data: {
          full_name: `${credential.fullName?.givenName || ''} ${credential.fullName?.familyName || ''}`.trim(),
        }
      }
    })
    
    if (error) throw error
    return data
  } catch (e: any) {
    if (e.code === 'ERR_REQUEST_CANCELED') {
      // User canceled the sign-in flow
      return null
    }
    throw e
  }
}

// Check Apple Sign In availability
export async function isAppleAuthAvailable() {
  return await AppleAuthentication.isAvailableAsync()
}
```

### 3. Google Sign In

```typescript
import { makeRedirectUri } from 'expo-auth-session'
import * as WebBrowser from 'expo-web-browser'
import * as QueryParams from 'expo-auth-session/build/QueryParams'

WebBrowser.maybeCompleteAuthSession()

export async function signInWithGoogle() {
  const redirectTo = makeRedirectUri({
    native: 'sabronsync://auth/callback',
  })
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
      skipBrowserRedirect: true,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent', // Force consent to get refresh token
      },
    },
  })
  
  if (error) throw error
  
  const res = await WebBrowser.openAuthSessionAsync(
    data.url,
    redirectTo
  )
  
  if (res.type === 'success') {
    const { url } = res
    await handleOAuthCallback(url)
  }
}

// Handle OAuth callback
async function handleOAuthCallback(url: string) {
  const { params, errorCode } = QueryParams.getQueryParams(url)
  
  if (errorCode) throw new Error(errorCode)
  
  const { access_token, refresh_token } = params
  
  if (!access_token) return
  
  const { data, error } = await supabase.auth.setSession({
    access_token,
    refresh_token,
  })
  
  if (error) throw error
  return data.session
}
```

### 4. Magic Link Authentication

```typescript
export async function signInWithMagicLink(email: string) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: 'sabronsync://auth/callback',
      shouldCreateUser: true,
    },
  })
  
  if (error) throw error
}
```

### 5. Phone/SMS Authentication

```typescript
export async function signInWithPhone(phone: string) {
  const { data, error } = await supabase.auth.signInWithOtp({
    phone,
    options: {
      shouldCreateUser: true,
      channel: 'sms', // or 'whatsapp'
    },
  })
  
  if (error) throw error
  return data
}

export async function verifyPhoneOtp(phone: string, token: string) {
  const { data, error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: 'sms',
  })
  
  if (error) throw error
  return data
}
```

### 6. Anonymous Authentication

```typescript
export async function signInAnonymously() {
  const { data, error } = await supabase.auth.signInAnonymously({
    options: {
      data: {
        is_anonymous: true,
      }
    }
  })
  
  if (error) throw error
  return data
}

// Convert anonymous to permanent account
export async function linkAnonymousAccount(email: string, password: string) {
  const { data, error } = await supabase.auth.updateUser({
    email,
    password,
    data: {
      is_anonymous: false,
    }
  })
  
  if (error) throw error
  return data
}
```

## Session Management

### 1. Session State Management

```typescript
import { create } from 'zustand'
import { Session, User } from '@supabase/supabase-js'

interface AuthState {
  session: Session | null
  user: User | null
  isLoading: boolean
  isInitialized: boolean
  setSession: (session: Session | null) => void
  setLoading: (loading: boolean) => void
  initialize: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  user: null,
  isLoading: true,
  isInitialized: false,
  
  setSession: (session) => set({ 
    session, 
    user: session?.user ?? null 
  }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  initialize: async () => {
    if (get().isInitialized) return
    
    try {
      // Get initial session
      const { data: { session } } = await supabase.auth.getSession()
      
      set({
        session,
        user: session?.user ?? null,
        isLoading: false,
        isInitialized: true,
      })
      
      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          set({ session, user: session?.user ?? null })
          
          // Handle specific events
          switch (event) {
            case 'SIGNED_IN':
              // Handle sign in
              break
            case 'SIGNED_OUT':
              // Clear local data
              await AsyncStorage.clear()
              break
            case 'TOKEN_REFRESHED':
              // Token was refreshed
              break
            case 'USER_UPDATED':
              // User profile was updated
              break
          }
        }
      )
      
      // Cleanup function
      return () => {
        subscription.unsubscribe()
      }
    } catch (error) {
      console.error('Auth initialization error:', error)
      set({ isLoading: false, isInitialized: true })
    }
  },
}))
```

### 2. Auth Context Provider

```typescript
import React, { useEffect } from 'react'
import { useAuthStore } from '@/store/auth'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const initialize = useAuthStore(state => state.initialize)
  
  useEffect(() => {
    initialize()
  }, [])
  
  return <>{children}</>
}
```

### 3. Protected Routes

```typescript
import { Redirect } from 'expo-router'
import { useAuthStore } from '@/store/auth'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, isLoading, isInitialized } = useAuthStore()
  
  if (!isInitialized || isLoading) {
    return <LoadingScreen />
  }
  
  if (!session) {
    return <Redirect href="/auth/login" />
  }
  
  return <>{children}</>
}
```

### 4. Auto Session Refresh

```typescript
// Session refresh is handled automatically by Supabase
// But you can manually refresh if needed
export async function refreshSession() {
  const { data: { session }, error } = await supabase.auth.getSession()
  
  if (error) throw error
  
  if (session) {
    const { data, error } = await supabase.auth.refreshSession()
    if (error) throw error
    return data.session
  }
  
  return null
}
```

## Security Best Practices

### 1. Secure Storage Implementation

```typescript
import * as SecureStore from 'expo-secure-store'
import * as Crypto from 'expo-crypto'
import AsyncStorage from '@react-native-async-storage/async-storage'

class SecureStorage {
  private async encrypt(key: string, value: string): Promise<string> {
    const encryptionKey = await this.getOrCreateEncryptionKey(key)
    // Implement AES-256 encryption
    return encryptedValue
  }
  
  private async decrypt(key: string, value: string): Promise<string> {
    const encryptionKey = await this.getEncryptionKey(key)
    if (!encryptionKey) throw new Error('No encryption key found')
    // Implement AES-256 decryption
    return decryptedValue
  }
  
  async getItem(key: string): Promise<string | null> {
    const encrypted = await AsyncStorage.getItem(key)
    if (!encrypted) return null
    return await this.decrypt(key, encrypted)
  }
  
  async setItem(key: string, value: string): Promise<void> {
    const encrypted = await this.encrypt(key, value)
    await AsyncStorage.setItem(key, encrypted)
  }
  
  async removeItem(key: string): Promise<void> {
    await AsyncStorage.removeItem(key)
    await SecureStore.deleteItemAsync(`${key}_key`)
  }
}
```

### 2. Biometric Authentication

```typescript
import * as LocalAuthentication from 'expo-local-authentication'

export async function enableBiometricAuth() {
  // Check hardware support
  const hasHardware = await LocalAuthentication.hasHardwareAsync()
  if (!hasHardware) throw new Error('Biometric hardware not available')
  
  // Check enrollment
  const isEnrolled = await LocalAuthentication.isEnrolledAsync()
  if (!isEnrolled) throw new Error('No biometric data enrolled')
  
  // Store preference
  await AsyncStorage.setItem('biometricEnabled', 'true')
}

export async function authenticateWithBiometrics(): Promise<boolean> {
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Authenticate to access Trip Sync',
    fallbackLabel: 'Use Passcode',
    cancelLabel: 'Cancel',
  })
  
  return result.success
}
```

### 3. Security Headers and Best Practices

```typescript
// Row Level Security (RLS) is enabled on all tables
// Example policy for trips table:
/*
CREATE POLICY "Users can only see their own trips" ON trips
  FOR ALL USING (auth.uid() = user_id OR id IN (
    SELECT trip_id FROM trip_members WHERE user_id = auth.uid()
  ));
*/

// Always validate on the server
export async function createTrip(tripData: CreateTripInput) {
  // Input validation
  const validated = tripSchema.parse(tripData)
  
  // Server will enforce RLS
  const { data, error } = await supabase
    .from('trips')
    .insert({
      ...validated,
      user_id: (await supabase.auth.getUser()).data.user?.id,
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}
```

## Implementation Examples

### 1. Login Screen Component

```typescript
import React, { useState } from 'react'
import { View, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { Button, Input } from '@/components/ui'
import { useAuthStore } from '@/store/auth'
import { signInWithEmail, signInWithApple, signInWithGoogle } from '@/services/auth'

export function LoginScreen() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  
  const handleEmailLogin = async () => {
    try {
      setLoading(true)
      await signInWithEmail(email, password)
      router.replace('/home')
    } catch (error: any) {
      Alert.alert('Error', error.message)
    } finally {
      setLoading(false)
    }
  }
  
  const handleAppleLogin = async () => {
    try {
      setLoading(true)
      const result = await signInWithApple()
      if (result) {
        router.replace('/home')
      }
    } catch (error: any) {
      Alert.alert('Error', error.message)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <View>
      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Input
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button onPress={handleEmailLogin} loading={loading}>
        Sign In
      </Button>
      <Button onPress={handleAppleLogin} loading={loading}>
        Sign in with Apple
      </Button>
    </View>
  )
}
```

### 2. Auth Hook

```typescript
export function useAuth() {
  const { session, user, isLoading } = useAuthStore()
  const router = useRouter()
  
  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      router.replace('/auth/login')
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }
  
  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) throw new Error('No user logged in')
    
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
    
    if (error) throw error
    
    // Update auth metadata
    await supabase.auth.updateUser({
      data: updates
    })
  }
  
  return {
    session,
    user,
    isLoading,
    isAuthenticated: !!session,
    signOut,
    updateProfile,
  }
}
```

## Troubleshooting

### Common Issues and Solutions

1. **Deep linking not working**
   - Ensure URL scheme is properly configured in app.json
   - Add redirect URL to Supabase dashboard
   - Test with `npx uri-scheme open sabronsync://auth --ios`

2. **Session not persisting**
   - Check AsyncStorage is properly configured
   - Ensure `persistSession: true` in client config
   - Verify `autoRefreshToken` is enabled

3. **OAuth redirect issues**
   - Use platform-specific redirect URLs
   - Configure OAuth providers in Supabase dashboard
   - Test in standalone app, not Expo Go

4. **Token refresh failures**
   - Check network connectivity
   - Ensure app state handling is implemented
   - Monitor refresh token expiration

5. **Apple Sign In not available**
   - Only works on physical iOS devices
   - Requires Apple Developer account
   - Must be tested in production or testflight

### Debug Utilities

```typescript
// Debug auth state
export async function debugAuth() {
  const { data: { session } } = await supabase.auth.getSession()
  console.log('Current session:', session)
  
  const { data: { user } } = await supabase.auth.getUser()
  console.log('Current user:', user)
  
  // Check stored tokens
  const storedSession = await AsyncStorage.getItem('supabase.auth.token')
  console.log('Stored session:', storedSession)
}

// Monitor auth events
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth event:', event)
  console.log('Session:', session)
})
```

## Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [React Native Authentication Guide](https://supabase.com/docs/guides/auth/quickstarts/react-native)
- [Deep Linking Setup](https://supabase.com/docs/guides/auth/native-mobile-deep-linking)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)