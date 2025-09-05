import { MMKV } from 'react-native-mmkv';
import {
  storage,
  secureStorage,
  getItem,
  setItem,
  removeItem,
  getAllKeys,
  clearAll,
  contains,
  StorageKeys,
  TypedStorage,
} from '../storage';

// Mock MMKV
jest.mock('react-native-mmkv', () => ({
  MMKV: jest.fn().mockImplementation((config) => {
    const store = new Map();
    return {
      id: config?.id,
      encryptionKey: config?.encryptionKey,
      getString: jest.fn((key) => store.get(key)),
      set: jest.fn((key, value) => store.set(key, value)),
      delete: jest.fn((key) => store.delete(key)),
      getAllKeys: jest.fn(() => Array.from(store.keys())),
      clearAll: jest.fn(() => store.clear()),
      contains: jest.fn((key) => store.has(key)),
    };
  }),
}));

describe('Storage Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Storage Instances', () => {
    it('should create storage instances', () => {
      // The storage instances are created when the module is imported
      expect(storage).toBeDefined();
      expect(secureStorage).toBeDefined();
      
      // Verify the instances have expected properties
      expect(storage.set).toBeDefined();
      expect(storage.getString).toBeDefined();
      expect(storage.delete).toBeDefined();
      expect(secureStorage.set).toBeDefined();
      expect(secureStorage.getString).toBeDefined();
    });
  });

  describe('Basic Operations', () => {
    it('should set and get item', async () => {
      const key = 'test-key';
      const value = { test: 'data', number: 123 };
      
      await setItem(key, value);
      expect(storage.set).toHaveBeenCalledWith(key, JSON.stringify(value));
      
      // Mock the getString to return the stored value
      storage.getString = jest.fn().mockReturnValue(JSON.stringify(value));
      
      const retrieved = getItem(key);
      expect(retrieved).toEqual(value);
    });

    it('should set and get secure item', async () => {
      const key = 'secure-key';
      const value = { secret: 'data' };
      
      await setItem(key, value, true);
      expect(secureStorage.set).toHaveBeenCalledWith(key, JSON.stringify(value));
      
      // Mock the getString to return the stored value
      secureStorage.getString = jest.fn().mockReturnValue(JSON.stringify(value));
      
      const retrieved = getItem(key, true);
      expect(retrieved).toEqual(value);
    });

    it('should return null for non-existent item', () => {
      storage.getString = jest.fn().mockReturnValue(undefined);
      
      const result = getItem('non-existent');
      expect(result).toBeNull();
    });

    it('should handle invalid JSON gracefully', () => {
      storage.getString = jest.fn().mockReturnValue('invalid json');
      
      const result = getItem('bad-json');
      expect(result).toBeNull();
    });

    it('should remove item', async () => {
      const key = 'remove-key';
      
      await removeItem(key);
      expect(storage.delete).toHaveBeenCalledWith(key);
    });

    it('should remove secure item', async () => {
      const key = 'secure-remove-key';
      
      await removeItem(key, true);
      expect(secureStorage.delete).toHaveBeenCalledWith(key);
    });
  });

  describe('Utility Functions', () => {
    it('should get all keys', () => {
      storage.getAllKeys = jest.fn().mockReturnValue(['key1', 'key2']);
      
      const keys = getAllKeys();
      expect(keys).toEqual(['key1', 'key2']);
      expect(storage.getAllKeys).toHaveBeenCalled();
    });

    it('should get all secure keys', () => {
      secureStorage.getAllKeys = jest.fn().mockReturnValue(['secure1', 'secure2']);
      
      const keys = getAllKeys(true);
      expect(keys).toEqual(['secure1', 'secure2']);
      expect(secureStorage.getAllKeys).toHaveBeenCalled();
    });

    it('should clear all storage', () => {
      clearAll();
      expect(storage.clearAll).toHaveBeenCalled();
    });

    it('should clear all secure storage', () => {
      clearAll(true);
      expect(secureStorage.clearAll).toHaveBeenCalled();
    });

    it('should check if key exists', () => {
      storage.contains = jest.fn().mockReturnValue(true);
      
      const exists = contains('test-key');
      expect(exists).toBe(true);
      expect(storage.contains).toHaveBeenCalledWith('test-key');
    });

    it('should check if secure key exists', () => {
      secureStorage.contains = jest.fn().mockReturnValue(false);
      
      const exists = contains('secure-key', true);
      expect(exists).toBe(false);
      expect(secureStorage.contains).toHaveBeenCalledWith('secure-key');
    });
  });

  describe('Storage Keys', () => {
    it('should have all required storage keys', () => {
      expect(StorageKeys.AUTH_TOKEN).toBe('auth_token');
      expect(StorageKeys.USER_DATA).toBe('user_data');
      expect(StorageKeys.SESSION).toBe('session');
      expect(StorageKeys.THEME).toBe('theme');
      expect(StorageKeys.LANGUAGE).toBe('language');
      expect(StorageKeys.OFFLINE_QUEUE).toBe('offline_queue');
      expect(StorageKeys.LAST_SYNC).toBe('last_sync');
    });
  });

  describe('TypedStorage Class', () => {
    it('should get value with default', () => {
      storage.getString = jest.fn().mockReturnValue(null);
      
      const result = TypedStorage.get('missing-key', 'default-value');
      expect(result).toBe('default-value');
    });

    it('should get value without default', () => {
      storage.getString = jest.fn().mockReturnValue(JSON.stringify('stored-value'));
      
      const result = TypedStorage.get('existing-key');
      expect(result).toBe('stored-value');
    });

    it('should set value', async () => {
      await TypedStorage.set('typed-key', { typed: 'value' });
      expect(storage.set).toHaveBeenCalledWith('typed-key', JSON.stringify({ typed: 'value' }));
    });

    it('should remove value', async () => {
      await TypedStorage.remove('typed-key');
      expect(storage.delete).toHaveBeenCalledWith('typed-key');
    });

    it('should clear storage', () => {
      TypedStorage.clear();
      expect(storage.clearAll).toHaveBeenCalled();
    });

    it('should handle secure operations', async () => {
      await TypedStorage.set('secure-typed', 'secret', true);
      expect(secureStorage.set).toHaveBeenCalledWith('secure-typed', JSON.stringify('secret'));
      
      await TypedStorage.remove('secure-typed', true);
      expect(secureStorage.delete).toHaveBeenCalledWith('secure-typed');
      
      TypedStorage.clear(true);
      expect(secureStorage.clearAll).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle errors in getItem', () => {
      storage.getString = jest.fn().mockImplementation(() => {
        throw new Error('Storage error');
      });
      
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      const result = getItem('error-key');
      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(
        '[Storage] Error getting item error-key:',
        expect.any(Error)
      );
      
      consoleSpy.mockRestore();
    });

    it('should handle errors in setItem', async () => {
      storage.set = jest.fn().mockImplementation(() => {
        throw new Error('Storage error');
      });
      
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      await expect(setItem('error-key', 'value')).rejects.toThrow('Storage error');
      expect(consoleSpy).toHaveBeenCalledWith(
        '[Storage] Error setting item error-key:',
        expect.any(Error)
      );
      
      consoleSpy.mockRestore();
    });

    it('should handle errors in removeItem', async () => {
      storage.delete = jest.fn().mockImplementation(() => {
        throw new Error('Storage error');
      });
      
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      await expect(removeItem('error-key')).rejects.toThrow('Storage error');
      expect(consoleSpy).toHaveBeenCalledWith(
        '[Storage] Error removing item error-key:',
        expect.any(Error)
      );
      
      consoleSpy.mockRestore();
    });
  });
});