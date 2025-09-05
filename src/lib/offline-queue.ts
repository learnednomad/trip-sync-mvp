import { MMKV } from 'react-native-mmkv';
import { StorageKeys } from './storage';

// Offline queue storage
const queueStorage = new MMKV({
  id: 'offline-queue',
  encryptionKey: 'offline-queue-key',
});

export interface QueueItem {
  id: string;
  timestamp: string;
  type: 'mutation' | 'query';
  operation: string;
  variables: any;
  retryCount: number;
  maxRetries: number;
  lastError?: string;
}

export class OfflineQueue {
  private static QUEUE_KEY = StorageKeys.OFFLINE_QUEUE;
  private static MAX_RETRIES = 3;

  // Get all queued items
  static getQueue(): QueueItem[] {
    try {
      const queueString = queueStorage.getString(this.QUEUE_KEY);
      return queueString ? JSON.parse(queueString) : [];
    } catch (error) {
      console.error('[OfflineQueue] Error getting queue:', error);
      return [];
    }
  }

  // Save queue to storage
  private static saveQueue(queue: QueueItem[]): void {
    try {
      queueStorage.set(this.QUEUE_KEY, JSON.stringify(queue));
    } catch (error) {
      console.error('[OfflineQueue] Error saving queue:', error);
    }
  }

  // Add item to queue
  static add(item: Omit<QueueItem, 'id' | 'timestamp' | 'retryCount' | 'maxRetries'>): void {
    const queue = this.getQueue();
    const newItem: QueueItem = {
      ...item,
      id: `queue_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      retryCount: 0,
      maxRetries: this.MAX_RETRIES,
    };
    
    queue.push(newItem);
    this.saveQueue(queue);
    
    console.log(`[OfflineQueue] Added item ${newItem.id} to queue`);
  }

  // Remove item from queue
  static remove(id: string): void {
    const queue = this.getQueue();
    const filtered = queue.filter(item => item.id !== id);
    this.saveQueue(filtered);
    
    console.log(`[OfflineQueue] Removed item ${id} from queue`);
  }

  // Update retry count
  static incrementRetry(id: string, error?: string): void {
    const queue = this.getQueue();
    const item = queue.find(i => i.id === id);
    
    if (item) {
      item.retryCount++;
      item.lastError = error;
      
      if (item.retryCount >= item.maxRetries) {
        console.log(`[OfflineQueue] Item ${id} exceeded max retries, removing from queue`);
        this.remove(id);
      } else {
        this.saveQueue(queue);
        console.log(`[OfflineQueue] Incremented retry count for ${id} to ${item.retryCount}`);
      }
    }
  }

  // Process queue (called when coming back online)
  static async processQueue(
    processor: (item: QueueItem) => Promise<void>
  ): Promise<void> {
    const queue = this.getQueue();
    console.log(`[OfflineQueue] Processing ${queue.length} queued items`);
    
    for (const item of queue) {
      try {
        await processor(item);
        this.remove(item.id);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`[OfflineQueue] Failed to process item ${item.id}:`, errorMessage);
        this.incrementRetry(item.id, errorMessage);
      }
    }
  }

  // Clear entire queue
  static clear(): void {
    try {
      queueStorage.delete(this.QUEUE_KEY);
      console.log('[OfflineQueue] Queue cleared');
    } catch (error) {
      console.error('[OfflineQueue] Error clearing queue:', error);
    }
  }

  // Get queue size
  static size(): number {
    return this.getQueue().length;
  }

  // Check if queue has items
  static hasItems(): boolean {
    return this.size() > 0;
  }

  // Get items by type
  static getByType(type: 'mutation' | 'query'): QueueItem[] {
    return this.getQueue().filter(item => item.type === type);
  }

  // Get failed items (with errors)
  static getFailedItems(): QueueItem[] {
    return this.getQueue().filter(item => item.lastError && item.retryCount > 0);
  }
}

// Export for use in other modules
export default OfflineQueue;