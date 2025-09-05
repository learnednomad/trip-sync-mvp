import { Stack } from 'expo-router';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function ExploreLayout() {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor,
        },
        headerTintColor: textColor,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Explore',
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Public Trip',
        }}
      />
    </Stack>
  );
}
