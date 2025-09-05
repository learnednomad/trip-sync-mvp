import { Redirect } from 'expo-router';
import { useSupabaseAuth } from '@/lib/auth/supabase-auth';

/**
 * Root index route - acts as a fallback and initial router
 * This helps handle navigation edge cases and hot reload scenarios
 */
export default function Index() {
  const isAuthenticated = useSupabaseAuth.use.isAuthenticated();
  const isLoading = useSupabaseAuth.use.isLoading();

  // Wait for auth state to be determined
  if (isLoading) {
    return null;
  }

  // Redirect based on authentication state
  if (isAuthenticated) {
    return <Redirect href="/(tabs)/home" />;
  } else {
    return <Redirect href="/(auth)/sign-in" />;
  }
}