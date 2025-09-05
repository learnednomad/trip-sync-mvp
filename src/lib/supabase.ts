import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';
import { MMKV } from 'react-native-mmkv';
import { AppState } from 'react-native';

const storage = new MMKV({
  id: 'supabase-storage',
  encryptionKey: 'supabase-encryption-key'
})

// Custom storage adapter for Supabase using MMKV for better performance
const SupabaseMMKVAdapter = {
  getItem: (key: string) => {
    return storage.getString(key) ?? null
  },
  setItem: (key: string, value: string) => {
    storage.set(key, value)
  },
  removeItem: (key: string) => {
    storage.delete(key)
  }
}

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseKey,
  {
    auth: {
      storage: SupabaseMMKVAdapter,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false
    },
    global: {
      headers: {
        'x-app-version': process.env.EXPO_PUBLIC_APP_VERSION || '1.0.0',
        'x-platform': 'mobile'
      }
    },
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    }
  }
)

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})

// Supabase helpers
export const supabaseAdmin = {
  // Auth helpers
  auth: {
    signUp: async (email: string, password: string, metadata?: any) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      })
      if (error) throw error
      return data
    },
    
    signIn: async (email: string, password: string) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      if (error) throw error
      return data
    },
    
    signOut: async () => {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    },
    
    resetPassword: async (email: string) => {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'sabrontrip://reset-password'
      })
      if (error) throw error
    },
    
    updateUser: async (updates: any) => {
      const { data, error } = await supabase.auth.updateUser(updates)
      if (error) throw error
      return data
    }
  },
  
  // Storage helpers
  storage: {
    uploadFile: async (bucket: string, path: string, file: Blob | File) => {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false
        })
      if (error) throw error
      return data
    },
    
    getPublicUrl: (bucket: string, path: string) => {
      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(path)
      return data.publicUrl
    },
    
    deleteFile: async (bucket: string, paths: string[]) => {
      const { error } = await supabase.storage
        .from(bucket)
        .remove(paths)
      if (error) throw error
    }
  }
}

// Realtime subscription manager
export class RealtimeManager {
  private static subscriptions = new Map<string, any>()
  
  static subscribe(
    table: string,
    callback: (payload: any) => void,
    filter?: string
  ) {
    const channel = supabase
      .channel(`${table}_changes`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table,
          filter
        },
        callback
      )
      .subscribe()
    
    this.subscriptions.set(table, channel)
    return channel
  }
  
  static unsubscribe(table: string) {
    const channel = this.subscriptions.get(table)
    if (channel) {
      supabase.removeChannel(channel)
      this.subscriptions.delete(table)
    }
  }
  
  static unsubscribeAll() {
    this.subscriptions.forEach((channel) => {
      supabase.removeChannel(channel)
    })
    this.subscriptions.clear()
  }
}

// Offline sync queue for Supabase
export class SupabaseOfflineQueue {
  private static queue: any[] = []
  private static storage = new MMKV({ id: 'supabase-offline-queue' })
  
  static async addToQueue(operation: any) {
    const queue = this.getQueue()
    queue.push({
      ...operation,
      id: `op_${Date.now()}`,
      timestamp: new Date().toISOString(),
      retryCount: 0
    })
    this.saveQueue(queue)
  }
  
  static getQueue() {
    const queueString = this.storage.getString('queue')
    return queueString ? JSON.parse(queueString) : []
  }
  
  static saveQueue(queue: any[]) {
    this.storage.set('queue', JSON.stringify(queue))
  }
  
  static async processQueue() {
    const queue = this.getQueue()
    const processed: string[] = []
    
    for (const operation of queue) {
      try {
        await this.executeOperation(operation)
        processed.push(operation.id)
      } catch (error) {
        console.error('Failed to process operation:', operation.id, error)
        operation.retryCount++
        if (operation.retryCount > 3) {
          processed.push(operation.id) // Remove after max retries
        }
      }
    }
    
    const remainingQueue = queue.filter(op => !processed.includes(op.id))
    this.saveQueue(remainingQueue)
  }
  
  private static async executeOperation(operation: any) {
    const { table, type, data, id } = operation
    
    switch (type) {
      case 'INSERT':
        await supabase.from(table).insert(data)
        break
      case 'UPDATE':
        await supabase.from(table).update(data).eq('id', id)
        break
      case 'DELETE':
        await supabase.from(table).delete().eq('id', id)
        break
      case 'UPSERT':
        await supabase.from(table).upsert(data)
        break
    }
  }
}