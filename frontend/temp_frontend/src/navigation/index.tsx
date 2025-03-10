import React from 'react';
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from 'react-native-paper';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';

import { ProductStack } from './ProductStack';
// Import your screens
import { HomeScreen } from '../screens/HomeScreen';
import { CategoryScreen } from '../screens/CategoryScreen';
import { CartScreen } from '../screens/CartScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { GroupBuyScreen } from '../screens/GroupBuyScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Web-specific navigation options
const webLinking = {
  prefixes: [
    'http://localhost:3000', 
    'https://yourdomain.com',
    // Add your production URLs here
  ],
  config: {
    screens: {
      Main: {
        screens: {
          Home: '',
          Categories: 'categories',
          GroupBuy: 'group-buy',
          Cart: 'cart',
          Profile: 'profile',
        },
      },
      ProductStack: {
        screens: {
          ProductDetail: 'product/:id',
          ProductList: 'products',
          ProductSearch: 'search',
        },
      },
    },
  },
};

const MainTabs = () => {
  const theme = useTheme();

  // Platform-specific tab bar styles
  const tabBarStyles = Platform.select({
    web: {
      tabBarStyle: {
        paddingTop: 10,
        height: 60,
        // Web-specific styles
        boxShadow: '0px -2px 10px rgba(0,0,0,0.1)',
      },
      labelStyle: {
        fontSize: 12,
        marginBottom: 5,
      },
    },
    default: {
      tabBarStyle: {
        paddingTop: 10,
        height: 60,
        // Mobile-specific styles
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      labelStyle: {
        fontSize: 12,
        marginBottom: 5,
      },
    },
  });

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.secondary,
        headerShown: false,
        ...tabBarStyles,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Categories"
        component={CategoryScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="view-grid" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="GroupBuy"
        component={GroupBuyScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="account-group" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="cart" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="account" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const RootNavigator = () => {
  // Platform-specific screen transitions
  const screenOptions = Platform.select({
    web: {
      // Disable animations on web for better performance
      animationEnabled: false,
      // Use modal presentation for better web UX
      presentation: 'modal' as const,
    },
    default: {
      // Use default native animations on mobile
      animationEnabled: true,
    },
  });

  return (
    <NavigationContainer
      linking={Platform.OS === 'web' ? webLinking : undefined}
      fallback={<LoadingScreen />} // Add a loading screen component
      documentTitle={{
        formatter: (options, route) => 
          `${options?.title ?? route?.name} - Your App Name`,
      }}
    >
      <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen
          name="Main"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ProductStack"
          component={ProductStack}
          options={{ headerShown: false }}
        />
        {/* Add other stacks here */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Add a simple loading screen component
const LoadingScreen = () => {
  const theme = useTheme();
  return (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center',
      backgroundColor: theme.colors.background,
    }}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  );
};

export default RootNavigator;