import { useReactQueryDevTools } from '@dev-plugins/react-query';
import { QueryClientProvider } from '@tanstack/react-query';
import * as React from 'react';
import { queryClient } from '@/lib/query-client';

export function APIProvider({ children }: { children: React.ReactNode }) {
  // Guard devtools initialization to avoid crashing in edge environments
  try {
    useReactQueryDevTools(queryClient);
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn('React Query DevTools init failed:', e);
    }
  }
  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
