import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from '../../../components/ui/Button';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';

interface BuyButtonsProps {
  product: {
    id: string;
    price: number;
  };
  groupBuyingDetails?: {
    id: string;
    groupPrice: number;
  };
}

export const BuyButtons = ({ product, groupBuyingDetails }: BuyButtonsProps) => {
  const navigation = useNavigation();

  const handleBuyNow = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate('Checkout', { 
      productId: product.id,
      type: 'single'
    });
  };

  const handleStartTeamBuy = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate('Checkout', {
      productId: product.id,
      type: 'team',
      groupId: groupBuyingDetails?.id
    });
  };

  return (
    <View style={styles.container}>
      <Button 
        title="Buy Now"
        onPress={handleBuyNow}
        style={[styles.button, styles.buyNowButton]}
      />
      <Button
        title="Start Team Buy"
        onPress={handleStartTeamBuy}
        style={[styles.button, styles.teamBuyButton]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  button: {
    flex: 1,
    borderRadius: 24,
  },
  buyNowButton: {
    backgroundColor: '#FF4D4F',
  },
  teamBuyButton: {
    backgroundColor: '#FFA940',
  }
});