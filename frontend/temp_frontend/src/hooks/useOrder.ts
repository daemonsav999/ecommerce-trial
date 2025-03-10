import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSocket } from './useSocket';
import { useAnalytics } from './useAnalytics';
import { api } from '../services/api';
import { OrderStatus, Order } from '../types/order';

export const useOrder = (orderId: string) => {
  const socket = useSocket();
  const queryClient = useQueryClient();
  const analytics = useAnalytics();

  // Fetch order details
  const { 
    data: orderDetails,
    isLoading,
    error,
    refetch 
  } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => api.get<Order>(`/orders/${orderId}`),
    onSuccess: (data) => {
      analytics.track('Order_Viewed', {
        orderId,
        status: data.status,
        total: data.total,
        type: data.type
      });
    }
  });

  // Update order status
  const updateStatusMutation = useMutation({
    mutationFn: (status: OrderStatus) =>
      api.patch(`/orders/${orderId}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries(['order', orderId]);
      analytics.track('Order_Status_Updated', {
        orderId,
        newStatus: status
      });
    }
  });

  // Cancel order
  const cancelOrderMutation = useMutation({
    mutationFn: (reason: string) =>
      api.post(`/orders/${orderId}/cancel`, { reason }),
    onSuccess: () => {
      queryClient.invalidateQueries(['order', orderId]);
      analytics.track('Order_Cancelled', {
        orderId,
        reason
      });
    }
  });

  // Listen for real-time updates
  useEffect(() => {
    if (!socket || !orderId) return;

    socket.emit('join_order', orderId);

    const handleOrderUpdate = (data: Partial<Order>) => {
      queryClient.setQueryData(['order', orderId], (old: Order | undefined) => ({
        ...old,
        ...data
      }));

      analytics.track('Order_Updated_RealTime', {
        orderId,
        updateType: Object.keys(data).join(',')
      });
    };

    socket.on(`order:${orderId}:updated`, handleOrderUpdate);

    return () => {
      socket.emit('leave_order', orderId);
      socket.off(`order:${orderId}:updated`);
    };
  }, [orderId, socket]);

  return {
    orderDetails,
    loading: isLoading,
    error,
    updateStatus: updateStatusMutation.mutateAsync,
    cancelOrder: cancelOrderMutation.mutateAsync,
    refetch
  };
};