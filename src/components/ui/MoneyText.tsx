import React from 'react';
import { Text, TextStyle } from 'react-native';
import { formatPrice } from '../../utils/format';

interface MoneyTextProps {
  value: number;
  size?: 'small' | 'medium' | 'large';
  style?: TextStyle;
  textDecorationLine?: 'none' | 'line-through' | 'underline';
}

export const MoneyText = ({ 
  value,
  size = 'medium',
  style,
  textDecorationLine = 'none'
}: MoneyTextProps) => {
  const fontSize = {
    small: 14,
    medium: 16,
    large: 28,
  }[size];

  return (
    <Text
      style={[
        {
          fontSize,
          textDecorationLine,
        },
        style,
      ]}
    >
      ¥{formatPrice(value)}
    </Text>
  );
};