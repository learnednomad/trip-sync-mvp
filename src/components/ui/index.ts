/**
 * UI Components Export
 * Essential UI components for Trip Sync
 */

// Re-export existing components from their files
export { PlatformButton, type PlatformButtonProps } from './PlatformButton';
export { Input } from './input';
export { Text } from './text';
export { type OptionType } from './select';
export { View } from 'react-native';
export { ScrollView } from 'react-native';
export { SafeAreaView } from 'react-native-safe-area-context';
export { ActivityIndicator } from 'react-native';
export { StatusBar as FocusAwareStatusBar } from 'expo-status-bar';
export { Image } from 'react-native';
export { Pressable } from 'react-native';
// Note: ControlledInput needs to be implemented separately as a wrapper component
export { default as colors } from './colors';
export { showErrorMessage } from './utils';

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