/**
 * UI Components Export
 * Essential UI components for Trip Sync
 */

// Re-export existing components from their files
export { PlatformButton, type PlatformButtonProps } from './PlatformButton';
export { Input } from './Input';
export { Text } from './Text';
export { View } from './View';
export { ScrollView } from './ScrollView';
export { SafeAreaView } from './SafeAreaView';
export { ActivityIndicator } from './ActivityIndicator';
export { FocusAwareStatusBar } from './FocusAwareStatusBar';
export { ControlledInput } from './ControlledInput';
export { colors } from './colors';
export { showErrorMessage } from './toast';

// MVP Components
export { Button } from './button';
export { Card } from './card';
export { Modal, useModal } from './modal';
export { MVPButton } from './MVPButton';
export { MVPTextInput as TextInput } from './MVPTextInput';
export { MVPCard } from './MVPCard';
export { MVPModal } from './MVPModal';
export { MVPLoadingSpinner as LoadingSpinner } from './LoadingSpinner';
export { MVPErrorState as ErrorState } from './ErrorState';