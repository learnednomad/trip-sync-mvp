import { Stack } from 'expo-router';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function TripsLayout() {
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
          title: 'My Trips',
        }}
      />
      <Stack.Screen
        name="[id]/index"
        options={{
          title: 'Trip Details',
        }}
      />
      <Stack.Screen
        name="[id]/expenses"
        options={{
          title: 'Trip Expenses',
        }}
      />
    </Stack>
  );
}
