import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ProductDetailScreen } from '../pages/product-detail/ProductDetailScreen';

const Stack = createStackNavigator();

export const ProductStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{
          headerShown: true,
          headerBackTitleVisible: false,
          title: 'Product Details'
        }}
      />
      {/* Add other product-related screens here */}
    </Stack.Navigator>
  );
};