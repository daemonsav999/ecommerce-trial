import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface GroupBuyCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    groupPrice: number;
    image: string;
    membersNeeded: number;
    currentMembers: number;
    timeLeft: number;
  };
}

export const GroupBuyCard: React.FC<GroupBuyCardProps> = ({ product }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => navigation.navigate('GroupBuyDetails', { productId: product.id })}
    >
      <Image source={{ uri: product.image }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{product.name}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.groupPrice}>¥{product.groupPrice}</Text>
          <Text style={styles.originalPrice}>¥{product.price}</Text>
        </View>
        <View style={styles.groupInfo}>
          <Text>{product.currentMembers}/{product.membersNeeded} joined</Text>
          <Text>{Math.floor(product.timeLeft / 3600)}h left</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 8,
    borderRadius: 8,
    elevation: 2,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  groupPrice: {
    fontSize: 18,
    color: '#ff4d4f',
    fontWeight: 'bold',
  },
  originalPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
    marginLeft: 8,
  },
  groupInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
});