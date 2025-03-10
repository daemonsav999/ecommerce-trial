import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '../services/api';

interface ShippingInfo {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'alipay' | 'wechat';
  details: any;
}

export const useCheckout = (productId: string) => {
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);

  const { data: orderDetails } = useQuery({
    queryKey: ['orderDetails', productId],
    queryFn: () => api.get(`/orders/preview/${productId}`),
  });

  const placeOrderMutation = useMutation({
    mutationFn: (data: {
      type: 'single' | 'team';
      shippingInfo: ShippingInfo;
      paymentMethod: PaymentMethod;
    }) => api.post('/orders', data),
  });

  const updateShippingInfo = (info: ShippingInfo) => {
    setShippingInfo(info);
  };

  const updatePaymentMethod = (method: PaymentMethod) => {
    setPaymentMethod(method);
  };

  const calculateTotal = () => {
    if (!orderDetails) return 0;

    const subtotal = orderDetails.price;
    const shipping = 0; // Calculate based on shipping method
    const tax = subtotal * 0.1; // Example tax calculation

    return subtotal + shipping + tax;
  };

  const placeOrder = async (data: {
    type: 'single' | 'team';
    shippingInfo: ShippingInfo;
    paymentMethod: PaymentMethod;
  }) => {
    return placeOrderMutation.mutateAsync(data);
  };

  return {
    orderDetails,
    shippingInfo,
    paymentMethod,
    updateShippingInfo,
    updatePaymentMethod,
    calculateTotal,
    placeOrder,
  };
};