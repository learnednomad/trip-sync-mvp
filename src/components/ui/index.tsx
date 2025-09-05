import { cssInterop } from 'nativewind';
import Svg from 'react-native-svg';

// Legacy components (maintained for backward compatibility)
export * from './button';
export * from './checkbox';
export { default as colors } from './colors';
export * from './focus-aware-status-bar';
export * from './image';
export * from './input';
export * from './list';
export * from './modal';
export * from './progress-bar';
export * from './select';
export * from './text';
export * from './utils';
export * from './empty-list';

// New platform-specific components
export * from './PlatformButton';
export * from './card';
export * from './navigation';

// Export theme utilities
export * from '../../core/theme';

// export base components from react-native
export {
  ActivityIndicator,
  Pressable,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
export { SafeAreaView } from 'react-native-safe-area-context';

//Apply cssInterop to Svg to resolve className string into style
cssInterop(Svg, {
  className: {
    target: 'style',
  },
});
