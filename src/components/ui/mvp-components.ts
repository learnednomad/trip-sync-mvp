/**
 * MVP UI Components Export
 * Essential UI components for Trip Sync MVP
 * 
 * These components follow MVP constraints:
 * - NO platform-specific styling
 * - NO complex variants
 * - Simple, focused functionality
 * - Identical behavior on iOS and Android
 */

// MVP Components with renamed exports to avoid conflicts
export { MVPButton } from './MVPButton';
export { MVPTextInput } from './MVPTextInput';
export { MVPCard } from './MVPCard';
export { MVPModal } from './MVPModal';
export { MVPLoadingSpinner as LoadingSpinner } from './LoadingSpinner';
export { MVPErrorState as ErrorState } from './ErrorState';