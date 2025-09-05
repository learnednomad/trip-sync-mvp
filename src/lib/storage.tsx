import { MMKV } from 'react-native-mmkv';

// Create separate MMKV instances for different data types
export const storage = new MMKV({
  id: 'default-storage',
});

export const secureStorage = new MMKV({
  id: 'secure-storage',
  encryptionKey: 'your-encryption-key-here', // TODO: Generate a proper key in production
});

// Type-safe storage utility functions
export function getItem<T>(key: string, secure: boolean = false): T | null {
  try {
    const store = secure ? secureStorage : storage;
    const value = store.getString(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error(`[Storage] Error getting item ${key}:`, error);
    return null;
  }
}

export async function setItem<T>(key: string, value: T, secure: boolean = false): Promise<void> {
  try {
    const store = secure ? secureStorage : storage;
    store.set(key, JSON.stringify(value));
  } catch (error) {
    console.error(`[Storage] Error setting item ${key}:`, error);
    throw error;
  }
}

export async function removeItem(key: string, secure: boolean = false): Promise<void> {
  try {
    const store = secure ? secureStorage : storage;
    store.delete(key);
  } catch (error) {
    console.error(`[Storage] Error removing item ${key}:`, error);
    throw error;
  }
}

// Additional utility functions
export function getAllKeys(secure: boolean = false): string[] {
  const store = secure ? secureStorage : storage;
  return store.getAllKeys();
}

export function clearAll(secure: boolean = false): void {
  const store = secure ? secureStorage : storage;
  store.clearAll();
}

export function contains(key: string, secure: boolean = false): boolean {
  const store = secure ? secureStorage : storage;
  return store.contains(key);
}

// Storage keys constants
export const StorageKeys = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  SESSION: 'session',
  THEME: 'theme',
  LANGUAGE: 'language',
  OFFLINE_QUEUE: 'offline_queue',
  LAST_SYNC: 'last_sync',
} as const;

// TypeScript types for storage
export type StorageKey = typeof StorageKeys[keyof typeof StorageKeys];

// Storage with TypeScript generics for type safety
export class TypedStorage {
  static get<T>(key: string, defaultValue?: T, secure: boolean = false): T | null {
    const value = getItem<T>(key, secure);
    return value !== null ? value : defaultValue ?? null;
  }

  static set<T>(key: string, value: T, secure: boolean = false): Promise<void> {
    return setItem(key, value, secure);
  }

  static remove(key: string, secure: boolean = false): Promise<void> {
    return removeItem(key, secure);
  }

  static clear(secure: boolean = false): void {
    clearAll(secure);
  }
}
