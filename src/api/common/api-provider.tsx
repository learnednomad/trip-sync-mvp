import { useReactQueryDevTools } from '@dev-plugins/react-query';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as React from 'react';

export const queryClient = new QueryClient();

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
