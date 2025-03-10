import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MoneyText } from '../ui/MoneyText';
import { GroupBuyingBadge } from '../ui/GroupBuyingBadge';
import { formatPrice } from '../../utils/format';

interface PriceSectionProps {
  regularPrice: number;
  groupPrice: number;
  teamPrice?: number;
}

export const PriceSection = ({ 
  regularPrice, 
  groupPrice, 
  teamPrice 
}: PriceSectionProps) => {
  const discount = Math.round(
    ((regularPrice - groupPrice) / regularPrice) * 100
  );

  return (
    <View style={styles.container}>
      <View style={styles.mainPrice}>
        <MoneyText 
          value={groupPrice}
          size="large"
          style={styles.groupPrice}
        />
        <GroupBuyingBadge />
      </View>

      <View style={styles.regularPriceContainer}>
        <Text style={styles.regularPriceLabel}>Original Price: </Text>
        <MoneyText 
          value={regularPrice}
          style={styles.regularPrice}
          textDecorationLine="line-through"
        />
      </View>

      {teamPrice && (
        <View style={styles.teamPriceContainer}>
          <Text style={styles.teamPriceLabel}>
            Team Buy Price (3+ people):
          </Text>
          <MoneyText 
            value={teamPrice}
            style={styles.teamPrice}
          />
        </View>
      )}

      <View style={styles.savingsContainer}>
        <Text style={styles.savingsText}>
          Save {discount}% with Group Buying!
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#FFF8F8',
    borderRadius: 12,
    gap: 8,
  },
  mainPrice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  groupPrice: {
    color: '#FF4D4F',
    fontSize: 28,
    fontWeight: 'bold',
  },
  regularPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  regularPriceLabel: {
    color: '#666',
    fontSize: 14,
  },
  regularPrice: {
    color: '#999',
    fontSize: 14,
  },
  teamPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF0F0',
    padding: 8,
    borderRadius: 8,
  },
  teamPriceLabel: {
    color: '#666',
    fontSize: 14,
  },
  teamPrice: {
    color: '#FF4D4F',
    fontSize: 16,
    fontWeight: 'bold',
  },
  savingsContainer: {
    marginTop: 4,
  },
  savingsText: {
    color: '#FF4D4F',
    fontSize: 14,
    fontWeight: '500',
  },
});