import { MMKV } from 'react-native-mmkv';
import { StorageKeys } from '../storage';

// Create a mock store outside to persist data between calls
const mockStore = new Map();

// Mock MMKV before any imports
jest.mock('react-native-mmkv', () => {
  return {
    MMKV: jest.fn().mockImplementation(() => ({
      getString: jest.fn((key) => mockStore.get(key)),
      set: jest.fn((key, value) => {
        mockStore.set(key, value);
      }),
      delete: jest.fn((key) => {
        mockStore.delete(key);
      }),
      getAllKeys: jest.fn(() => Array.from(mockStore.keys())),
      clearAll: jest.fn(() => mockStore.clear()),
      contains: jest.fn((key) => mockStore.has(key)),
    })),
  };
});

// Import after mocking
import { OfflineQueue } from '../offline-queue';

describe('OfflineQueue', () => {
  let consoleSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    // Clear the mock store before each test
    mockStore.clear();
    jest.clearAllMocks();
    
    // Mock console methods
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  describe('getQueue', () => {
    it('should return empty array when queue is empty', () => {
      const queue = OfflineQueue.getQueue();
      expect(queue).toEqual([]);
    });

    it('should return parsed queue items', () => {
      const mockQueueData = [
        { id: 'queue_1', type: 'mutation', operation: 'createTrip' }
      ];
      mockStore.set(StorageKeys.OFFLINE_QUEUE, JSON.stringify(mockQueueData));
      
      const queue = OfflineQueue.getQueue();
      expect(queue).toEqual(mockQueueData);
    });

    it('should return empty array on parse error', () => {
      mockStore.set(StorageKeys.OFFLINE_QUEUE, 'invalid json');
      
      const queue = OfflineQueue.getQueue();
      expect(queue).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[OfflineQueue] Error getting queue:',
        expect.any(Error)
      );
    });
  });

  describe('add', () => {
    it('should add item to queue with generated fields', () => {
      const mockItem = {
        type: 'mutation' as const,
        operation: 'createTrip',
        variables: { name: 'Test Trip' }
      };
      
      OfflineQueue.add(mockItem);
      
      const savedData = JSON.parse(mockStore.get(StorageKeys.OFFLINE_QUEUE) || '[]');
      expect(savedData).toHaveLength(1);
      expect(savedData[0]).toMatchObject({
        ...mockItem,
        retryCount: 0,
        maxRetries: 3
      });
      expect(savedData[0].id).toMatch(/^queue_\d+_[a-z0-9]+$/);
      expect(savedData[0].timestamp).toBeTruthy();
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('[OfflineQueue] Added item'));
    });

    it('should append to existing queue', () => {
      const existingItem = {
        id: 'existing_1',
        type: 'query',
        operation: 'fetchTrips',
        variables: {},
        retryCount: 1,
        maxRetries: 3,
        timestamp: '2023-01-01T00:00:00.000Z'
      };
      
      mockStore.set(StorageKeys.OFFLINE_QUEUE, JSON.stringify([existingItem]));
      
      const newItem = {
        type: 'mutation' as const,
        operation: 'updateTrip',
        variables: { id: '123', name: 'Updated' }
      };
      
      OfflineQueue.add(newItem);
      
      const savedData = JSON.parse(mockStore.get(StorageKeys.OFFLINE_QUEUE) || '[]');
      expect(savedData).toHaveLength(2);
      expect(savedData[0]).toEqual(existingItem);
      expect(savedData[1]).toMatchObject(newItem);
    });
  });

  describe('remove', () => {
    it('should remove item from queue', () => {
      const mockQueue = [
        { id: 'queue_1', type: 'mutation', operation: 'op1' },
        { id: 'queue_2', type: 'query', operation: 'op2' },
        { id: 'queue_3', type: 'mutation', operation: 'op3' }
      ];
      
      mockStore.set(StorageKeys.OFFLINE_QUEUE, JSON.stringify(mockQueue));
      
      OfflineQueue.remove('queue_2');
      
      const savedData = JSON.parse(mockStore.get(StorageKeys.OFFLINE_QUEUE) || '[]');
      expect(savedData).toHaveLength(2);
      expect(savedData.find((item: any) => item.id === 'queue_2')).toBeUndefined();
      expect(consoleSpy).toHaveBeenCalledWith('[OfflineQueue] Removed item queue_2 from queue');
    });

    it('should handle removing non-existent item', () => {
      OfflineQueue.remove('non_existent');
      expect(consoleSpy).toHaveBeenCalledWith('[OfflineQueue] Removed item non_existent from queue');
    });
  });

  describe('incrementRetry', () => {
    it('should increment retry count and update error', () => {
      const mockQueue = [
        {
          id: 'queue_1',
          type: 'mutation',
          operation: 'createTrip',
          retryCount: 0,
          maxRetries: 3,
          timestamp: '2023-01-01T00:00:00.000Z'
        }
      ];
      
      mockStore.set(StorageKeys.OFFLINE_QUEUE, JSON.stringify(mockQueue));
      
      OfflineQueue.incrementRetry('queue_1', 'Network error');
      
      const savedData = JSON.parse(mockStore.get(StorageKeys.OFFLINE_QUEUE) || '[]');
      expect(savedData[0].retryCount).toBe(1);
      expect(savedData[0].lastError).toBe('Network error');
      expect(consoleSpy).toHaveBeenCalledWith(
        '[OfflineQueue] Incremented retry count for queue_1 to 1'
      );
    });

    it('should remove item when max retries exceeded', () => {
      const mockQueue = [
        {
          id: 'queue_1',
          type: 'mutation',
          operation: 'createTrip',
          retryCount: 2,
          maxRetries: 3,
          timestamp: '2023-01-01T00:00:00.000Z'
        }
      ];
      
      mockStore.set(StorageKeys.OFFLINE_QUEUE, JSON.stringify(mockQueue));
      
      // This call will increment to 3, which equals maxRetries
      OfflineQueue.incrementRetry('queue_1', 'Final error');
      
      const savedData = JSON.parse(mockStore.get(StorageKeys.OFFLINE_QUEUE) || '[]');
      expect(savedData).toHaveLength(0);
      expect(consoleSpy).toHaveBeenCalledWith(
        '[OfflineQueue] Item queue_1 exceeded max retries, removing from queue'
      );
    });

    it('should handle incrementing non-existent item', () => {
      OfflineQueue.incrementRetry('non_existent');
      // Should not crash, just return silently
      expect(mockStore.get(StorageKeys.OFFLINE_QUEUE)).toBeUndefined();
    });
  });

  describe('processQueue', () => {
    it('should process all items successfully', async () => {
      const mockQueue = [
        { id: 'queue_1', type: 'mutation', operation: 'op1' },
        { id: 'queue_2', type: 'query', operation: 'op2' }
      ];
      
      mockStore.set(StorageKeys.OFFLINE_QUEUE, JSON.stringify(mockQueue));
      
      const processor = jest.fn().mockResolvedValue(undefined);
      
      await OfflineQueue.processQueue(processor);
      
      expect(processor).toHaveBeenCalledTimes(2);
      expect(processor).toHaveBeenCalledWith(mockQueue[0]);
      expect(processor).toHaveBeenCalledWith(mockQueue[1]);
      expect(consoleSpy).toHaveBeenCalledWith('[OfflineQueue] Processing 2 queued items');
      
      // All items should be removed after successful processing
      const remaining = JSON.parse(mockStore.get(StorageKeys.OFFLINE_QUEUE) || '[]');
      expect(remaining).toHaveLength(0);
    });

    it('should handle processing errors and increment retry', async () => {
      const mockQueue = [
        {
          id: 'queue_1',
          type: 'mutation',
          operation: 'failingOp',
          retryCount: 0,
          maxRetries: 3,
          variables: {},
          timestamp: '2023-01-01T00:00:00.000Z'
        }
      ];
      
      mockStore.set(StorageKeys.OFFLINE_QUEUE, JSON.stringify(mockQueue));
      
      const processor = jest.fn().mockRejectedValue(new Error('Processing failed'));
      
      await OfflineQueue.processQueue(processor);
      
      expect(processor).toHaveBeenCalledWith(mockQueue[0]);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[OfflineQueue] Failed to process item queue_1:',
        'Processing failed'
      );
      
      // Item should still be in queue with incremented retry count
      const remaining = JSON.parse(mockStore.get(StorageKeys.OFFLINE_QUEUE) || '[]');
      expect(remaining).toHaveLength(1);
      expect(remaining[0].retryCount).toBe(1);
    });

    it('should handle mixed success and failure', async () => {
      const mockQueue = [
        { id: 'queue_1', type: 'mutation', operation: 'successOp' },
        { id: 'queue_2', type: 'mutation', operation: 'failOp', retryCount: 0, maxRetries: 3 },
        { id: 'queue_3', type: 'query', operation: 'successOp2' }
      ];
      
      mockStore.set(StorageKeys.OFFLINE_QUEUE, JSON.stringify(mockQueue));
      
      const processor = jest.fn()
        .mockResolvedValueOnce(undefined) // First succeeds
        .mockRejectedValueOnce(new Error('Failed')) // Second fails
        .mockResolvedValueOnce(undefined); // Third succeeds
      
      await OfflineQueue.processQueue(processor);
      
      expect(processor).toHaveBeenCalledTimes(3);
      
      // Only the failed item should remain
      const remaining = JSON.parse(mockStore.get(StorageKeys.OFFLINE_QUEUE) || '[]');
      expect(remaining).toHaveLength(1);
      expect(remaining[0].id).toBe('queue_2');
    });
  });

  describe('utility methods', () => {
    describe('clear', () => {
      it('should clear the queue', () => {
        mockStore.set(StorageKeys.OFFLINE_QUEUE, JSON.stringify([{ id: '1' }]));
        
        OfflineQueue.clear();
        
        expect(mockStore.has(StorageKeys.OFFLINE_QUEUE)).toBe(false);
        expect(consoleSpy).toHaveBeenCalledWith('[OfflineQueue] Queue cleared');
      });

      it('should handle clear errors gracefully', () => {
        // Test that clear doesn't crash even if there's an issue
        OfflineQueue.clear();
        expect(consoleSpy).toHaveBeenCalledWith('[OfflineQueue] Queue cleared');
      });
    });

    describe('size', () => {
      it('should return queue size', () => {
        const mockQueue = [
          { id: '1' },
          { id: '2' },
          { id: '3' }
        ];
        mockStore.set(StorageKeys.OFFLINE_QUEUE, JSON.stringify(mockQueue));
        
        expect(OfflineQueue.size()).toBe(3);
      });

      it('should return 0 for empty queue', () => {
        expect(OfflineQueue.size()).toBe(0);
      });
    });

    describe('hasItems', () => {
      it('should return true when queue has items', () => {
        mockStore.set(StorageKeys.OFFLINE_QUEUE, JSON.stringify([{ id: '1' }]));
        
        expect(OfflineQueue.hasItems()).toBe(true);
      });

      it('should return false when queue is empty', () => {
        expect(OfflineQueue.hasItems()).toBe(false);
      });
    });

    describe('getByType', () => {
      it('should filter items by type', () => {
        const mockQueue = [
          { id: '1', type: 'mutation' },
          { id: '2', type: 'query' },
          { id: '3', type: 'mutation' },
          { id: '4', type: 'query' }
        ];
        mockStore.set(StorageKeys.OFFLINE_QUEUE, JSON.stringify(mockQueue));
        
        const mutations = OfflineQueue.getByType('mutation');
        expect(mutations).toHaveLength(2);
        expect(mutations.every(item => item.type === 'mutation')).toBe(true);
        
        const queries = OfflineQueue.getByType('query');
        expect(queries).toHaveLength(2);
        expect(queries.every(item => item.type === 'query')).toBe(true);
      });
    });

    describe('getFailedItems', () => {
      it('should return only failed items', () => {
        const mockQueue = [
          { id: '1', retryCount: 0 },
          { id: '2', retryCount: 1, lastError: 'Network error' },
          { id: '3', retryCount: 0 },
          { id: '4', retryCount: 2, lastError: 'Timeout' }
        ];
        mockStore.set(StorageKeys.OFFLINE_QUEUE, JSON.stringify(mockQueue));
        
        const failed = OfflineQueue.getFailedItems();
        expect(failed).toHaveLength(2);
        expect(failed[0].id).toBe('2');
        expect(failed[1].id).toBe('4');
      });

      it('should return empty array when no failed items', () => {
        const mockQueue = [
          { id: '1', retryCount: 0 },
          { id: '2', retryCount: 0 }
        ];
        mockStore.set(StorageKeys.OFFLINE_QUEUE, JSON.stringify(mockQueue));
        
        expect(OfflineQueue.getFailedItems()).toEqual([]);
      });
    });
  });
});