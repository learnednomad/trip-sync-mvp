import { Link, Stack } from 'expo-router';
import { Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 }}>
        <Text style={{ marginBottom: 16, fontSize: 24, fontWeight: 'bold' }}>
          This screen doesn&apos;t exist.
        </Text>

        <Link href="/(tabs)" style={{ marginTop: 16 }}>
          <Text style={{ color: '#007AFF', textDecorationLine: 'underline' }}>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}
