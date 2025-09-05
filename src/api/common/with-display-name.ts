/**
 * Helper function to safely set displayName on react-query-kit hooks
 * Works around potential issues with frozen objects or strict mode
 */
export function withDisplayName<T extends (...args: any[]) => any>(
  hook: T,
  displayName: string
): T {
  // If something unexpected passed in, do nothing
  if (!hook) return hook;
  try {
    // First, try direct assignment
    (hook as any).displayName = displayName;
  } catch (error) {
    try {
      // If direct assignment fails, try Object.defineProperty
      Object.defineProperty(hook, 'displayName', {
        value: displayName,
        writable: true,
        enumerable: false,
        configurable: true,
      });
    } catch (defineError) {
      // If both methods fail, create a wrapper function
      const wrapper = Object.assign(
        (...args: Parameters<T>) => hook(...args),
        hook
      ) as T;
      (wrapper as any).displayName = displayName;
      return wrapper;
    }
  }
  
  return hook;
}
