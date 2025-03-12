import React, { useState } from 'react';
import { 
  View, 
  ScrollView, 
  StyleSheet, 
  Alert 
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { OrderSummary } from './components/OrderSummary';
import { PaymentMethods } from './components/PaymentMethods';
import { ShippingForm } from './components/ShippingForm';
import { GroupBuyingSummary } from './components/GroupBuyingSummary';
import { useCheckout } from '../../hooks/useCheckout';
import { useGroupBuying } from '../../hooks/useGroupBuying';
import { Button } from '../../components/ui/Button';
import * as Haptics from 'expo-haptics';

type CheckoutRouteProp = RouteProp<{
  Checkout: {
    productId: string;
    type: 'single' | 'team';
    groupId?: string;
  };
}, 'Checkout'>;

export const CheckoutScreen = () => {
  const route = useRoute<CheckoutRouteProp>();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const { 
    productId, 
    type, 
    groupId 
  } = route.params;

  const { 
    orderDetails,
    shippingInfo,
    paymentMethod,
    updateShippingInfo,
    updatePaymentMethod,
    calculateTotal,
    placeOrder
  } = useCheckout(productId);

  const {
    groupDetails,
    joinGroup,
    createGroup
  } = useGroupBuying(groupId);

  const handleCheckout = async () => {
    try {
      setLoading(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      if (type === 'team') {
        if (groupId) {
          await joinGroup({
            orderId: orderDetails.id,
            shippingInfo,
            paymentMethod
          });
        } else {
          await createGroup({
            productId,
            orderId: orderDetails.id,
            shippingInfo,
            paymentMethod
          });
        }
      } else {
        await placeOrder({
          type: 'single',
          shippingInfo,
          paymentMethod
        });
      }

      navigation.navigate('OrderConfirmation', {
        orderId: orderDetails.id,
        type
      });
    } catch (error) {
      Alert.alert(
        'Checkout Failed',
        'Please try again or contact support.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {type === 'team' && groupDetails && (
          <GroupBuyingSummary 
            groupDetails={groupDetails}
            style={styles.section}
          />
        )}

        <OrderSummary
          orderDetails={orderDetails}
          style={styles.section}
        />

        <ShippingForm
          initialValues={shippingInfo}
          onSubmit={updateShippingInfo}
          style={styles.section}
        />

        <PaymentMethods
          selected={paymentMethod}
          onSelect={updatePaymentMethod}
          style={styles.section}
        />

        <Button
          title={type === 'team' ? 'Join Group Buy' : 'Place Order'}
          onPress={handleCheckout}
          loading={loading}
          style={styles.checkoutButton}
        />
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
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  checkoutButton: {
    marginTop: 16,
    marginBottom: 32,
  },
});