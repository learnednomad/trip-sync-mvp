import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

/**
 * Type definitions for Expo Router navigation
 * Following Expo Router v3 conventions
 */

// Root Stack Types
export type RootStackParamList = {
  '(tabs)': undefined;
  '(auth)': undefined;
  '[...missing]': undefined;
};

// Auth Stack Types
export type AuthStackParamList = {
  'sign-in': undefined;
  'sign-up': undefined;
  'forgot-password': undefined;
};

// Tab Navigator Types
export type TabParamList = {
  home: undefined;
  trips: undefined;
  explore: undefined;
  settings: undefined;
};

// Home Stack Types
export type HomeStackParamList = {
  index: undefined;
  notifications: undefined;
};

// Trips Stack Types
export type TripsStackParamList = {
  index: undefined;
  '[id]': {
    index: { id: string };
    expenses: { id: string };
  };
};

// Explore Stack Types
export type ExploreStackParamList = {
  index: undefined;
  '[id]': { id: string };
};

// Settings Stack Types
export type SettingsStackParamList = {
  index: undefined;
  profile: undefined;
};

// Navigation Prop Types
export type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;
export type AuthNavigationProp = NativeStackNavigationProp<AuthStackParamList>;
export type HomeNavigationProp = NativeStackNavigationProp<HomeStackParamList>;
export type TripsNavigationProp = NativeStackNavigationProp<TripsStackParamList>;
export type ExploreNavigationProp = NativeStackNavigationProp<ExploreStackParamList>;
export type SettingsNavigationProp = NativeStackNavigationProp<SettingsStackParamList>;

// Route Prop Types
export type HomeRouteProp<T extends keyof HomeStackParamList> = RouteProp<
  HomeStackParamList,
  T
>;
export type TripsRouteProp<T extends keyof TripsStackParamList> = RouteProp<
  TripsStackParamList,
  T
>;
export type ExploreRouteProp<T extends keyof ExploreStackParamList> = RouteProp<
  ExploreStackParamList,
  T
>;
export type SettingsRouteProp<T extends keyof SettingsStackParamList> = RouteProp<
  SettingsStackParamList,
  T
>;

// Shared Screen Params (for future modal/shared routes)
export type SharedScreenParams = {
  userProfile: { userId: string };
  tripDetail: { tripId: string; isPublic?: boolean };
  expenseDetail: { expenseId: string; tripId: string };
};

// Deep Link Types
export type DeepLinkParams = {
  trip: { id: string };
  expense: { tripId: string; expenseId: string };
  profile: { userId?: string };
  invite: { code: string };
};