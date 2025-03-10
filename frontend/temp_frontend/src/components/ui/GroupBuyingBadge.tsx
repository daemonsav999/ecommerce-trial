import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const GroupBuyingBadge = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Group Buy</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FF4D4F',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  text: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
});