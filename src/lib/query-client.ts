import { QueryClient } from '@tanstack/react-query';
import { Platform } from 'react-native';

// Create a query client with MVP-appropriate defaults
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 5 minute cache as per story requirements
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000, // garbage collection time (formerly cacheTime)
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always',
      // Network-aware refetch
      enabled: true,
    },
    mutations: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Handle network errors
      onError: (error: any) => {
        if (error?.code === 'NETWORK_ERROR' || error?.message?.includes('Network')) {
          // Will be queued by offline manager
          console.log('[QueryClient] Network error, will retry when online');
        }
      },
    },
  },
});

// Global error handler for offline mutations
queryClient.setMutationDefaults(['offline-mutation'], {
  mutationFn: async ({ variables }: any) => {
    // For MVP, we'll rely on the offline queue to handle network issues
    return variables;
  },
});

// Platform-specific optimizations
if (Platform.OS === 'android') {
  // Android-specific settings
  queryClient.setDefaultOptions({
    queries: {
      // Slightly longer cache for Android due to background restrictions
      staleTime: 6 * 60 * 1000,
    },
  });
}

export default queryClient;