import React, { useEffect } from 'react';
import { 
  View, 
  ScrollView, 
  Text, 
  StyleSheet, 
  Share, 
  Alert 
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { OrderStatus } from './components/OrderStatus';
import { PaymentInfo } from './components/PaymentInfo';
import { ShippingInfo } from './components/ShippingInfo';
import { GroupInvite } from './components/GroupInvite';
import { useOrder } from '../../hooks/useOrder';
import { Button } from '../../components/ui/Button';
import { useGroupBuying } from '../../hooks/useGroupBuying';
import { formatPrice } from '../../utils/format';
import * as Haptics from 'expo-haptics';

type OrderConfirmationRouteProp = RouteProp<{
  OrderConfirmation: {
    orderId: string;
    type: 'single' | 'team';
  };
}, 'OrderConfirmation'>;

export const OrderConfirmationScreen = () => {
  const route = useRoute<OrderConfirmationRouteProp>();
  const navigation = useNavigation();
  const { orderId, type } = route.params;

  const { 
    orderDetails,
    loading: orderLoading,
    error: orderError 
  } = useOrder(orderId);

  const {
    groupDetails,
    loading: groupLoading,
    error: groupError
  } = useGroupBuying(orderDetails?.groupId);

  useEffect(() => {
    if (orderDetails?.status === 'confirmed') {
      Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success
      );
    }
  }, [orderDetails?.status]);

  const handleShare = async () => {
    if (!groupDetails) return;

    try {
      const result = await Share.share({
        message: `Join my group buy! Only ${formatPrice(groupDetails.groupPrice)}¥ each. ${groupDetails.remainingSlots} slots left!`,
        url: `https://your-app.com/group/${groupDetails.id}`,
      });

      if (result.action === Share.sharedAction) {
        Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success
        );
      }
    } catch (error) {
      Alert.alert('Error sharing', 'Please try again');
    }
  };

  const handleViewOrder = () => {
    navigation.navigate('OrderDetails', { orderId });
  };

  if (orderLoading || groupLoading) {
    return <LoadingScreen />;
  }

  if (orderError || groupError) {
    return <ErrorScreen onRetry={() => navigation.goBack()} />;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Order Confirmed!</Text>
          <Text style={styles.orderId}>
            Order #{orderDetails?.orderNumber}
          </Text>
        </View>

        <OrderStatus 
          status={orderDetails?.status}
          style={styles.section}
        />

        {type === 'team' && groupDetails && (
          <GroupInvite
            groupDetails={groupDetails}
            onShare={handleShare}
            style={styles.section}
          />
        )}

        <PaymentInfo
          paymentMethod={orderDetails?.paymentMethod}
          amount={orderDetails?.total}
          style={styles.section}
        />

        <ShippingInfo
          shippingInfo={orderDetails?.shippingInfo}
          estimatedDelivery={orderDetails?.estimatedDelivery}
          style={styles.section}
        />

        <View style={styles.actions}>
          <Button
            title="View Order Details"
            onPress={handleViewOrder}
            variant="outline"
            style={styles.button}
          />
          
          {type === 'team' && (
            <Button
              title="Share Group Buy"
              onPress={handleShare}
              style={styles.button}
            />
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
    gap: 16,
  },
  header: {
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#52c41a',
  },
  orderId: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  actions: {
    gap: 12,
    marginTop: 16,
    marginBottom: 32,
  },
  button: {
    width: '100%',
  },
});