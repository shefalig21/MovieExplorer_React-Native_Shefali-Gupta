import { StackNavigationProp } from '@react-navigation/stack';

export type RootStackParamList = {
  Subscription: undefined;
  Payment: { checkoutUrl: string };
  // Main: undefined;
  Main: { screen?: string } | undefined;
  Login: undefined;
  Register: undefined;
  SplashScreen: undefined;
  Admin: undefined;
  Signup: undefined;
  AdminScreen: undefined;
  Profile: undefined;
  Success: undefined;
  Failure: undefined;
};


export type HeaderNavigationProp = StackNavigationProp<RootStackParamList>;

export type HeaderProps = {
  navigation: HeaderNavigationProp;
};


import type { NavigationProp } from '@react-navigation/native';

export type RootNavigationProp = NavigationProp<RootStackParamList>;


import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type SubscriptionScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Subscription'
>;