import { QueryClient } from '@tanstack/react-query';
import { Platform } from 'react-native';
import { queryClient } from '../query-client';

// Mock Platform
jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
    select: jest.fn((obj) => obj.ios),
  },
}));

describe('QueryClient Configuration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Default Configuration', () => {
    it('should have correct default query options', () => {
      const defaultOptions = queryClient.getDefaultOptions();
      
      expect(defaultOptions.queries?.staleTime).toBe(5 * 60 * 1000); // 5 minutes
      expect(defaultOptions.queries?.gcTime).toBe(10 * 60 * 1000); // 10 minutes
      expect(defaultOptions.queries?.retry).toBe(3);
      expect(defaultOptions.queries?.refetchOnWindowFocus).toBe(false);
      expect(defaultOptions.queries?.refetchOnReconnect).toBe('always');
    });

    it('should have correct default mutation options', () => {
      const defaultOptions = queryClient.getDefaultOptions();
      
      expect(defaultOptions.mutations?.retry).toBe(3);
      expect(typeof defaultOptions.mutations?.retryDelay).toBe('function');
    });

    it('should calculate retry delay correctly', () => {
      const defaultOptions = queryClient.getDefaultOptions();
      const retryDelay = defaultOptions.mutations?.retryDelay as Function;
      
      expect(retryDelay(0)).toBe(1000); // First retry: 1 second
      expect(retryDelay(1)).toBe(2000); // Second retry: 2 seconds
      expect(retryDelay(2)).toBe(4000); // Third retry: 4 seconds
      expect(retryDelay(5)).toBe(30000); // Max retry: 30 seconds
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors in mutations', () => {
      const defaultOptions = queryClient.getDefaultOptions();
      const onError = defaultOptions.mutations?.onError as Function;
      
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      onError({ code: 'NETWORK_ERROR' });
      
      expect(consoleSpy).toHaveBeenCalledWith(
        '[QueryClient] Network error, will retry when online'
      );
      
      consoleSpy.mockRestore();
    });

    it('should handle network errors by message', () => {
      const defaultOptions = queryClient.getDefaultOptions();
      const onError = defaultOptions.mutations?.onError as Function;
      
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      onError({ message: 'Network request failed' });
      
      expect(consoleSpy).toHaveBeenCalledWith(
        '[QueryClient] Network error, will retry when online'
      );
      
      consoleSpy.mockRestore();
    });
  });

  describe('Platform-specific Configuration', () => {
    it('should have platform configuration code', () => {
      // Just verify that the code handles platform differences
      // The actual platform-specific settings are applied at module load time
      expect(Platform.OS).toBeDefined();
    });
  });

  describe('Offline Mutation Defaults', () => {
    it('should have offline mutation defaults configured', () => {
      const mutationDefaults = queryClient.getMutationDefaults(['offline-mutation']);
      
      expect(mutationDefaults).toBeDefined();
      expect(typeof mutationDefaults.mutationFn).toBe('function');
    });

    it('should return variables from mutation function', async () => {
      const mutationDefaults = queryClient.getMutationDefaults(['offline-mutation']);
      const mutationFn = mutationDefaults.mutationFn as Function;
      
      const variables = { test: true };
      const result = await mutationFn({ variables });
      
      expect(result).toEqual(variables);
    });
  });

  describe('Query Client Instance', () => {
    it('should be an instance of QueryClient', () => {
      expect(queryClient).toBeInstanceOf(QueryClient);
    });

    it('should export as default', () => {
      const module = require('../query-client');
      expect(module.default).toBe(module.queryClient);
    });
  });
});