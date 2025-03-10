import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface OrderStatusProps {
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  style?: ViewStyle;
}

export const OrderStatus = ({ status, style }: OrderStatusProps) => {
  const statusConfig = {
    pending: {
      icon: 'time-outline',
      color: '#faad14',
      text: 'Payment Pending',
    },
    confirmed: {
      icon: 'checkmark-circle-outline',
      color: '#52c41a',
      text: 'Order Confirmed',
    },
    shipped: {
      icon: 'airplane-outline',
      color: '#1890ff',
      text: 'Order Shipped',
    },
    delivered: {
      icon: 'gift-outline',
      color: '#52c41a',
      text: 'Order Delivered',
    },
    cancelled: {
      icon: 'close-circle-outline',
      color: '#ff4d4f',
      text: 'Order Cancelled',
    },
  };

  const config = statusConfig[status];

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.iconContainer, { backgroundColor: config.color }]}>
        <Ionicons name={config.icon} size={24} color="#fff" />
      </View>
      <Text style={styles.status}>{config.text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 8,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  status: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});