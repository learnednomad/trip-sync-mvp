import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Card } from '@/components/ui/card';
import { MaterialIcons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const router = useRouter();

  const menuItems = [
    {
      title: 'Profile',
      icon: 'person',
      onPress: () => router.push('/(tabs)/settings/profile'),
    },
    {
      title: 'Notifications',
      icon: 'notifications',
      onPress: () => {},
    },
    {
      title: 'Privacy',
      icon: 'lock',
      onPress: () => {},
    },
    {
      title: 'About',
      icon: 'info',
      onPress: () => {},
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        {menuItems.map((item, index) => (
          <TouchableOpacity key={index} onPress={item.onPress}>
            <Card style={styles.menuItem}>
              <MaterialIcons name={item.icon as any} size={24} color="#666" />
              <Text style={styles.menuText}>{item.title}</Text>
              <MaterialIcons name="chevron-right" size={24} color="#666" />
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 8,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
  },
});
